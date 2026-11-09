
import { NextResponse } from "next/server";
import { Readable } from "node:stream";
import cloudinary from "@/lib/cloudinary";
import type {
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import { sql } from "@/lib/neon";
import { getAdminUser } from "@/lib/auth-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type ImageInput = {
  id?: string;
  image_url?: string;
  sort_order?: number;
};

function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId: string
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary hat kein Upload-Ergebnis geliefert."));
          return;
        }

        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

function getCloudinaryPublicId(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl);

    if (url.hostname !== "res.cloudinary.com") {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const uploadIndex = parts.indexOf("upload");

    if (uploadIndex === -1) {
      return null;
    }

    let publicIdParts = parts.slice(uploadIndex + 1);

    // Versionsangabe wie v1234567890 entfernen.
    if (
      publicIdParts.length > 0 &&
      /^v\d+$/.test(publicIdParts[0])
    ) {
      publicIdParts = publicIdParts.slice(1);
    }

    const publicId = publicIdParts.join("/").replace(/\.[^/.]+$/, "");

    if (!publicId.startsWith("mysan/reference-images/")) {
      return null;
    }

    return publicId;
  } catch {
    return null;
  }
}

/**
 * Neue Referenzbilder speichern
 * POST /api/admin/referenzen/[id]/bilder
 *
 * Unterstützt:
 * - multipart/form-data mit Dateien unter "images"
 * - bisheriges JSON-Format mit image_url
 */
export async function POST(
  request: Request,
  { params }: RouteContext
) {
  if (!(await getAdminUser())) {
    return NextResponse.json(
      { error: "Keine Admin-Berechtigung." },
      { status: 401 }
    );
  }

  const uploadedPublicIds: string[] = [];

  try {
    const { id } = await params;
    const contentType = request.headers.get("content-type") ?? "";
    const insertedImages = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const files = formData.getAll("images");

      if (files.length === 0) {
        return NextResponse.json(
          { error: "Es wurden keine Bilder ausgewählt." },
          { status: 400 }
        );
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!(file instanceof File) || file.size === 0) {
          throw new Error("Eine der ausgewählten Dateien ist ungültig.");
        }

        if (!file.type.startsWith("image/")) {
          throw new Error("Es sind nur Bilddateien erlaubt.");
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const publicId = `${id}-${crypto.randomUUID()}`;

        const uploaded = await uploadToCloudinary(
          buffer,
          "mysan/reference-images",
          publicId
        );

        uploadedPublicIds.push(uploaded.public_id);

        const sortOrderValue = formData.get(`sort_order_${i}`);
        const parsedSortOrder = Number(sortOrderValue);
        const sortOrder =
          Number.isInteger(parsedSortOrder) && parsedSortOrder >= 0
            ? parsedSortOrder
            : i;

        const result = await sql`
          INSERT INTO public.reference_images (
            reference_id,
            image_url,
            sort_order
          )
          VALUES (
            ${id},
            ${uploaded.secure_url},
            ${sortOrder}
          )
          RETURNING id, image_url, sort_order
        `;

        if (result.length > 0) {
          insertedImages.push(result[0]);
        }
      }

      return NextResponse.json({
        success: true,
        image: insertedImages[0] ?? null,
        images: insertedImages,
      });
    }

    // Bisheriges JSON-Format vorübergehend weiter unterstützen.
    const body = await request.json();
    const images = body.images;

    if (!Array.isArray(images)) {
      return NextResponse.json(
        { error: "Ungültige Bilddaten." },
        { status: 400 }
      );
    }

    for (let i = 0; i < images.length; i++) {
      const image = images[i] as ImageInput;
      const imageUrl = String(image?.image_url ?? "").trim();

      if (!imageUrl) {
        return NextResponse.json(
          { error: "Eine Bild-URL fehlt." },
          { status: 400 }
        );
      }

      const sortOrder =
        Number.isInteger(image.sort_order) && image.sort_order! >= 0
          ? image.sort_order!
          : i;

      const result = await sql`
        INSERT INTO public.reference_images (
          reference_id,
          image_url,
          sort_order
        )
        VALUES (
          ${id},
          ${imageUrl},
          ${sortOrder}
        )
        RETURNING id, image_url, sort_order
      `;

      if (result.length > 0) {
        insertedImages.push(result[0]);
      }
    }

    return NextResponse.json({
      success: true,
      image: insertedImages[0] ?? null,
      images: insertedImages,
    });
  } catch (error) {
    console.error("Referenzbilder speichern fehlgeschlagen:", error);

    // Bereits hochgeladene Cloudinary-Bilder bei einem Fehler aufräumen.
    await Promise.all(
      uploadedPublicIds.map(async (publicId) => {
        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });
        } catch (cleanupError) {
          console.error(
            "Cloudinary-Bild konnte nicht bereinigt werden:",
            cleanupError
          );
        }
      })
    );

    return NextResponse.json(
      {
        error: "Die Referenzbilder konnten nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}

/**
 * Bildreihenfolge ändern
 * PATCH /api/admin/referenzen/[id]/bilder
 */
export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  if (!(await getAdminUser())) {
    return NextResponse.json(
      { error: "Keine Admin-Berechtigung." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const images = body.images;

    if (!Array.isArray(images)) {
      return NextResponse.json(
        { error: "Ungültige Bilddaten." },
        { status: 400 }
      );
    }

    for (const image of images as ImageInput[]) {
      const imageId = String(image?.id ?? "").trim();
      const sortOrder = image?.sort_order;

      if (!imageId || !Number.isInteger(sortOrder) || sortOrder! < 0) {
        return NextResponse.json(
          { error: "Ungültige Bild-ID oder Sortierung." },
          { status: 400 }
        );
      }

      await sql`
        UPDATE public.reference_images
        SET sort_order = ${sortOrder}
        WHERE id = ${imageId}
          AND reference_id = ${id}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bildreihenfolge ändern fehlgeschlagen:", error);

    return NextResponse.json(
      {
        error: "Die Bildreihenfolge konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}

/**
 * Bild aus Neon und Cloudinary entfernen
 * DELETE /api/admin/referenzen/[id]/bilder
 */
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  if (!(await getAdminUser())) {
    return NextResponse.json(
      { error: "Keine Admin-Berechtigung." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const imageId = String(body.imageId ?? "").trim();

    if (!imageId) {
      return NextResponse.json(
        { error: "Die Bild-ID fehlt." },
        { status: 400 }
      );
    }

    const images = await sql`
      SELECT id, image_url
      FROM public.reference_images
      WHERE id = ${imageId}
        AND reference_id = ${id}
      LIMIT 1
    `;

    if (images.length === 0) {
      return NextResponse.json(
        { error: "Das Bild wurde nicht gefunden." },
        { status: 404 }
      );
    }

    const imageUrl = String(images[0].image_url ?? "");
    const publicId = getCloudinaryPublicId(imageUrl);

    await sql`
      DELETE FROM public.reference_images
      WHERE id = ${imageId}
        AND reference_id = ${id}
    `;

    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
        });
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary-Bild konnte nicht gelöscht werden:",
          cloudinaryError
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Referenzbild löschen fehlgeschlagen:", error);

    return NextResponse.json(
      {
        error: "Das Referenzbild konnte nicht gelöscht werden.",
      },
      { status: 500 }
    );
  }
}
