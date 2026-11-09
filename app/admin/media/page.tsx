
import { redirect } from 'next/navigation'

import PageMediaEditor from '../website-inhalte/PageMediaEditor'

import { sql } from '@/lib/neon'
import { getAdminUser } from '@/lib/auth-admin'
import { getHeroMedia } from '@/lib/site-content'

type PageMedia = {
  id: string
  page: string
  media_type: string
  storage_path: string | null
  public_url: string | null
  alt_text: string | null
  opacity: number | null
  visible: boolean
  created_at: string
  updated_at: string
}

export default async function AdminMediaPage() {
  // Zugriff nur für Administratoren
  const user = await getAdminUser()

  if (!user) {
    redirect('/admin/login')
  }

  /*
   * HERO-BILDER
   *
   * Bestehender Helper aus lib/site-content.
   */
  const [home, team, referenzen, news] = await Promise.all([
    getHeroMedia('home'),
    getHeroMedia('team'),
    getHeroMedia('referenzen'),
    getHeroMedia('news'),
  ])

  /*
   * DIENSTLEISTUNGEN – SERVICES-BILD
   *
   * Datenbankabfrage über Neon.
   * Das eigentliche Bild bleibt in Supabase Storage.
   */
  let dienstleistungenServices: PageMedia | null = null

  try {
    const result = (await sql`
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
      WHERE page = ${'dienstleistungen'}
        AND media_type = ${'services'}
      ORDER BY created_at DESC
      LIMIT 1
    `) as PageMedia[]

    dienstleistungenServices = result[0] ?? null
  } catch (error) {
    console.error(
      'DIENSTLEISTUNGEN SERVICES MEDIA ERROR:',
      error
    )
  }

  return (
    <main className="min-h-screen bg-[#F4F7FA]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1dabff]">
            Website
          </p>

          <h1 className="mt-2 text-4xl font-light tracking-tight">
            Seitenbilder
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
            Hier kannst du die Bilder der einzelnen
            Seiten verwalten. Bilder werden direkt in
            Supabase Storage gespeichert.
          </p>
        </div>

        <div className="grid gap-8">
          <PageMediaEditor
            page="home"
            mediaType="hero"
            title="Homepage – Hero-Bild"
            description="Das grosse Hintergrundbild der Startseite."
            initialMedia={home}
          />

          <PageMediaEditor
            page="team"
            mediaType="hero"
            title="Team – Hero-Bild"
            description="Das Hero-Bild der Team-Seite."
            initialMedia={team}
          />

          <PageMediaEditor
            page="referenzen"
            mediaType="hero"
            title="Referenzen – Hero-Bild"
            description="Das Hero-Bild der Referenzen-Seite."
            initialMedia={referenzen}
          />

          <PageMediaEditor
            page="news"
            mediaType="hero"
            title="News – Hero-Bild"
            description="Das Hero-Bild der News-Seite."
            initialMedia={news}
          />

          <PageMediaEditor
            page="dienstleistungen"
            mediaType="services"
            title="Dienstleistungen – Services-Bild"
            description="Dieses Bild wird im Bereich der Dienstleistungen verwendet, z. B. das Leonardo-da-Vinci-Bild."
            initialMedia={dienstleistungenServices}
          />
        </div>
      </div>
    </main>
  )
}
