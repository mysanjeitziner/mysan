
import Link from 'next/link'
import CookieSettingsButton from './CookieSettingsButton'

const MYSAN_BLUE = '#1dabff'

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">

        {/* Blauer linker Rand */}

        <div
          className="absolute left-0 top-0 h-full w-2"
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
              mySan Jeitziner
            </p>

            {/* TITEL */}

            <h1 className="mt-4 text-5xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">

              Cookies

              <br />

              <span
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                & Einstellungen.
              </span>

            </h1>

          </div>

        </div>

      </section>

      {/* =====================================================
          INHALT
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#F4F7FA]">

        {/* Blauer linker Rand */}

        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{
            backgroundColor: MYSAN_BLUE,
          }}
        />

        <div className="mx-auto max-w-7xl px-8 py-12 md:px-12 md:py-16 lg:px-16">

          <div className="max-w-4xl space-y-10">

            {/* =================================================
                WAS SIND COOKIES
            ================================================= */}

            <section>

              <h2 className="text-3xl font-light md:text-4xl">
                Was sind Cookies?
              </h2>

              <p className="mt-4 leading-7 text-neutral-700">
                Cookies sind kleine Dateien, die auf Ihrem
                Endgerät gespeichert werden können, wenn Sie
                eine Website besuchen. Sie ermöglichen unter
                anderem die technische Funktion bestimmter
                Website-Bereiche und können dazu beitragen,
                Einstellungen zu speichern.
              </p>

            </section>

            {/* =================================================
                NOTWENDIGE COOKIES
            ================================================= */}

            <section>

              <h2 className="text-3xl font-light md:text-4xl">
                Notwendige Cookies
              </h2>

              <p className="mt-4 leading-7 text-neutral-700">
                Wir verwenden technisch notwendige Cookies und
                vergleichbare Technologien, soweit dies für den
                Betrieb unserer Website erforderlich ist.
              </p>

              <p className="mt-4 leading-7 text-neutral-700">
                Dazu gehören insbesondere Funktionen für den
                geschützten Administrationsbereich und die
                Authentifizierung über Supabase.
              </p>

            </section>

            {/* =================================================
                EXTERNE INHALTE
            ================================================= */}

            <section>

              <h2 className="text-3xl font-light md:text-4xl">
                Externe Inhalte
              </h2>

              <p className="mt-4 leading-7 text-neutral-700">
                Auf unserer Website können externe Inhalte
                eingebunden werden, insbesondere Google Maps
                zur Darstellung unseres Standorts.
              </p>

              <p className="mt-4 leading-7 text-neutral-700">
                Solche Inhalte können dazu führen, dass
                Informationen an den jeweiligen Drittanbieter
                übertragen werden. Die Aktivierung erfolgt,
                soweit erforderlich, erst nach Ihrer Zustimmung
                über unser Cookie-Banner.
              </p>

            </section>

            {/* =================================================
                KEIN TRACKING
            ================================================= */}

            <section>

              <h2 className="text-3xl font-light md:text-4xl">
                Keine Analyse-Cookies
              </h2>

              <p className="mt-4 leading-7 text-neutral-700">
                Auf unserer Website ist derzeit kein Google
                Analytics und kein vergleichbarer
                Besucher-Tracking-Dienst eingerichtet.
              </p>

            </section>

            {/* =================================================
                EINSTELLUNGEN
            ================================================= */}

            <section>

              <h2 className="text-3xl font-light md:text-4xl">
                Cookie-Einstellungen ändern
              </h2>

              <p className="mt-4 leading-7 text-neutral-700">
                Sie können Ihre Cookie-Einstellungen jederzeit
                zurücksetzen und erneut festlegen.
              </p>

              <CookieSettingsButton />

            </section>

            {/* =================================================
                DATENSCHUTZ
            ================================================= */}

            <section>

              <h2 className="text-3xl font-light md:text-4xl">
                Weitere Informationen
              </h2>

              <p className="mt-4 leading-7 text-neutral-700">
                Weitere Informationen zur Bearbeitung
                personenbezogener Daten finden Sie in unserer
                Datenschutzerklärung.
              </p>

              <Link
                href="/datenschutz"
                className="mt-5 inline-flex items-center text-sm font-semibold text-[#1dabff] hover:underline"
              >
                Zur Datenschutzerklärung →
              </Link>

            </section>

          </div>

        </div>

      </section>

    </main>
  )
}
