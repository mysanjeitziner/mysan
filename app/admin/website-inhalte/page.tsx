import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const pages = [
  {
    slug: 'home',
    title: 'Home',
    description: 'Startseite und zentrale Inhalte',
    icon: '⌂',
  },
  {
    slug: 'dienstleistungen',
    title: 'Dienstleistungen',
    description: 'Texte und Leistungen',
    icon: '◈',
  },
  {
    slug: 'referenzen',
    title: 'Referenzen',
    description: 'Texte rund um die Referenzen',
    icon: '▧',
  },
   {
    slug: 'news',
    title: 'News',
    description: 'Texte rund um die News',
    icon: '▧',
  },
  {
    slug: 'team',
    title: 'Team',
    description: 'Team und Unternehmensvorstellung',
    icon: '♙',
  },
  {
    slug: 'kontakt',
    title: 'Kontakt',
    description: 'Kontaktseite und Kontaktinformationen',
    icon: '✉',
  },
  {
    slug: 'datenschutz',
    title: 'Datenschutz',
    description: 'Datenschutzerklärung und rechtliche Hinweise',
    icon: '⚿',
  },
  {
    slug: 'impressum',
    title: 'Impressum',
    description: 'Unternehmensangaben und rechtliche Informationen',
    icon: '§',
  },
  {
    slug: 'footer',
    title: 'Footer',
    description: 'Texte und Links im Footer',
    icon: '▾',
  },
]

type SiteContentCount = {
  page: string
  visible: boolean
}

type PageMedia = {
  id: string
  page: string
  media_type: string
  storage_path: string | null
  public_url: string | null
  alt_text: string | null
  opacity: number
  visible: boolean
}

export default async function WebsiteInhaltePage() {
  const supabase = await createClient()

  /* =========================================================
     WEBSITE-INHALTE
  ========================================================= */

  const {
    data: contents,
    error,
  } = await supabase
    .from('site_content')
    .select(`
      page,
      visible
    `)

  /* =========================================================
     BILDER
  ========================================================= */

  const {
    data: mediaData,
    error: mediaError,
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
      visible
    `)
    .order('page', {
      ascending: true,
    })
    .order('media_type', {
      ascending: true,
    })

  const media =
    (mediaData as PageMedia[] | null) || []

  /* =========================================================
     COUNTS
  ========================================================= */

  const pageCounts: Record<string, number> = {}
  const visibleCounts: Record<string, number> = {}

  if (!error && contents) {
    ;(contents as SiteContentCount[]).forEach(
      (item) => {
        pageCounts[item.page] =
          (pageCounts[item.page] || 0) + 1

        if (item.visible !== false) {
          visibleCounts[item.page] =
            (visibleCounts[item.page] || 0) + 1
        }
      }
    )
  }

  /* =========================================================
     MEDIA COUNTS
  ========================================================= */

  const mediaCounts: Record<string, number> = {}

  media.forEach((item) => {
    mediaCounts[item.page] =
      (mediaCounts[item.page] || 0) + 1
  })

  /* =========================================================
     MEDIA NACH SEITE
  ========================================================= */

  const mediaByPage: Record<string, PageMedia[]> = {}

  media.forEach((item) => {
    if (!mediaByPage[item.page]) {
      mediaByPage[item.page] = []
    }

    mediaByPage[item.page].push(item)
  })

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-8">

      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div>

          <h1 className="text-3xl font-bold md:text-4xl">
            Website-Inhalte
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500">
            Hier kannst du die Texte und Bilder deiner
            Website bearbeiten. Wähle zuerst die
            gewünschte Seite aus.
          </p>

        </div>


        {/* =====================================================
            HINWEIS
        ===================================================== */}

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
                Website verwalten
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Wähle eine Seite aus, um Texte zu bearbeiten
                und Bilder hochzuladen, zu ersetzen oder zu
                löschen.
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Bei Bildern kannst du zusätzlich die
                Transparenz und den Anzeige-Status
                einstellen.
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            FEHLER
        ===================================================== */}

        {error && (

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">

            <h2 className="font-semibold text-red-800">
              Fehler beim Laden der Website-Inhalte
            </h2>

            <p className="mt-1 text-sm text-red-700">
              {error.message}
            </p>

          </div>

        )}


        {mediaError && (

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">

            <h2 className="font-semibold text-red-800">
              Fehler beim Laden der Bilder
            </h2>

            <p className="mt-1 text-sm text-red-700">
              {mediaError.message}
            </p>

            <p className="mt-2 text-xs text-red-600">
              Bitte kontrolliere, ob die Tabelle
              <strong> page_media </strong>
              existiert.
            </p>

          </div>

        )}


        {/* =====================================================
            SEITEN
        ===================================================== */}

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {pages.map((page) => {

            const count =
              pageCounts[page.slug] || 0

            const visibleCount =
              visibleCounts[page.slug] || 0

            const hiddenCount =
              count - visibleCount

            const pageMedia =
              mediaByPage[page.slug] || []

            return (

              <Link
                key={page.slug}
                href={`/admin/website-inhalte/${page.slug}`}
                className="
                  group
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  p-6
                  shadow-sm
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[#1dabff]
                  hover:shadow-md
                "
              >

                {/* =================================================
                    ICON + PFEIL
                ================================================= */}

                <div className="flex items-start justify-between">

                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#1dabff]/10
                      text-2xl
                      text-[#1dabff]
                      transition
                      group-hover:bg-[#1dabff]
                      group-hover:text-white
                    "
                  >
                    {page.icon}
                  </div>

                  <span
                    className="
                      text-gray-300
                      transition
                      group-hover:text-[#1dabff]
                    "
                  >
                    →
                  </span>

                </div>


                {/* =================================================
                    TITEL
                ================================================= */}

                <h2 className="mt-5 text-xl font-semibold text-gray-900">
                  {page.title}
                </h2>


                {/* =================================================
                    BESCHREIBUNG
                ================================================= */}

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {page.description}
                </p>


                {/* =================================================
                    INHALTE
                ================================================= */}

                <div className="mt-5 border-t pt-4">

                  {count === 0 ? (

                    <span className="text-xs font-medium text-gray-400">
                      Noch keine Inhalte
                    </span>

                  ) : (

                    <div className="flex flex-wrap items-center gap-2">

                      <span
                        className="
                          inline-flex
                          items-center
                          rounded-full
                          bg-gray-100
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          text-gray-600
                        "
                      >
                        {count}{' '}
                        {count === 1
                          ? 'Inhalt'
                          : 'Inhalte'}
                      </span>

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-green-50
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          text-green-700
                        "
                      >

                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                        {visibleCount} sichtbar

                      </span>

                      {hiddenCount > 0 && (

                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            bg-neutral-100
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            text-neutral-500
                          "
                        >

                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />

                          {hiddenCount} ausgeblendet

                        </span>

                      )}

                    </div>

                  )}

                </div>


                {/* =================================================
                    BILDER
                ================================================= */}

                <div className="mt-4 border-t pt-4">

                  <div className="flex items-center justify-between">

                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Bilder
                    </span>

                    <span
                      className={`
                        inline-flex
                        items-center
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        ${
                          pageMedia.length > 0
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-100 text-gray-400'
                        }
                      `}
                    >
                      {pageMedia.length}
                      {' '}
                      {pageMedia.length === 1
                        ? 'Bild'
                        : 'Bilder'}
                    </span>

                  </div>


                  {/* MEDIA VORSCHAU */}

                  {pageMedia.length > 0 && (

                    <div className="mt-3 flex gap-2">

                      {pageMedia
                        .slice(0, 3)
                        .map((item) => (

                          <div
                            key={item.id}
                            className="
                              relative
                              h-14
                              w-20
                              overflow-hidden
                              rounded-lg
                              border
                              border-gray-200
                              bg-gray-100
                            "
                          >

                            {item.public_url ? (

                              <img
                                src={item.public_url}
                                alt={
                                  item.alt_text ||
                                  item.media_type
                                }
                                className="h-full w-full object-cover"
                              />

                            ) : (

                              <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                                Kein Bild
                              </div>

                            )}

                            <div
                              className="
                                absolute
                                bottom-0
                                left-0
                                right-0
                                bg-black/60
                                px-1
                                py-0.5
                                text-center
                                text-[9px]
                                text-white
                              "
                            >
                              {item.media_type}
                            </div>

                          </div>

                        ))}

                    </div>

                  )}

                </div>

              </Link>

            )
          })}

        </div>


        {/* =====================================================
            INFO UNTEN
        ===================================================== */}

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5">

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
                Texte & Bilder
              </h3>

              <p className="mt-1 text-sm leading-6 text-neutral-500">
                Texte werden weiterhin über
                <strong> site_content </strong>
                verwaltet. Bilder werden über
                <strong> page_media </strong>
                mit dem Supabase-Storage-Bucket
                <strong> page-media </strong>
                verbunden.
              </p>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Beim Team können mehrere Bilder verwendet
                werden, beispielsweise
                <strong> hero </strong>
                für das Hero-Bild und
                <strong> team </strong>
                für das zusätzliche Team-Foto.
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  )
}