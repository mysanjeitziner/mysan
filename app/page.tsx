import Link from 'next/link'
import PageHero from '@/components/page-hero'
import { createClient } from '@/lib/supabase/server'

const MYSAN_BLUE = '#1dabff'

type Reference = {
  id: string
  title: string
  slug: string
  location?: string | null
  year?: number | null
  published?: boolean
  featured?: boolean
}

type ReferenceImage = {
  id: string
  reference_id: string
  image_url: string
  sort_order?: number | null
}

type News = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  image_url?: string | null
  published?: boolean
  featured?: boolean
  created_at: string
}

export default async function HomePage() {
  const supabase = await createClient()

  /* =========================================================
     REFERENZEN
  ========================================================= */

  const { data: referencesData } = await supabase
    .from('references')
    .select(`
      id,
      title,
      slug,
      location,
      year,
      published,
      featured
    `)
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', {
      ascending: false,
    })
    .limit(3)

  const references =
    (referencesData as Reference[] | null) || []

  /* =========================================================
     REFERENZ-BILDER
  ========================================================= */

  const referenceIds = references.map(
    (reference) => reference.id
  )

  let referenceImages: ReferenceImage[] = []

  if (referenceIds.length > 0) {
    const { data: imagesData } = await supabase
      .from('reference_images')
      .select(`
        id,
        reference_id,
        image_url,
        sort_order
      `)
      .in('reference_id', referenceIds)
      .order('sort_order', {
        ascending: true,
      })

    referenceImages =
      (imagesData as ReferenceImage[] | null) || []
  }

  /* =========================================================
     NEWS
  ========================================================= */

  const { data: newsData } = await supabase
    .from('news')
    .select(`
      id,
      title,
      slug,
      excerpt,
      image_url,
      published,
      featured,
      created_at
    `)
    .eq('published', true)
    .order('created_at', {
      ascending: false,
    })
    .limit(3)

  const news =
    (newsData as News[] | null) || []

  /* =========================================================
     HILFSFUNKTIONEN
  ========================================================= */

  function getReferenceImage(referenceId: string) {
    return referenceImages.find(
      (image) =>
        image.reference_id === referenceId
    )?.image_url
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat(
      'de-CH',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
    ).format(new Date(date))
  }

  return (
    <div className="bg-white text-neutral-900">

      {/* =====================================================
          HERO
      ===================================================== */}

      <PageHero
        eyebrow="mySan Jeitziner"
        title={
          <>
            Ihr
            <br />

            <span
              style={{
                color: MYSAN_BLUE,
              }}
            >
              Sanitär
            </span>

            <br />

            im Wallis
          </>
        }
        description={
          <>
            Für sämtliche Sanitärarbeiten
            <br className="hidden md:block" />
            in und ums Haus.
          </>
        }
        image="/auto.png"
        imageOpacity={0.18}
      >

        <div className="flex flex-wrap gap-4">

          <Link
            href="/kontakt"
            className="inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
            style={{
              backgroundColor: MYSAN_BLUE,
            }}
          >
            Kontakt aufnehmen

            <span className="ml-3 text-lg">
              →
            </span>
          </Link>

          <Link
            href="/referenzen"
            className="inline-flex h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-50"
            style={{
              borderColor: MYSAN_BLUE,
              color: MYSAN_BLUE,
            }}
          >
            Referenzen
          </Link>

        </div>

      </PageHero>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="relative overflow-hidden">

        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{
            backgroundColor: MYSAN_BLUE,
          }}
        />

        <div className="mx-auto max-w-7xl px-8 py-24 md:px-12 md:py-32 lg:px-16">

          <div className="grid gap-16 md:grid-cols-2 md:items-center">

            <div>

              <p
                className="text-sm font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                mySan Jeitziner
              </p>

              <h2 className="mt-5 text-4xl font-light leading-tight tracking-tight md:text-6xl">

                Persönlich.
                <br />

                Kompetent.
                <br />

                <span
                  style={{
                    color: MYSAN_BLUE,
                  }}
                >
                  Zuverlässig.
                </span>

              </h2>

            </div>

            <div>

              <p className="text-lg leading-8 text-neutral-600">

                Wir sind Ihr Ansprechpartner für
                Sanitär und Heizung im Wallis.

                <br />
                <br />

                Von kleinen Reparaturen bis zu
                kompletten Installationen begleiten
                wir unsere Kunden kompetent und
                zuverlässig.

              </p>

              <Link
                href="/ueber-uns"
                className="mt-8 inline-flex items-center text-sm font-semibold"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Mehr über uns

                <span className="ml-3">
                  →
                </span>
              </Link>

            </div>

          </div>

        </div>

      </section>

     

      {/* =====================================================
          REFERENZEN
      ===================================================== */}

      <section className="bg-[#F4F7FA]">

        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{
            backgroundColor: MYSAN_BLUE,
          }}
        />

        <div className="mx-auto max-w-7xl px-8 py-24 md:px-12 md:py-32 lg:px-16">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div>

              <p
                className="text-sm font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Projekte
              </p>

              <h2 className="mt-5 text-4xl font-light tracking-tight md:text-6xl">
                Unsere Referenzen
              </h2>

            </div>

            <Link
              href="/referenzen"
              className="text-sm font-semibold"
              style={{
                color: MYSAN_BLUE,
              }}
            >
              Alle Referenzen →
            </Link>

          </div>

          {references.length > 0 ? (

            <div className="mt-14 grid gap-8 md:grid-cols-3">

              {references.map((reference) => {

                const image =
                  getReferenceImage(reference.id)

                return (

                  <Link
                    key={reference.id}
                    href={`/referenzen/${reference.slug}`}
                    className="group"
                  >

                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F7FA]">

                      {image ? (

                        <img
                          src={image}
                          alt={reference.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                          Kein Bild vorhanden
                        </div>

                      )}

                    </div>

                    <div className="border-b border-neutral-200 pb-6 pt-5">

                      <h3 className="text-xl font-medium">
                        {reference.title}
                      </h3>

                      {(reference.location ||
                        reference.year) && (

                        <p className="mt-2 text-sm text-neutral-500">

                          {reference.location}

                          {reference.location &&
                            reference.year &&
                            ' · '}

                          {reference.year}

                        </p>

                      )}

                      <div
                        className="mt-4 text-sm font-semibold"
                        style={{
                          color: MYSAN_BLUE,
                        }}
                      >
                        Referenz ansehen →
                      </div>

                    </div>

                  </Link>

                )
              })}

            </div>

          ) : (

            <div className="mt-14 border border-dashed border-neutral-300 p-12 text-center text-neutral-500">

              Die ersten Referenzen werden
              demnächst veröffentlicht.

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          NEWS
      ===================================================== */}

      {news.length > 0 && (

        <section className="bg-[#F4F7FA]">

          <div className="mx-auto max-w-7xl px-8 py-24 md:px-12 md:py-32 lg:px-16">

            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

              <div>

                <p
                  className="text-sm font-semibold uppercase tracking-[0.2em]"
                  style={{
                    color: MYSAN_BLUE,
                  }}
                >
                  Aktuelles
                </p>

                <h2 className="mt-5 text-4xl font-light tracking-tight md:text-6xl">
                  News
                </h2>

              </div>

              <Link
                href="/news"
                className="text-sm font-semibold"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Alle News →
              </Link>

            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">

              {news.map((item) => (

                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="group bg-white"
                >

                  {item.image_url ? (

                    <div className="aspect-[16/10] overflow-hidden">

                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                    </div>

                  ) : (

                    <div
                      className="aspect-[16/10]"
                      style={{
                        backgroundColor: MYSAN_BLUE,
                      }}
                    />

                  )}

                  <div className="p-7">

                    <p className="text-xs font-medium text-neutral-400">
                      {formatDate(item.created_at)}
                    </p>

                    <h3 className="mt-3 text-xl font-medium">
                      {item.title}
                    </h3>

                    {item.excerpt && (

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
                        {item.excerpt}
                      </p>

                    )}

                    <div
                      className="mt-6 text-sm font-semibold"
                      style={{
                        color: MYSAN_BLUE,
                      }}
                    >
                      Weiterlesen →
                    </div>

                  </div>

                </Link>

              ))}

            </div>

          </div>

        </section>

      )}

      {/* =====================================================
          KONTAKT
      ===================================================== */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: MYSAN_BLUE,
        }}
      >

        <div className="mx-auto max-w-7xl px-8 py-24 md:px-12 md:py-32 lg:px-16">

          <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-end">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
                Kontakt
              </p>

              <h2 className="mt-5 max-w-3xl text-4xl font-light leading-tight tracking-tight text-white md:text-6xl">

                Sie haben Fragen
                <br />
                oder ein Projekt?

              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">

                Wir beraten Sie gerne persönlich
                und finden gemeinsam die passende
                Lösung.

              </p>

            </div>

            <Link
              href="/kontakt"
              className="inline-flex w-fit items-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
            >

              Kontakt aufnehmen

              <span className="ml-4 text-lg">
                →
              </span>

            </Link>

          </div>

        </div>

      </section>

    </div>
  )
}