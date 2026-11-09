import { NextResponse } from "next/server";
import { sql } from "@/lib/neon";
import { getAdminUser } from "@/lib/auth-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function checkAuth() {
  const admin = await getAdminUser();
  return Boolean(admin);
}

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  if (!(await checkAuth())) {
    return NextResponse.json(
      { error: "Nicht angemeldet oder keine Admin-Berechtigung." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    const references = await sql`
      SELECT
        id,
        title,
        slug,
        category_id,
        location,
        year,
        description,
        published,
        featured
      FROM public."references"
      WHERE id = ${id}
      LIMIT 1
    `;

    if (references.length === 0) {
      return NextResponse.json(
        { error: "Referenz nicht gefunden." },
        { status: 404 }
      );
    }

    const categories = await sql`
      SELECT id, name, slug, sort_order, active
      FROM public.categories
      ORDER BY sort_order ASC, name ASC
    `;

    const images = await sql`
      SELECT id, image_url, sort_order
      FROM public.reference_images
      WHERE reference_id = ${id}
      ORDER BY sort_order ASC
    `;

    return NextResponse.json(
      {
        reference: references[0],
        categories,
        images,
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error("Referenz laden fehlgeschlagen:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  if (!(await checkAuth())) {
    return NextResponse.json(
      { error: "Nicht angemeldet oder keine Admin-Berechtigung." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const title = String(body.title ?? "").trim();
    const slug = String(body.slug ?? "").trim();
    const categoryId = body.category_id || null;
    const location = String(body.location ?? "").trim() || null;

    const year =
      body.year === null || body.year === ""
        ? null
        : Number(body.year);

    const description =
      String(body.description ?? "").trim() || null;

    const published = body.published === true;
    const featured = body.featured === true;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Titel und Slug sind erforderlich." },
        { status: 400 }
      );
    }

    if (year !== null && !Number.isInteger(year)) {
      return NextResponse.json(
        { error: "Das Jahr muss eine ganze Zahl sein." },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE public."references"
      SET
        title = ${title},
        slug = ${slug},
        category_id = ${categoryId},
        location = ${location},
        year = ${year},
        description = ${description},
        published = ${published},
        featured = ${featured}
      WHERE id = ${id}
      RETURNING
        id,
        title,
        slug,
        description
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Referenz nicht gefunden." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      reference: result[0],
    });
  } catch (error) {
    console.error("Referenz speichern fehlgeschlagen:", error);

    return NextResponse.json(
      { error: "Die Referenz konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  if (!(await checkAuth())) {
    return NextResponse.json(
      { error: "Nicht angemeldet oder keine Admin-Berechtigung." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    /*
     * 1. Prüfen, ob die Referenz existiert.
     */

    const references = await sql`
      SELECT id, title
      FROM public."references"
      WHERE id = ${id}
      LIMIT 1
    `;

    if (references.length === 0) {
      return NextResponse.json(
        { error: "Referenz nicht gefunden." },
        { status: 404 }
      );
    }

    /*
     * 2. Zugehörige Bilddatensätze zählen.
     */

    const imageRows = await sql`
      SELECT id
      FROM public.reference_images
      WHERE reference_id = ${id}
    `;

    /*
     * 3. Referenz löschen.
     *
     * Voraussetzung: Die Fremdschlüsselbeziehung
     * reference_images.reference_id verwendet
     * ON DELETE CASCADE.
     */

    const result = await sql`
      DELETE FROM public."references"
      WHERE id = ${id}
      RETURNING id, title
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Referenz konnte nicht gefunden werden." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Referenz erfolgreich gelöscht.",
      deletedReference: result[0],
      deletedImageRecords: imageRows.length,
    });
  } catch (error) {
    console.error("Referenz löschen fehlgeschlagen:", error);

    return NextResponse.json(
      {
        error: "Die Referenz konnte nicht gelöscht werden.",
      },
      { status: 500 }
    );
  }
}
