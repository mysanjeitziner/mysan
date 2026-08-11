
const MYSAN_BLUE = '#1dabff'

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">

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

        <div className="mx-auto max-w-7xl px-8 pb-12 pt-28 md:px-12 md:pb-16 md:pt-32 lg:px-16">

          <div className="max-w-4xl">

            {/* Blauer Strich */}

            <div
              className="mb-5 h-1 w-14"
              style={{
                backgroundColor: MYSAN_BLUE,
              }}
            />

            {/* Eyebrow */}

            <p
              className="text-xs font-semibold uppercase tracking-[0.25em]"
              style={{
                color: MYSAN_BLUE,
              }}
            >
              Rechtliche Angaben
            </p>

            {/* Titel */}

            <h1 className="mt-4 text-5xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">

              Impressum

              <br />

              <span
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Rechtliche Angaben.
              </span>

            </h1>

          </div>

        </div>

      </section>


      {/* =====================================================
          INHALT
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">

        {/* Blauer linker Rand */}

        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{
            backgroundColor: MYSAN_BLUE,
          }}
        />

        <div className="mx-auto max-w-7xl px-8 pb-20 md:px-12 md:pb-24 lg:px-16">

          <div className="max-w-4xl">

            {/* =================================================
                ANGABEN ZUM UNTERNEHMEN
            ================================================= */}

            <section className="border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Angaben
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                zum Unternehmen.
              </h2>

              <div className="mt-7 space-y-1 text-base leading-7 text-neutral-700">
                <p className="font-medium text-neutral-900">
                  mySan Jeitziner GmbH
                </p>

                <p>Krydenweg 86</p>
                <p>3900 Gamsen</p>
                <p>Schweiz</p>
              </div>

            </section>


            {/* =================================================
                KONTAKT
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Kontakt
              </p>

              <div className="mt-6 space-y-2 text-base leading-7 text-neutral-700">

                <p>
                  <span className="font-medium text-neutral-900">
                    Telefon:
                  </span>{' '}
                  079 590 09 60
                </p>

                <p>
                  <span className="font-medium text-neutral-900">
                    Büro:
                  </span>{' '}
                  079 217 25 71
                </p>

                <p>
                  <span className="font-medium text-neutral-900">
                    E-Mail:
                  </span>{' '}
                  <a
                    href="mailto:info@mysan.ch"
                    className="transition-colors hover:text-[#1dabff]"
                  >
                    info@mysan.ch
                  </a>
                </p>

              </div>

            </section>


            {/* =================================================
                VERANTWORTLICH
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Verantwortlich
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                für den Inhalt.
              </h2>

              <div className="mt-7 space-y-1 text-base leading-7 text-neutral-700">

                <p className="font-medium text-neutral-900">
                  mySan Jeitziner GmbH
                </p>

                <p>Krydenweg 86</p>
                <p>3900 Gamsen</p>
                <p>Schweiz</p>

              </div>

            </section>


            {/* =================================================
                HAFTUNG FÜR INHALTE
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Haftung
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                für Inhalte.
              </h2>

              <div className="mt-7 space-y-5 text-base leading-7 text-neutral-700">

                <p>
                  Die Inhalte dieser Website wurden mit grösstmöglicher
                  Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
                  und Aktualität der Inhalte kann jedoch keine Gewähr
                  übernommen werden.
                </p>

                <p>
                  Als Dienstanbieter sind wir für eigene Inhalte auf diesen
                  Seiten nach den allgemeinen gesetzlichen Vorschriften
                  verantwortlich. Wir sind jedoch nicht verpflichtet,
                  übermittelte oder gespeicherte fremde Informationen zu
                  überwachen oder nach Umständen zu forschen, die auf eine
                  rechtswidrige Tätigkeit hinweisen.
                </p>

              </div>

            </section>


            {/* =================================================
                HAFTUNG FÜR LINKS
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Externe Links
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Haftung für Links.
              </h2>

              <div className="mt-7 text-base leading-7 text-neutral-700">

                <p>
                  Diese Website kann Links zu externen Websites Dritter
                  enthalten. Auf deren Inhalte haben wir keinen Einfluss.
                  Für die Inhalte der verlinkten Seiten ist stets der
                  jeweilige Anbieter oder Betreiber verantwortlich.
                </p>

              </div>

            </section>


            {/* =================================================
                URHEBERRECHT
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Copyright
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Urheberrecht.
              </h2>

              <div className="mt-7 text-base leading-7 text-neutral-700">

                <p>
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke
                  auf dieser Website unterliegen dem Schweizer Urheberrecht.
                  Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
                  der Verwertung ausserhalb der Grenzen des Urheberrechts
                  bedürfen der vorherigen schriftlichen Zustimmung des
                  jeweiligen Rechteinhabers.
                </p>

              </div>

            </section>


            {/* =================================================
                ZURÜCK
            ================================================= */}

            <div className="mt-16 border-t border-neutral-200 pt-8">

              <a
                href="/"
                className="
                  inline-flex
                  items-center
                  text-sm
                  font-medium
                  text-neutral-500
                  transition-colors
                  hover:text-[#1dabff]
                "
              >
                <span className="mr-3 text-lg">
                  ←
                </span>

                Zurück zur Startseite
              </a>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}
