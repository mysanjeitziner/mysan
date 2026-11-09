import { sql } from "@/lib/neon";

export const SITE_MEDIA_BUCKET = "site-media";

export const SITE_PAGES = [
  "home",
  "team",
  "referenzen",
  "news",
] as const;

export type SitePage = (typeof SITE_PAGES)[number];

export type SiteContent = {
  id: string;
  page: string;
  section: string;
  content_key: string;
  content: string;
  visible: boolean;
  sort_order: number;
};

export type PageMedia = {
  id: string;
  page: SitePage;
  media_type: string;
  storage_path: string | null;
  public_url: string | null;
  alt_text: string | null;
  opacity: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

/* =========================================================
   WEBSITE-TEXTE AUS NEON LADEN
   ========================================================= */

export async function getSiteContent(
  page?: string
): Promise<SiteContent[]> {
  try {
    const data = page
      ? await sql`
          SELECT
            id,
            page,
            section,
            content_key,
            content,
            visible,
            sort_order
          FROM public.site_content
          WHERE page = ${page}
          ORDER BY sort_order ASC
        `
      : await sql`
          SELECT
            id,
            page,
            section,
            content_key,
            content,
            visible,
            sort_order
          FROM public.site_content
          ORDER BY sort_order ASC
        `;

    return data as SiteContent[];
  } catch (error) {
    console.error(
      "Fehler beim Laden der Website-Inhalte aus Neon:",
      error
    );

    return [];
  }
}

/* =========================================================
   EINZELNEN CONTENT HOLEN

   Verhalten:
   - kein DB-Eintrag       → Fallback
   - DB-Eintrag sichtbar   → Inhalt
   - DB-Eintrag unsichtbar → leer
   ========================================================= */

export function getContent(
  contents: SiteContent[],
  section: string,
  key: string,
  fallback = ""
): string {
  const item = contents.find(
    (content) =>
      content.section === section &&
      content.content_key === key
  );

  // Kein Eintrag vorhanden
  if (!item) {
    return fallback;
  }

  // Eintrag vorhanden, aber deaktiviert
  if (!item.visible) {
    return "";
  }

  // Gespeicherte Zeichenfolgen "\\n" in Zeilenumbrüche umwandeln
  return item.content.replace(/\\n/g, "\n");
}

/* =========================================================
   PAGE MEDIA AUS NEON LADEN
   ========================================================= */

export async function getPageMedia(
  page: SitePage,
  mediaType = "hero"
): Promise<PageMedia | null> {
  try {
    const data = await sql`
      SELECT
        id,
        page,
        media_type,
        storage_path,
        public_url,
        alt_text,
        opacity,
        visible,
        created_at,
        updated_at
      FROM public.page_media
      WHERE page = ${page}
        AND media_type = ${mediaType}
      LIMIT 1
    `;

    if (data.length === 0) {
      return null;
    }

    return data[0] as PageMedia;
  } catch (error) {
    console.error(
      `Fehler beim Laden von page_media aus Neon (${page}):`,
      error
    );

    return null;
  }
}

/* =========================================================
   STORAGE URL

   Die Dateien liegen vorerst weiterhin in Supabase Storage.
   ========================================================= */

export function getStorageUrl(
  storagePath: string | null | undefined
): string | null {
  if (!storagePath) {
    return null;
  }

  const path = storagePath.trim();

  if (!path) {
    return null;
  }

  // Bereits vollständige URLs direkt verwenden
  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  // Lokale oder absolute Pfade direkt verwenden
  if (path.startsWith("/")) {
    return path;
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL fehlt. Storage-URL kann nicht erstellt werden."
    );

    return null;
  }

  return `${supabaseUrl}/storage/v1/object/public/${SITE_MEDIA_BUCKET}/${path}`;
}

/* =========================================================
   MEDIA URL
   ========================================================= */

export function getMediaUrl(
  media: PageMedia | null
): string | null {
  if (!media || !media.visible) {
    return null;
  }

  if (media.public_url) {
    return media.public_url;
  }

  return getStorageUrl(media.storage_path);
}

/* =========================================================
   HERO
   ========================================================= */

export async function getHeroMedia(
  page: SitePage
): Promise<PageMedia | null> {
  return getPageMedia(page, "hero");
}
