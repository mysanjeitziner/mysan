
import Link from 'next/link'
import { notFound } from 'next/navigation'
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

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function NewsDetailPage({
  params,
}: PageProps) {
  const { slug } = await params

  const supabase = await createClient()

  /* =========================================================
     NEWS AUS SUPABASE
  ========================================================= */

  const { data: newsData } = await supabase
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
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!newsData) {
    notFound()
  }

  const news = newsData as News

  /* =========================================================
     DATUM
  ========================================================= */

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('de-CH', {
      day: '2-digit',
      month: 'long',
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

        {news.image_url && (
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
                  src={news.image_url}
                  alt=""
                  aria-hidden="true"
                  className="
                    h-auto
                    max-h-[600px]
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
                    h-28
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
                    h-40
                    bg-gradient-to-t
                    from-white
                    via-white/70
                    to-transparent
                  "
                />

              </div>

            </div>

          </div>
        )}

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
            md:pb-14
            md:pt-36
            lg:px-16
          "
        >

          <div className="max-w-4xl">

            {/* Blauer Strich */}

            <div
              className="mb-5 h-1 w-16"
              style={{
                backgroundColor: MYSAN_BLUE,
              }}
            />

            {/* Kategorie */}

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
              mySan Jeitziner · News
            </p>

            {/* Datum */}

            <p className="mt-4 text-sm text-neutral-400">
              {formatDate(news.created_at)}
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
              {news.title}
            </h1>

            {/* Kurzbeschreibung */}

            {news.excerpt && (
              <p
                className="
                  mt-7
                  max-w-3xl
                  text-lg
                  font-light
                  leading-8
                  text-neutral-600
                  md:text-xl
                "
              >
                {news.excerpt}
              </p>
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          NEWS INHALT
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
            max-w-4xl
            px-8
            pb-16
            pt-8
            md:px-12
            md:pb-20
            md:pt-10
          "
        >

          {/* Hauptbild */}

          {news.image_url && (
            <div className="mb-10 overflow-hidden rounded-sm shadow-[0_12px_40px_rgba(0,0,0,0.10)]">

              <img
                src={news.image_url}
                alt={news.title}
                className="
                  h-auto
                  w-full
                  object-cover
                "
              />

            </div>
          )}


          {/* Inhalt */}

          {news.content ? (

            <article
              className="
                prose
                prose-neutral
                max-w-none
                prose-headings:font-light
                prose-headings:tracking-tight
                prose-h2:mt-10
                prose-h2:text-3xl
                prose-h3:mt-8
                prose-h3:text-2xl
                prose-p:text-base
                prose-p:leading-8
                prose-p:text-neutral-700
                prose-a:text-[#1dabff]
                prose-strong:font-semibold
              "
            >
              {news.content}
            </article>

          ) : (

            <p className="text-base leading-8 text-neutral-600">
              Für diese News wurde noch kein Inhalt hinterlegt.
            </p>

          )}


          {/* Zurück */}

          <div className="mt-12 border-t border-neutral-200 pt-7">

            <Link
              href="/news"
              className="
                inline-flex
                items-center
                text-sm
                font-semibold
                transition-colors
                hover:text-[#1dabff]
              "
              style={{
                color: MYSAN_BLUE,
              }}
            >
              <span className="mr-3 text-lg">
                ←
              </span>

              Zurück zu den News
            </Link>

          </div>

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

