import { NextResponse } from "next/server";
import { sql } from "@/lib/neon";
import { getAdminUser } from "@/lib/auth-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json(
      { error: "Nicht angemeldet oder keine Admin-Berechtigung." },
      { status: 401 }
    );
  }

  try {
    const categories = await sql`
      SELECT id, name, slug, sort_order, active
      FROM public.categories
      WHERE active = true
      ORDER BY sort_order ASC, name ASC
    `;

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Kategorien laden fehlgeschlagen:", error);

    return NextResponse.json(
      { error: "Kategorien konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json(
      { error: "Nicht angemeldet oder keine Admin-Berechtigung." },
      { status: 401 }
    );
  }

  try {
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
      INSERT INTO public."references" (
        title,
        slug,
        category_id,
        location,
        year,
        description,
        published,
        featured
      )
      VALUES (
        ${title},
        ${slug},
        ${categoryId},
        ${location},
        ${year},
        ${description},
        ${published},
        ${featured}
      )
      RETURNING
        id,
        title,
        slug,
        category_id,
        location,
        year,
        description,
        published,
        featured
    `;

    return NextResponse.json(
      {
        success: true,
        reference: result[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Neue Referenz erstellen fehlgeschlagen:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unbekannter Datenbankfehler";

    if (
      message.toLowerCase().includes("unique") ||
      message.toLowerCase().includes("duplicate")
    ) {
      return NextResponse.json(
        { error: "Dieser Slug ist bereits vergeben." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
