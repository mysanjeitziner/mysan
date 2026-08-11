import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const MYSAN_BLUE = '#1dabff'

type News = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  image_url?: string | null
  published?: boolean
  featured?: boolean
  created_at: string
}

export default async function NewsPage() {
  const supabase = await createClient()

  /* =========================================================
     NEWS AUS SUPABASE
  ========================================================= */

  const { data: newsData, error: newsError } = await supabase
    .from('news')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      image_url,
      published,
      featured,
      created_at
    `)
    .eq('published', true)
    .order('created_at', {
      ascending: false,
    })

  const news = (newsData as News[] | null) || []

  /* =========================================================
     DATUM
  ========================================================= */

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date))
  }

  return (
    <main className="bg-white text-neutral-900">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">

        {/* Blauer linker Rand */}

        <div
          className="absolute left-0 top-0 z-30 h-full w-2"
          style={{
            backgroundColor: MYSAN_BLUE,
          }}
        />

        {/* Hintergrundbild */}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10">

          <div className="mx-auto max-w-7xl px-8 md:px-12 lg:px-16">

            <div
              className="
                relative
                overflow-hidden
                [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]
                [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]
              "
            >

              <img
                src="/news.jpg"
                alt=""
                aria-hidden="true"
                className="
                  h-auto
                  w-full
                  object-cover
                  object-center
                  opacity-[0.18]
                "
              />

              {/* Oberer Übergang */}

              <div
                className="
                  absolute
                  inset-x-0
                  top-0
                  h-24
                  bg-gradient-to-b
                  from-white
                  to-transparent
                "
              />

              {/* Unterer Übergang */}

              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  h-32
                  bg-gradient-to-t
                  from-white
                  via-white/80
                  to-transparent
                "
              />

            </div>

          </div>

        </div>

        {/* Hero Inhalt */}

        <div
          className="
            relative
            z-20
            mx-auto
            max-w-7xl
            px-8
            pb-10
            pt-28
            md:px-12
            md:pb-12
            md:pt-36
            lg:px-16
          "
        >

          <div className="max-w-3xl">

            {/* Blauer Strich */}

            <div
              className="mb-5 h-1 w-16"
              style={{
                backgroundColor: MYSAN_BLUE,
              }}
            />

            {/* Eyebrow */}

            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.25em]
              "
              style={{
                color: MYSAN_BLUE,
              }}
            >
              mySan Jeitziner
            </p>

            {/* Titel */}

            <h1
              className="
                mt-4
                text-5xl
                font-light
                leading-[1.05]
                tracking-tight
                md:text-6xl
                lg:text-7xl
              "
            >
              Aktuelles
              <br />

              <span
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                von mySan
              </span>
            </h1>

            {/* Beschreibung */}

            <p
              className="
                mt-6
                max-w-2xl
                text-lg
                font-light
                leading-7
                text-neutral-600
                md:text-xl
              "
            >
              Neuigkeiten, Projekte und Einblicke
              rund um mySan Jeitziner.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          NEWS
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">

        {/* Blauer linker Rand */}

        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{
            backgroundColor: MYSAN_BLUE,
          }}
        />

        <div
          className="
            mx-auto
            max-w-7xl
            px-8
            pb-16
            pt-8
            md:px-12
            md:pb-20
            md:pt-10
            lg:px-16
          "
        >

          {/* Überschrift */}

          <div className="mb-8">

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
              "
              style={{
                color: MYSAN_BLUE,
              }}
            >
              
            </p>

            <h2
              className="
                mt-2
                text-3xl
                font-light
                tracking-tight
                md:text-4xl
              "
            >
             
            </h2>

          </div>


          {/* =================================================
              FEHLER
          ================================================= */}

          {newsError && (
            <div
              className="
                border
                border-red-200
                bg-red-50
                px-6
                py-5
                text-sm
                text-red-700
              "
            >
              Die News konnten momentan nicht geladen werden.
            </div>
          )}


          {/* =================================================
              KEINE NEWS
          ================================================= */}

          {!newsError && news.length === 0 && (
            <div
              className="
                border
                border-dashed
                border-neutral-300
                px-6
                py-12
                text-center
                text-sm
                text-neutral-500
              "
            >
              Aktuell gibt es keine Neuigkeiten.
            </div>
          )}


          {/* =================================================
              NEWS GRID
          ================================================= */}

          {news.length > 0 && (
            <div
              className="
                grid
                gap-x-6
                gap-y-10
                md:grid-cols-2
                lg:grid-cols-3
              "
            >

              {news.map((item) => (

                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group block"
                >

                  {/* Bild */}

                  <div
                    className="
                      relative
                      aspect-[16/10]
                      overflow-hidden
                      bg-[#F4F7FA]
                    "
                  >

                    {item.image_url ? (

                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition
                          duration-700
                          group-hover:scale-105
                        "
                      />

                    ) : (

                      <div
                        className="
                          flex
                          h-full
                          w-full
                          items-center
                          justify-center
                        "
                        style={{
                          backgroundColor: MYSAN_BLUE,
                        }}
                      >

                        <div className="text-center text-white">

                          <svg
                            viewBox="0 0 24 24"
                            className="mx-auto h-8 w-8 opacity-80"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M12 2.5C12 2.5 5.5 10.1 5.5 15.2C5.5 19.2 8.4 22 12 22s6.5-2.8 6.5-6.8C18.5 10.1 12 2.5 12 2.5Z" />
                          </svg>

                        </div>

                      </div>

                    )}

                  </div>


                  {/* Inhalt */}

                  <div
                    className="
                      relative
                      border-b
                      border-neutral-200
                      pb-6
                      pt-5
                    "
                  >

                    {/* Blauer Strich */}

                    <div
                      className="
                        absolute
                        left-0
                        top-0
                        h-full
                        w-1
                      "
                      style={{
                        backgroundColor: MYSAN_BLUE,
                      }}
                    />

                    <div className="pl-4">

                      {/* Datum */}

                      <p className="text-xs font-medium text-neutral-400">
                        {formatDate(item.created_at)}
                      </p>


                      {/* Titel */}

                      <h3
                        className="
                          mt-2
                          text-xl
                          font-light
                          leading-tight
                          transition-colors
                          duration-200
                          group-hover:text-[#1dabff]
                        "
                      >
                        {item.title}
                      </h3>


                      {/* Kurztext */}

                      {item.excerpt && (
                        <p
                          className="
                            mt-3
                            line-clamp-3
                            text-sm
                            leading-6
                            text-neutral-600
                          "
                        >
                          {item.excerpt}
                        </p>
                      )}


                      {/* Link */}

                      <div
                        className="
                          mt-4
                          text-sm
                          font-semibold
                        "
                        style={{
                          color: MYSAN_BLUE,
                        }}
                      >
                        Weiterlesen
                        <span className="ml-2">
                          →
                        </span>
                      </div>

                    </div>

                  </div>

                </Link>

              ))}

            </div>
          )}

        </div>

      </section>


      {/* =====================================================
          KONTAKT
      ===================================================== */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: MYSAN_BLUE,
        }}
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-8
            py-12
            md:px-12
            md:py-14
            lg:px-16
          "
        >

          <div
            className="
              flex
              flex-col
              gap-6
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-white/60
                "
              >
                Kontakt
              </p>

              <h2
                className="
                  mt-2
                  text-3xl
                  font-light
                  text-white
                  md:text-4xl
                "
              >
                Sie haben ein Projekt?
              </h2>

              <p className="mt-2 text-sm text-white/75">
                Wir freuen uns über Ihre Kontaktaufnahme.
              </p>

            </div>


            <Link
              href="/kontakt"
              className="
                inline-flex
                w-fit
                items-center
                rounded-full
                bg-white
                px-6
                py-3
                text-sm
                font-semibold
                text-neutral-900
                transition
                hover:bg-neutral-100
              "
            >
              Kontakt aufnehmen

              <span className="ml-3 text-lg">
                →
              </span>
            </Link>

          </div>

        </div>

      </section>

    </main>
  )
}