import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import WebsiteContentEditor from '../WebsiteContentEditor'
import PageMediaEditor from '../PageMediaEditor'

/* =========================================================
   SEITEN
========================================================= */

const pages = [
  {
    slug: 'home',
    title: 'Home',
  },
  {
    slug: 'dienstleistungen',
    title: 'Dienstleistungen',
  },
  {
    slug: 'referenzen',
    title: 'Referenzen',
  },
  {
    slug: 'team',
    title: 'Team',
  },
  {
    slug: 'news',
    title: 'News',
  },
  {
    slug: 'kontakt',
    title: 'Kontakt',
  },
  {
    slug: 'datenschutz',
    title: 'Datenschutz',
  },
  {
    slug: 'impressum',
    title: 'Impressum',
  },
  {
    slug: 'footer',
    title: 'Footer',
  },
]

/* =========================================================
   SEITEN-INFORMATIONEN
========================================================= */

const pageInformation: Record<
  string,
  {
    title: string
    description: string
  }
> = {
  home: {
    title: 'Home',
    description:
      'Texte, Inhalte und Bilder der Startseite bearbeiten.',
  },

  dienstleistungen: {
    title: 'Dienstleistungen',
    description:
      'Texte, Inhalte und Bilder der Dienstleistungsseite bearbeiten.',
  },

  referenzen: {
    title: 'Referenzen',
    description:
      'Texte, Inhalte und Bilder der Referenzseite bearbeiten.',
  },

  team: {
    title: 'Team',
    description:
      'Texte und Bilder der Teamseite bearbeiten.',
  },

  news: {
    title: 'News',
    description:
      'Texte, Inhalte und Bilder der News-Seite bearbeiten.',
  },

  kontakt: {
    title: 'Kontakt',
    description:
      'Texte, Kontaktinformationen und Bilder bearbeiten.',
  },

  datenschutz: {
    title: 'Datenschutz',
    description:
      'Datenschutzerklärung und Informationen zum Umgang mit personenbezogenen Daten bearbeiten.',
  },

  impressum: {
    title: 'Impressum',
    description:
      'Unternehmensangaben und rechtliche Informationen bearbeiten.',
  },

  footer: {
    title: 'Footer',
    description:
      'Texte und Inhalte des Footers bearbeiten.',
  },
}

/* =========================================================
   TYPES
========================================================= */

type PageMedia = {
  id: string
  page: string
  media_type: string
  storage_path: string | null
  public_url: string | null
  alt_text: string | null
  opacity: number
  visible: boolean
  created_at: string
  updated_at: string
}

/* =========================================================
   PAGE
========================================================= */

export default async function WebsiteInhaltPage({
  params,
}: {
  params: Promise<{
    page: string
  }>
}) {
  const { page } = await params

  const information = pageInformation[page]

  if (!information) {
    notFound()
  }

  const supabase = await createClient()

  /* =========================================================
     WEBSITE-INHALTE
  ========================================================= */

  const {
    data: contents,
    error: contentError,
  } = await supabase
    .from('site_content')
    .select(`
      id,
      page,
      section,
      content_key,
      content,
      sort_order,
      visible,
      created_at,
      updated_at
    `)
    .eq('page', page)
    .order('sort_order', {
      ascending: true,
    })

  /* =========================================================
     PAGE MEDIA

     WICHTIG:
     Nur EINMAL abfragen.

     Dadurch gibt es keinen Fehler:
     "mediaError is defined multiple times"
  ========================================================= */

  const {
    data: mediaData,
    error: pageMediaError,
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
    .eq('page', page)
    .order('created_at', {
      ascending: true,
    })

  const media =
    (mediaData as PageMedia[] | null) || []

  /* =========================================================
     FEHLER WEBSITE-INHALTE
  ========================================================= */

  if (contentError) {
    return (
      <main className="min-h-screen bg-gray-100 p-6 md:p-8">

        <div className="mx-auto max-w-7xl">

          <WebsitePagesNavigation
            currentPage={page}
          />

          <div className="mt-8">

            <div className="mb-4 h-1 w-14 bg-[#1dabff]" />

            <h1 className="text-3xl font-bold md:text-4xl">
              {information.title}
            </h1>

            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">

              <p className="font-semibold">
                Fehler beim Laden der Website-Inhalte
              </p>

              <p className="mt-1 text-sm">
                {contentError.message}
              </p>

            </div>

          </div>

        </div>

      </main>
    )
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-8">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            SEITENNAVIGATION
        ================================================= */}

        <WebsitePagesNavigation
          currentPage={page}
        />

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mt-8">

          <div className="mb-4 h-1 w-14 bg-[#1dabff]" />

          <h1 className="text-3xl font-bold md:text-4xl">
            {information.title}
          </h1>

          <p className="mt-2 text-gray-500">
            {information.description}
          </p>

        </div>

        {/* =================================================
            HINWEIS TEXTE
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

          <div className="flex gap-4">

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#1dabff]
                text-sm
                font-bold
                text-white
              "
            >
              i
            </div>

            <div>

              <h2 className="font-semibold text-gray-900">
                Texte bearbeiten
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Bearbeite hier die Inhalte der Seite{' '}
                <strong>{information.title}</strong>.
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Du kannst bei jedem Inhalt festlegen,
                ob er auf der Website angezeigt werden soll.
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            TEXT EDITOR
        ================================================= */}

        <div className="mt-8">

          <WebsiteContentEditor
            initialContents={contents || []}
          />

        </div>

        {/* =================================================
            BILDER
        ================================================= */}

        <section className="mt-10">

          <div className="mb-6">

            <div className="mb-3 h-1 w-14 bg-[#1dabff]" />

            <h2 className="text-2xl font-bold md:text-3xl">
              Bilder
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
              Hier kannst du die Bilder dieser Seite
              verwalten. Bilder werden im Supabase Storage
              im Bucket <strong>page-media</strong> gespeichert.
            </p>

          </div>

          {/* =================================================
              FEHLER MEDIA
          ================================================= */}

          {pageMediaError && (

            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">

              <h3 className="font-semibold text-red-800">
                Fehler beim Laden der Bilder
              </h3>

              <p className="mt-1 text-sm text-red-700">
                {pageMediaError.message}
              </p>

            </div>

          )}

          {/* =================================================
              HERO
          ================================================= */}

          <PageMediaEditor
            page={page}
            mediaType="hero"
            title="Hero-Bild"
            description="Das Hauptbild oben auf der Seite."
            initialMedia={
              media.find(
                (item) =>
                  item.media_type === 'hero'
              ) || null
            }
          />

          {/* =================================================
              TEAM ZUSATZBILD
          ================================================= */}

          {page === 'team' && (

            <div className="mt-6">

              <PageMediaEditor
                page={page}
                mediaType="team"
                title="Zusätzliches Team-Bild"
                description="Das zweite Bild auf der Teamseite."
                initialMedia={
                  media.find(
                    (item) =>
                      item.media_type === 'team'
                  ) || null
                }
              />

            </div>

          )}

          {/* =================================================
              REFERENZEN BILD
          ================================================= */}

          {page === 'referenzen' && (

            <div className="mt-6">

              <PageMediaEditor
                page={page}
                mediaType="references"
                title="Referenzen-Bild"
                description="Bild für den oberen Bereich der Referenzseite."
                initialMedia={
                  media.find(
                    (item) =>
                      item.media_type === 'references'
                  ) || null
                }
              />

            </div>

          )}

          {/* =================================================
              NEWS BILD
          ================================================= */}

          {page === 'news' && (

            <div className="mt-6">

              <PageMediaEditor
                page={page}
                mediaType="news"
                title="News-Bild"
                description="Bild für den oberen Bereich der News-Seite."
                initialMedia={
                  media.find(
                    (item) =>
                      item.media_type === 'news'
                  ) || null
                }
              />

            </div>

          )}

          {/* =================================================
              KONTAKT BILD
          ================================================= */}

          {page === 'kontakt' && (

            <div className="mt-6">

              <PageMediaEditor
                page={page}
                mediaType="contact"
                title="Kontakt-Bild"
                description="Bild für den Kontaktbereich."
                initialMedia={
                  media.find(
                    (item) =>
                      item.media_type === 'contact'
                  ) || null
                }
              />

            </div>

          )}

          {/* =================================================
              DIENSTLEISTUNGEN BILD
          ================================================= */}

          {page === 'dienstleistungen' && (

            <div className="mt-6">

              <PageMediaEditor
                page={page}
                mediaType="services"
                title="Dienstleistungen-Bild"
                description="Bild für die Dienstleistungsseite."
                initialMedia={
                  media.find(
                    (item) =>
                      item.media_type === 'services'
                  ) || null
                }
              />

            </div>

          )}

        </section>

        {/* =================================================
            ZUSAMMENFASSUNG
        ================================================= */}

        <section className="mt-8 mb-8 rounded-2xl border border-neutral-200 bg-white p-5">

          <div className="flex gap-4">

            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-neutral-100
                text-sm
                text-neutral-500
              "
            >
              i
            </div>

            <div>

              <h3 className="font-semibold text-neutral-800">
                Medienverwaltung
              </h3>

              <p className="mt-1 text-sm leading-6 text-neutral-500">
                Die Bilder werden im Supabase Storage im
                Bucket <strong>page-media</strong> gespeichert.
                Die Zuordnung zur jeweiligen Seite erfolgt
                über die Tabelle <strong>page_media</strong>.
              </p>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Beim Ersetzen eines Bildes kann das alte Bild
                aus dem Storage gelöscht werden. Die Transparenz,
                Sichtbarkeit und der Alt-Text werden ebenfalls
                in der Datenbank gespeichert.
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  )
}


/* =========================================================
   SEITENNAVIGATION
========================================================= */

function WebsitePagesNavigation({
  currentPage,
}: {
  currentPage: string
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">

      <div className="flex flex-wrap items-center gap-2">

        {/* ZURÜCK */}

        <Link
          href="/admin/website-inhalte"
          className="
            rounded-lg
            px-3
            py-2
            text-sm
            font-medium
            text-gray-500
            transition
            hover:bg-gray-100
            hover:text-gray-900
          "
        >
          ← Alle Website-Inhalte
        </Link>

        <div className="hidden h-6 w-px bg-gray-200 md:block" />

        {/* SEITEN */}

        {pages.map((item) => {

          const active =
            item.slug === currentPage

          return (

            <Link
              key={item.slug}
              href={`/admin/website-inhalte/${item.slug}`}
              className={`
                rounded-lg
                px-3
                py-2
                text-sm
                font-medium
                transition
                ${
                  active
                    ? 'bg-[#1dabff] text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              {item.title}
            </Link>

          )
        })}

      </div>

    </div>
  )
}