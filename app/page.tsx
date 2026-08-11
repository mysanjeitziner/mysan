import Link from 'next/link'
import SiteHeader from '@/components/site-header'
import { createClient } from '@/lib/supabase/server'

const MYSAN_BLUE = '#3C70B7'

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

  /*
   * =========================================================
   * REFERENZEN
   * =========================================================
   */

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

  /*
   * =========================================================
   * REFERENZ-BILDER
   * =========================================================
   */

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
      .in(
        'reference_id',
        referenceIds
      )
      .order('sort_order', {
        ascending: true,
      })

    referenceImages =
      (imagesData as ReferenceImage[] | null) || []
  }

  /*
   * =========================================================
   * NEWS
   * =========================================================
   */

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

  /*
   * =========================================================
   * HILFSFUNKTIONEN
   * =========================================================
   */

  function getReferenceImage(
    referenceId: string
  ) {
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
    <main className="min-h-screen bg-white text-neutral-900">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <SiteHeader />

     {/* =====================================================
    HERO
===================================================== */}

<section className="relative min-h-screen overflow-hidden bg-white">

  {/* Blauer linker Rand */}

  <div
    className="absolute left-0 top-0 z-30 h-full w-2"
    style={{
      backgroundColor: MYSAN_BLUE,
    }}
  />

  {/* Dezenter Hintergrund */}

  <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#F4F7FA]" />

  {/* =================================================
      TEXT
  ================================================= */}

  <div className="relative z-20 mx-auto flex min-h-screen max-w-7xl items-start px-8 pb-[42vh] pt-36 md:px-12 md:pb-[38vh] md:pt-40 lg:px-16">

    <div className="max-w-3xl">

      {/* Kleiner blauer Strich */}

      <div
        className="mb-6 h-1 w-16"
        style={{
          backgroundColor: MYSAN_BLUE,
        }}
      />

      {/* Firma */}

      <p
        className="text-sm font-semibold uppercase tracking-[0.25em]"
        style={{
          color: MYSAN_BLUE,
        }}
      >
        mySan Jeitziner
      </p>

      {/* Haupttitel */}

      <h1 className="mt-5 text-5xl font-light leading-[1.05] tracking-tight text-neutral-900 md:text-7xl lg:text-8xl">

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

      </h1>

      {/* Beschreibung */}

      <p className="mt-8 max-w-xl text-xl font-light leading-8 text-neutral-600 md:text-2xl">

        Für sämtliche Sanitärarbeiten
        <br className="hidden md:block" />
        in und ums Haus.

      </p>

      {/* Buttons */}

      <div className="mt-10 flex flex-wrap gap-4">

        <Link
          href="/kontakt"
          className="inline-flex items-center rounded-full px-7 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
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
          className="inline-flex items-center rounded-full border px-7 py-3.5 text-sm font-semibold transition hover:bg-gray-50"
          style={{
            borderColor: MYSAN_BLUE,
            color: MYSAN_BLUE,
          }}
        >
          Referenzen
        </Link>

      </div>

    </div>

  </div>

{/* =================================================
    AUTO – DEZENTES, WEICH AUSLAUFENDES HINTERGRUNDMOTIV
================================================= */}

<div className="pointer-events-none absolute left-0 right-0 top-0 z-10">

  <div className="mx-auto max-w-7xl px-8 md:px-12 lg:px-16">

    <div
      className="
        relative
        overflow-hidden
        [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_88%,transparent_100%)]
        [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_88%,transparent_100%)]
      "
    >

      <img
        src="/auto.png"
        alt=""
        aria-hidden="true"
        className="
          h-auto
          w-full
          object-contain
          object-left-top
          opacity-20
        "
      />

      {/* Oberer weicher Übergang */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-32
          bg-gradient-to-b
          from-white
          via-white/40
          to-transparent
        "
      />

      {/* Unterer weicher Übergang */}

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-40
          bg-gradient-to-t
          from-white
          via-white/50
          to-transparent
        "
      />

    </div>

  </div>

</div>

  {/* =================================================
      HERZLICH WILLKOMMEN
  ================================================= */}

  <div className="absolute bottom-8 left-10 z-30 md:left-16">

    <p
      className="text-sm font-medium tracking-wide"
      style={{
        color: MYSAN_BLUE,
      }}
    >
      Herzlich Willkommen
    </p>

  </div>

  {/* =================================================
      SCROLL HINWEIS
  ================================================= */}

  <div className="absolute bottom-8 right-8 z-30 hidden items-center gap-3 text-xs text-neutral-400 md:flex">

    <span>
      Entdecken
    </span>

    <span
      className="h-px w-10"
      style={{
        backgroundColor: MYSAN_BLUE,
      }}
    />

  </div>

</section>
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
                Mysan Jeitziner
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
                href="/kontakt"
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
          LEISTUNGEN
      ===================================================== */}

      <section className="bg-[#F4F7FA]">

        <div className="mx-auto max-w-7xl px-8 py-24 md:px-12 md:py-32 lg:px-16">

          <div className="max-w-2xl">

            <p
              className="text-sm font-semibold uppercase tracking-[0.2em]"
              style={{
                color: MYSAN_BLUE,
              }}
            >
              Unsere Leistungen
            </p>

            <h2 className="mt-5 text-4xl font-light tracking-tight md:text-6xl">

              Alles rund um
              <br />

              <span
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Sanitär & Heizung
              </span>

            </h2>

          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">

            {/* Sanitär */}

            <Link
              href="/sanitaer"
              className="group relative overflow-hidden bg-white p-8 transition hover:-translate-y-1 md:p-12"
            >

              <div
                className="absolute left-0 top-0 h-full w-1 transition-all group-hover:w-2"
                style={{
                  backgroundColor: MYSAN_BLUE,
                }}
              />

              <div className="flex items-start justify-between">

                <span
                  className="text-sm font-semibold"
                  style={{
                    color: MYSAN_BLUE,
                  }}
                >
                  01
                </span>

                <span
                  className="text-3xl transition-transform duration-300 group-hover:translate-x-2"
                  style={{
                    color: MYSAN_BLUE,
                  }}
                >
                  →
                </span>

              </div>

              <h3 className="mt-20 text-4xl font-light">
                Sanitär
              </h3>

              <p className="mt-5 max-w-md leading-7 text-neutral-600">

                Sämtliche Sanitärarbeiten für
                Neubauten, Umbauten und
                Renovationen.

              </p>

              <div
                className="mt-8 text-sm font-semibold"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Mehr erfahren →
              </div>

            </Link>

            {/* Heizung */}

            <Link
              href="/heizung"
              className="group relative overflow-hidden bg-white p-8 transition hover:-translate-y-1 md:p-12"
            >

              <div
                className="absolute left-0 top-0 h-full w-1 transition-all group-hover:w-2"
                style={{
                  backgroundColor: MYSAN_BLUE,
                }}
              />

              <div className="flex items-start justify-between">

                <span
                  className="text-sm font-semibold"
                  style={{
                    color: MYSAN_BLUE,
                  }}
                >
                  02
                </span>

                <span
                  className="text-3xl transition-transform duration-300 group-hover:translate-x-2"
                  style={{
                    color: MYSAN_BLUE,
                  }}
                >
                  →
                </span>

              </div>

              <h3 className="mt-20 text-4xl font-light">
                Heizung
              </h3>

              <p className="mt-5 max-w-md leading-7 text-neutral-600">

                Moderne und effiziente
                Heizlösungen für Ihr Zuhause
                und Ihr Gebäude.

              </p>

              <div
                className="mt-8 text-sm font-semibold"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Mehr erfahren →
              </div>

            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          REFERENZEN
      ===================================================== */}

      <section className="relative">

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
                  getReferenceImage(
                    reference.id
                  )

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
                      {formatDate(
                        item.created_at
                      )}
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

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-neutral-950 text-white">

        <div className="mx-auto max-w-7xl px-8 py-14 md:px-12 lg:px-16">

          <div className="grid gap-12 md:grid-cols-3">

            {/* Firma */}

            <div>

              <div className="flex items-center gap-3">

                <div
                  className="flex h-11 w-11 items-center justify-center"
                  style={{
                    backgroundColor: MYSAN_BLUE,
                  }}
                >
                  <span className="text-2xl text-white">
                    y
                  </span>
                </div>

                <div>

                  <div className="text-xl font-medium">
                    mySan
                  </div>

                  <div className="text-xs font-bold tracking-wide text-white/60">
                    JEITZINER
                  </div>

                </div>

              </div>

              <p className="mt-6 max-w-xs text-sm leading-6 text-white/50">

                Sanitär und Heizung
                <br />
                im Wallis.

              </p>

            </div>

            {/* Navigation */}

            <div>

              <h3 className="text-sm font-semibold">
                Navigation
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-white/50">

                <Link
                  href="/"
                  className="hover:text-white"
                >
                  Startseite
                </Link>

                <Link
                  href="/sanitaer"
                  className="hover:text-white"
                >
                  Sanitär
                </Link>

                <Link
                  href="/heizung"
                  className="hover:text-white"
                >
                  Heizung
                </Link>

                <Link
                  href="/referenzen"
                  className="hover:text-white"
                >
                  Referenzen
                </Link>

                <Link
                  href="/news"
                  className="hover:text-white"
                >
                  News
                </Link>

                <Link
                  href="/kontakt"
                  className="hover:text-white"
                >
                  Kontakt
                </Link>

              </div>

            </div>

            {/* Rechtliches */}

            <div>

              <h3 className="text-sm font-semibold">
                Rechtliches
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm text-white/50">

                <Link
                  href="/impressum"
                  className="hover:text-white"
                >
                  Impressum
                </Link>

                <Link
                  href="/datenschutz"
                  className="hover:text-white"
                >
                  Datenschutz
                </Link>

                <Link
                  href="/cookies"
                  className="hover:text-white"
                >
                  Cookies
                </Link>

              </div>

            </div>

          </div>

          <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/30 md:flex-row">

            <p>
              © {new Date().getFullYear()} Mysan Jeitziner
            </p>

            <p>
              Sanitär · Heizung · Service
            </p>

          </div>

        </div>

      </footer>

    </main>
  )
}