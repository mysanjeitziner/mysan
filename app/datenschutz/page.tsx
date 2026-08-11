import Link from 'next/link'

const MYSAN_BLUE = '#1dabff'

export default function DatenschutzPage() {
  return (
    <main className="bg-white text-neutral-900">

      <section className="relative overflow-hidden">

        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{ backgroundColor: MYSAN_BLUE }}
        />

        <div className="mx-auto max-w-5xl px-8 py-20 md:px-12 md:py-28">

          <div
            className="mb-5 h-1 w-14"
            style={{ backgroundColor: MYSAN_BLUE }}
          />

          <p
            className="text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: MYSAN_BLUE }}
          >
            mySan Jeitziner
          </p>

          <h1 className="mt-4 text-5xl font-light tracking-tight md:text-6xl">
            Datenschutzerklärung
          </h1>

          <div className="mt-12 max-w-3xl space-y-8 text-base leading-7 text-neutral-600">

            <section>
              <h2 className="text-2xl font-light text-neutral-900">
                1. Verantwortliche Stelle
              </h2>

              <p className="mt-3">
                mySan Jeitziner GmbH
                <br />
                Krydenweg 86
                <br />
                3900 Gamsen
                <br />
                Schweiz
              </p>

              <p className="mt-3">
                E-Mail:{' '}
                <a
                  href="mailto:info@mysan.ch"
                  style={{ color: MYSAN_BLUE }}
                >
                  info@mysan.ch
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900">
                2. Kontaktformular
              </h2>

              <p className="mt-3">
                Wenn Sie unser Kontaktformular verwenden, werden die von Ihnen
                eingegebenen Angaben zur Bearbeitung Ihrer Anfrage verwendet.
                Dazu gehören insbesondere Name, Vorname, PLZ, Ort,
                E-Mail-Adresse und der Inhalt Ihrer Nachricht.
              </p>

              <p className="mt-3">
                Die Daten werden nur so lange aufbewahrt, wie dies für die
                Bearbeitung der Anfrage und die damit verbundenen gesetzlichen
                Pflichten erforderlich ist.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900">
                3. Google Maps
              </h2>

              <p className="mt-3">
                Auf unserer Kontaktseite kann eine Karte von Google Maps
                eingebunden sein. Beim Laden der Karte können Daten an Google
                übertragen werden. Weitere Informationen finden Sie in den
                Datenschutzbestimmungen von Google.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900">
                4. Ihre Rechte
              </h2>

              <p className="mt-3">
                Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen
                insbesondere das Recht auf Auskunft, Berichtigung und
                gegebenenfalls Löschung Ihrer personenbezogenen Daten.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900">
                5. Kontakt
              </h2>

              <p className="mt-3">
                Bei Fragen zum Datenschutz können Sie uns jederzeit unter
                <a
                  href="mailto:info@mysan.ch"
                  className="ml-1"
                  style={{ color: MYSAN_BLUE }}
                >
                  info@mysan.ch
                </a>{' '}
                kontaktieren.
              </p>
            </section>

          </div>

          <div className="mt-12">
            <Link
              href="/kontakt"
              className="text-sm font-semibold"
              style={{ color: MYSAN_BLUE }}
            >
              ← Zurück zum Kontakt
            </Link>
          </div>

        </div>

      </section>

    </main>
  )
}