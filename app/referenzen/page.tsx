
import Link from 'next/link'
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
  created_at?: string
}

type ReferenceImage = {
  id: string
  reference_id: string
  image_url: string
  sort_order?: number | null
}

export default async function ReferenzenPage() {
  const supabase = await createClient()

  /* =========================================================
     REFERENZEN AUS SUPABASE
  ========================================================= */

  const { data: referencesData, error: referencesError } =
    await supabase
      .from('references')
      .select(`
        id,
        title,
        slug,
        location,
        year,
        published,
        featured,
        created_at
      `)
      .eq('published', true)
      .order('created_at', {
        ascending: false,
      })

  const references =
    (referencesData as Reference[] | null) || []

  /* =========================================================
     BILDER AUS SUPABASE
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
     ERSTES BILD EINER REFERENZ
  ========================================================= */

  function getReferenceImage(referenceId: string) {
    return referenceImages.find(
      (image) =>
        image.reference_id === referenceId
    )?.image_url
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

        {/* Wasser / dezenter Hintergrund */}

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
  src="/badewanne.jpg"
  alt=""
  aria-hidden="true"
  className="
    h-auto
    w-full
    object-cover
    object-center
    opacity-[0.40]
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
                  h-24
                  bg-gradient-to-t
                  from-white
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
              Unsere
              <br />

              <span
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Referenzen
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
              Einblick in ausgewählte Projekte
              und Arbeiten von mySan Jeitziner.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          REFERENZEN
      ===================================================== */}

      <section className="relative overflow-hidden">

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
            pb-14
            pt-6
            md:px-12
            md:pb-18
            md:pt-8
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
              Projekte
            </p>

            <h2 className="mt-2 text-3xl font-light tracking-tight md:text-4xl">
              Sanitärarbeiten mit Qualität
            </h2>

          </div>


          {/* =================================================
              KEINE REFERENZEN
          ================================================= */}

          {references.length === 0 && (

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
              Aktuell sind keine Referenzen veröffentlicht.
            </div>

          )}


          {/* =================================================
              REFERENZ-GRID
          ================================================= */}

          {references.length > 0 && (

            <div
              className="
                grid
                gap-x-6
                gap-y-10
                md:grid-cols-2
                lg:grid-cols-3
              "
            >

              {references.map((reference) => {

                const image =
                  getReferenceImage(reference.id)

                return (

                  <Link
                    key={reference.id}
                    href={`/referenzen/${reference.slug}`}
                    className="group block"
                  >

                    {/* Bild */}

                    <div
                      className="
                        relative
                        aspect-[4/3]
                        overflow-hidden
                        bg-[#F4F7FA]
                      "
                    >

                      {image ? (

                        <img
                          src={image}
                          alt={reference.title}
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
                            items-center
                            justify-center
                            text-sm
                            text-neutral-400
                          "
                        >
                          Kein Bild vorhanden
                        </div>

                      )}

                    </div>


                    {/* Inhalt */}

                    <div
                      className="
                        relative
                        border-b
                        border-neutral-200
                        pb-5
                        pt-4
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

                        {/* Tropfen */}

                        <div
                          className="mb-3 flex h-7 w-7 items-center"
                          style={{
                            color: MYSAN_BLUE,
                          }}
                        >

                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M12 2.5C12 2.5 5.5 10.1 5.5 15.2C5.5 19.2 8.4 22 12 22s6.5-2.8 6.5-6.8C18.5 10.1 12 2.5 12 2.5Z" />
                          </svg>

                        </div>


                        {/* Titel */}

                        <h3
                          className="
                            text-xl
                            font-light
                            transition-colors
                            duration-200
                            group-hover:text-[#1dabff]
                          "
                        >
                          {reference.title}
                        </h3>


                        {/* Ort / Jahr */}

                        {(reference.location ||
                          reference.year) && (

                          <p className="mt-1.5 text-sm text-neutral-500">

                            {reference.location}

                            {reference.location &&
                              reference.year &&
                              ' · '}

                            {reference.year}

                          </p>

                        )}

                      </div>

                    </div>

                  </Link>

                )
              })}

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

              <h2 className="mt-2 text-3xl font-light text-white md:text-4xl">
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

