import PageMediaEditor from '../website-inhalte/PageMediaEditor'

import {
  getHeroMedia,
} from '@/lib/site-content'

import { createClient } from '@/lib/supabase/server'

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
  const supabase = await createClient()

  /* =========================================================
     HERO-BILDER
  ========================================================= */

  const [
    home,
    team,
    referenzen,
    news,
  ] = await Promise.all([
    getHeroMedia('home'),
    getHeroMedia('team'),
    getHeroMedia('referenzen'),
    getHeroMedia('news'),
  ])

  /* =========================================================
     DIENSTLEISTUNGEN SERVICES-BILD
     
     Wir suchen gezielt:
     
     page = dienstleistungen
     media_type = services
  ========================================================= */

  const {
    data: dienstleistungenServicesData,
    error: dienstleistungenServicesError,
  } = await supabase
    .from('page_media')
    .select(`
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
    `)
    .eq('page', 'dienstleistungen')
    .eq('media_type', 'services')
    .order('created_at', {
      ascending: false,
    })
    .limit(1)
    .maybeSingle()

  const dienstleistungenServices =
    dienstleistungenServicesData as PageMedia | null

  if (dienstleistungenServicesError) {
    console.error(
      'DIENSTLEISTUNGEN SERVICES MEDIA ERROR:',
      dienstleistungenServicesError
    )
  }

  return (
    <main className="min-h-screen bg-[#F4F7FA]">

      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* =====================================================
            HEADER
        ===================================================== */}

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

          {/* =================================================
              HOME
          ================================================= */}

          <PageMediaEditor
            page="home"
            mediaType="hero"
            title="Homepage – Hero-Bild"
            description="Das grosse Hintergrundbild der Startseite."
            initialMedia={home}
          />

          {/* =================================================
              TEAM
          ================================================= */}

          <PageMediaEditor
            page="team"
            mediaType="hero"
            title="Team – Hero-Bild"
            description="Das Hero-Bild der Team-Seite."
            initialMedia={team}
          />

          {/* =================================================
              REFERENZEN
          ================================================= */}

          <PageMediaEditor
            page="referenzen"
            mediaType="hero"
            title="Referenzen – Hero-Bild"
            description="Das Hero-Bild der Referenzen-Seite."
            initialMedia={referenzen}
          />

          {/* =================================================
              NEWS
          ================================================= */}

          <PageMediaEditor
            page="news"
            mediaType="hero"
            title="News – Hero-Bild"
            description="Das Hero-Bild der News-Seite."
            initialMedia={news}
          />

          {/* =================================================
              DIENSTLEISTUNGEN
              
              WICHTIG:
              Dieses Bild ist NICHT das Hero-Bild.
              Es ist das Bild für den Bereich
              Dienstleistungen / Da Vinci.
          ================================================= */}

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