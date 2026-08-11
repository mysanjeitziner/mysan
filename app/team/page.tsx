
import Link from 'next/link'

const MYSAN_BLUE = '#1dabff'

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">

        {/* Blauer linker Rand */}
        <div
          className="absolute left-0 top-0 z-30 h-full w-2"
          style={{ backgroundColor: MYSAN_BLUE }}
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
                src="/wir.jpg"
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
              style={{ backgroundColor: MYSAN_BLUE }}
            />

            {/* Eyebrow */}
            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.25em]
              "
              style={{ color: MYSAN_BLUE }}
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
              Gerne stellen
              <br />

              <span style={{ color: MYSAN_BLUE }}>
                wir uns vor.
              </span>
            </h1>

          </div>
        </div>

      </section>


      {/* =====================================================
          TEAM
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">

        {/* Blauer linker Rand */}
        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{ backgroundColor: MYSAN_BLUE }}
        />

        <div
          className="
            mx-auto
            max-w-7xl
            px-8
            py-10
            md:px-12
            md:py-14
            lg:px-16
          "
        >

          <div
            className="
              grid
              gap-12
              md:grid-cols-[0.85fr_1.15fr]
              md:items-center
            "
          >

            {/* =================================================
                LINKE SEITE
            ================================================= */}

            <div>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                "
                style={{ color: MYSAN_BLUE }}
              >
                Unser Team
              </p>

              <h2
                className="
                  mt-3
                  text-4xl
                  font-light
                  leading-tight
                  tracking-tight
                  md:text-5xl
                "
              >
                Persönlich.
                <br />

                Kompetent.
                <br />

                <span style={{ color: MYSAN_BLUE }}>
                  Gemeinsam.
                </span>
              </h2>


              {/* Foto */}
              <div
                className="
                  mt-8
                  overflow-hidden
                  rounded-xl
                  shadow-[0_12px_35px_rgba(0,0,0,0.12)]
                "
              >

                <img
                  src="/zwei.jpg"
                  alt="Mathias und Evelyne Jeitziner"
                  className="
                    h-auto
                    w-full
                    object-cover
                    transition
                    duration-700
                    hover:scale-[1.02]
                  "
                />

              </div>

            </div>


            {/* =================================================
                RECHTE SEITE
            ================================================= */}

            <div className="flex items-center">

              <div className="max-w-3xl">

                <p className="text-base leading-7 text-neutral-700">
                  Mein Name ist Mathias Jeitziner. Im Jahr 2009 habe ich meine
                  Ausbildung zum Sanitärinstallateur abgeschlossen und seither
                  vielseitige Erfahrungen im Kundendienst, bei Umbauten und
                  Neubauten sowie in der Wasserversorgung gesammelt.
                </p>


                <p className="mt-5 text-base leading-7 text-neutral-700">
                  Die Arbeit mit Wasser und die handwerklichen Herausforderungen,
                  die jeder Auftrag mit sich bringt, begeistern mich bis heute.
                  Qualität, Zuverlässigkeit und eine saubere, präzise Arbeitsweise
                  stehen für mich an erster Stelle.
                </p>


                <p className="mt-5 text-base leading-7 text-neutral-700">
                  Am 3. August 2023 gründeten wir unser Unternehmen als
                  Einzelfirma. Dank der positiven Entwicklung und dem Vertrauen
                  unserer Kundinnen und Kunden konnten wir einen wichtigen
                  Meilenstein erreichen: Seit dem 1. September 2025 führen wir
                  unser Unternehmen als mySan Jeitziner GmbH weiter.
                </p>


                <p className="mt-5 text-base leading-7 text-neutral-700">
                  Unterstützt werde ich von meiner Frau Evelyne. Sie ist von
                  Anfang an fester Bestandteil unseres Unternehmens, arbeitet
                  täglich an meiner Seite auf den Baustellen und kümmert sich
                  gleichzeitig mit viel Engagement um die Administration und
                  sämtliche Büroarbeiten.
                </p>


                <p className="mt-5 text-base leading-7 text-neutral-700">
                  Gemeinsam bilden wir ein eingespieltes Team – persönlich,
                  bodenständig und mit vollem Einsatz für unsere Kundinnen und
                  Kunden.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          UNSERE WERTE
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">

        {/* Blauer linker Rand */}
        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{ backgroundColor: MYSAN_BLUE }}
        />

        <div
          className="
            mx-auto
            max-w-7xl
            px-8
            py-10
            md:px-12
            md:py-14
            lg:px-16
          "
        >

          <div className="grid gap-5 md:grid-cols-3">

            <TeamValue
              title="Persönlich"
              text="Direkter Kontakt, persönliche Beratung und kurze Wege."
            />

            <TeamValue
              title="Bodenständig"
              text="Wir arbeiten unkompliziert, zuverlässig und mit Freude an unserem Handwerk."
            />

            <TeamValue
              title="Zuverlässig"
              text="Saubere Arbeit, fachgerechte Lösungen und ein Service, auf den Sie zählen können."
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          KONTAKT
      ===================================================== */}

      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: MYSAN_BLUE }}
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-8
            py-10
            md:px-12
            md:py-12
            lg:px-16
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
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
                Wir freuen uns auf Sie.
              </h2>

              <p className="mt-2 text-sm text-white/75">
                Persönlich, kompetent und zuverlässig.
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


/* =========================================================
   WERT
========================================================= */

function TeamValue({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="relative border border-neutral-200 bg-white p-6">

      {/* Blauer Strich */}
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: MYSAN_BLUE }}
      />

      {/* Tropfen */}
      <div
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
        "
        style={{ color: MYSAN_BLUE }}
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


      <h3 className="mt-4 text-xl font-light">
        {title}
      </h3>


      <p className="mt-2 text-sm leading-6 text-neutral-600">
        {text}
      </p>

    </div>
  )
}

