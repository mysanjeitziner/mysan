
const MYSAN_BLUE = '#1dabff'

export default function DatenschutzPage() {
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

              Datenschutz

              <br />

              <span
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Ihre Daten. Unser Umgang.
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
                1. ALLGEMEINE HINWEISE
            ================================================= */}

            <section className="border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Datenschutz
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Allgemeine Hinweise.
              </h2>

              <div className="mt-7 space-y-5 text-base leading-7 text-neutral-700">

                <p>
                  Der Schutz Ihrer persönlichen Daten ist uns wichtig.
                  Diese Datenschutzerklärung informiert Sie darüber, welche
                  personenbezogenen Daten beim Besuch unserer Website
                  bearbeitet werden und zu welchen Zwecken dies erfolgt.
                </p>

                <p>
                  Die Bearbeitung personenbezogener Daten erfolgt im Rahmen
                  der geltenden gesetzlichen Bestimmungen, insbesondere des
                  Schweizer Datenschutzgesetzes (DSG).
                </p>

              </div>

            </section>


            {/* =================================================
                2. VERANTWORTLICHE STELLE
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
                Verantwortliche Stelle.
              </h2>

              <div className="mt-7 space-y-1 text-base leading-7 text-neutral-700">

                <p className="font-medium text-neutral-900">
                  mySan Jeitziner GmbH
                </p>

                <p>Krydenweg 86</p>

                <p>3900 Gamsen</p>

                <p>Schweiz</p>

                <p className="pt-3">
                  Telefon: 079 590 09 60
                </p>

                <p>
                  Büro: 079 217 25 71
                </p>

                <p>
                  E-Mail:{' '}
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
                3. BESUCH DER WEBSITE
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Website
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Besuch unserer Website.
              </h2>

              <div className="mt-7 space-y-5 text-base leading-7 text-neutral-700">

                <p>
                  Beim Besuch unserer Website können technische Daten
                  automatisch erfasst werden. Dazu können insbesondere
                  IP-Adresse, Datum und Uhrzeit des Zugriffs, verwendeter
                  Browser, Betriebssystem sowie technische Informationen
                  über das verwendete Gerät gehören.
                </p>

                <p>
                  Diese Daten können erforderlich sein, damit die Website
                  technisch sicher und zuverlässig betrieben werden kann.
                </p>

              </div>

            </section>


            {/* =================================================
                4. KONTAKTFORMULAR
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

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Kontaktformular.
              </h2>

              <div className="mt-7 space-y-5 text-base leading-7 text-neutral-700">

                <p>
                  Wenn Sie uns über das Kontaktformular kontaktieren,
                  bearbeiten wir die von Ihnen übermittelten Angaben,
                  insbesondere Name, Vorname, Adresse, E-Mail-Adresse und
                  Nachricht.
                </p>

                <p>
                  Diese Daten werden verwendet, um Ihre Anfrage zu bearbeiten
                  und mit Ihnen Kontakt aufzunehmen.
                </p>

                <p>
                  Die Angabe der mit einem Sternchen gekennzeichneten Felder
                  ist erforderlich, damit wir Ihre Anfrage bearbeiten können.
                </p>

              </div>

            </section>


            {/* =================================================
                5. RESEND
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                E-Mail
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Versand über Resend.
              </h2>

              <div className="mt-7 space-y-5 text-base leading-7 text-neutral-700">

                <p>
                  Für den Versand von Nachrichten aus unserem
                  Kontaktformular verwenden wir den Dienst Resend.
                </p>

                <p>
                  Die über das Kontaktformular eingegebenen Daten werden
                  verarbeitet, soweit dies für die Übermittlung und
                  Bearbeitung Ihrer Anfrage erforderlich ist.
                </p>

                <p>
                  Dabei können personenbezogene Daten an Resend bzw. dessen
                  technische Dienstleister übermittelt werden. Die
                  Bearbeitung erfolgt im Rahmen der jeweiligen
                  Datenschutzbestimmungen des Dienstleisters.
                </p>

              </div>

            </section>


            {/* =================================================
                6. SUPABASE
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Datenbank
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Verwendung von Supabase.
              </h2>

              <div className="mt-7 space-y-5 text-base leading-7 text-neutral-700">

                <p>
                  Für die Speicherung und Verarbeitung bestimmter Daten
                  unserer Website verwenden wir Supabase.
                </p>

                <p>
                  Supabase stellt unter anderem Datenbank-, Speicher- und
                  Authentifizierungsfunktionen zur Verfügung.
                </p>

                <p>
                  Im Rahmen der Nutzung von Funktionen unserer Website können
                  personenbezogene Daten verarbeitet und gespeichert werden,
                  soweit dies für den Betrieb der Website und die angebotenen
                  Funktionen erforderlich ist.
                </p>

              </div>

            </section>


            {/* =================================================
                7. ADMIN-BEREICH
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Administration
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Login und Benutzerkonten.
              </h2>

              <div className="mt-7 space-y-5 text-base leading-7 text-neutral-700">

                <p>
                  Der geschützte Administrationsbereich unserer Website
                  verwendet eine Authentifizierung. Dabei können
                  insbesondere E-Mail-Adresse und technische
                  Authentifizierungsdaten verarbeitet werden.
                </p>

                <p>
                  Der Administrationsbereich ist nicht für die öffentliche
                  Nutzung bestimmt.
                </p>

              </div>

            </section>


            {/* =================================================
                8. GOOGLE MAPS
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Standort
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Google Maps.
              </h2>

              <div className="mt-7 space-y-5 text-base leading-7 text-neutral-700">

                <p>
                  Auf unserer Kontaktseite verwenden wir Google Maps zur
                  Darstellung unseres Standorts.
                </p>

                <p>
                  Beim Aufruf der Karte können technische Daten an Google
                  übermittelt werden. Dazu können insbesondere IP-Adresse,
                  Informationen über das verwendete Gerät sowie weitere
                  technische Daten gehören.
                </p>

                <p>
                  Die Nutzung von Google Maps erfolgt, um unseren Standort
                  übersichtlich darzustellen und Ihnen die Anfahrt zu
                  erleichtern.
                </p>

              </div>

            </section>


            {/* =================================================
                9. SOCIAL MEDIA
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Social Media
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Instagram.
              </h2>

              <div className="mt-7 space-y-5 text-base leading-7 text-neutral-700">

                <p>
                  Auf unserer Website kann ein Link zu unserem
                  Instagram-Auftritt enthalten sein.
                </p>

                <p>
                  Wenn Sie den entsprechenden Link aufrufen, verlassen Sie
                  unsere Website und gelangen zum Angebot von Instagram.
                  Für die anschliessende Bearbeitung personenbezogener Daten
                  ist der jeweilige Betreiber der Plattform verantwortlich.
                </p>

              </div>

            </section>


            {/* =================================================
                10. COOKIES
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Cookies
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Verwendung von Cookies.
              </h2>

              <div className="mt-7 space-y-5 text-base leading-7 text-neutral-700">

                <p>
                  Unsere Website kann technisch notwendige Cookies oder
                  vergleichbare Technologien verwenden, die für den Betrieb
                  der Website und bestimmte Funktionen erforderlich sind.
                </p>

                <p>
                  Soweit Cookies oder vergleichbare Technologien eingesetzt
                  werden, die nicht technisch erforderlich sind, informieren
                  wir darüber und holen – soweit gesetzlich erforderlich –
                  Ihre Einwilligung ein.
                </p>

              </div>

            </section>


            {/* =================================================
                11. KEIN GOOGLE ANALYTICS
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Analyse
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Keine Besucheranalyse.
              </h2>

              <div className="mt-7 text-base leading-7 text-neutral-700">

                <p>
                  Auf unserer Website wird derzeit kein Google Analytics und
                  kein vergleichbarer Dienst zur Erstellung von
                  Besucherprofilen oder zur Analyse des Nutzungsverhaltens
                  eingesetzt.
                </p>

              </div>

            </section>


            {/* =================================================
                12. IHRE RECHTE
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Ihre Rechte
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Rechte der betroffenen Personen.
              </h2>

              <div className="mt-7 space-y-5 text-base leading-7 text-neutral-700">

                <p>
                  Im Rahmen des anwendbaren Datenschutzrechts haben Sie
                  insbesondere das Recht, Auskunft über Ihre bearbeiteten
                  personenbezogenen Daten zu verlangen.
                </p>

                <p>
                  Je nach den gesetzlichen Voraussetzungen können Sie zudem
                  die Berichtigung, Löschung oder Einschränkung der
                  Bearbeitung Ihrer personenbezogenen Daten verlangen.
                </p>

                <p>
                  Für entsprechende Anliegen können Sie uns über die oben
                  angegebenen Kontaktdaten erreichen.
                </p>

              </div>

            </section>


            {/* =================================================
                13. DATENSICHERHEIT
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Sicherheit
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Schutz Ihrer Daten.
              </h2>

              <div className="mt-7 text-base leading-7 text-neutral-700">

                <p>
                  Wir treffen angemessene technische und organisatorische
                  Massnahmen, um personenbezogene Daten vor Verlust,
                  Missbrauch, unberechtigtem Zugriff oder unbefugter
                  Offenlegung zu schützen.
                </p>

              </div>

            </section>


            {/* =================================================
                14. AKTUALISIERUNG
            ================================================= */}

            <section className="mt-14 border-t border-neutral-200 pt-10">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Aktualisierung
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                Änderungen dieser Datenschutzerklärung.
              </h2>

              <div className="mt-7 space-y-5 text-base leading-7 text-neutral-700">

                <p>
                  Wir können diese Datenschutzerklärung jederzeit anpassen,
                  wenn sich gesetzliche Anforderungen oder die von uns
                  eingesetzten Dienste und Funktionen ändern.
                </p>

                <p>
                  Es gilt jeweils die auf dieser Website veröffentlichte
                  aktuelle Fassung.
                </p>

              </div>

            </section>


            {/* =================================================
                STAND
            ================================================= */}

            <div className="mt-16 border-t border-neutral-200 pt-8">

              <p className="text-sm text-neutral-400">
                Stand: August 2026
              </p>

              <a
                href="/"
                className="
                  mt-5
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

