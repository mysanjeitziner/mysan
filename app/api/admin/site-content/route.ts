
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth-admin";
import { sql } from "@/lib/neon";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const user = await getAdminUser();

  if (!user) {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    const user = await requireAdmin();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht angemeldet oder keine Berechtigung." },
        { status: 401 }
      );
    }

    const contents = await sql`
      SELECT
        id,
        page,
        section,
        content_key,
        content,
        sort_order,
        visible,
        created_at,
        updated_at
      FROM public.site_content
      ORDER BY page, section, sort_order
    `;

    return NextResponse.json({ contents });
  } catch (error) {
    console.error("SITE CONTENT GET ERROR:", error);

    return NextResponse.json(
      { error: "Die Website-Inhalte konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAdmin();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht angemeldet oder keine Berechtigung." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, content, visible } = body;

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof visible !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Ungültige Daten zum Speichern." },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE public.site_content
      SET content = ${content},
          visible = ${visible},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, content_key, content, visible
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Kein passender Inhalt in Neon gefunden." },
        { status: 404 }
      );
    }

    return NextResponse.json({ content: result[0] });
  } catch (error) {
    console.error("SITE CONTENT PATCH ERROR:", error);

    return NextResponse.json(
      { error: "Die Website-Inhalte konnten nicht gespeichert werden." },
      { status: 500 }
    );
  }
}
