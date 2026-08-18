import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const MYSAN_BLUE = '#1dabff'

type SiteContent = {
  section: string
  content_key: string
  content: string
  visible: boolean
  sort_order?: number
}

export default async function DatenschutzPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('site_content')
    .select(
      'section, content_key, content, visible, sort_order'
    )
    .eq('page', 'datenschutz')
    .order('sort_order', {
      ascending: true,
    })

  const contents = (data as SiteContent[] | null) || []

  /*
  =========================================================
  INHALT HOLEN

  Wenn visible = false:
  → Inhalt wird NICHT zurückgegeben

  Wenn kein Eintrag vorhanden ist:
  → Fallback wird verwendet

  WICHTIG:
  Ein vorhandener Eintrag mit visible = false
  darf NICHT auf den Fallback zurückfallen.
  =========================================================
  */

  function getContent(
    section: string,
    key: string,
    fallback: string
  ): string | null {
    const item = contents.find(
      (content) =>
        content.section === section &&
        content.content_key === key
    )

    // Kein Eintrag in der Datenbank
    if (!item) {
      return fallback
    }

    // Eintrag existiert, ist aber deaktiviert
    if (item.visible === false) {
      return null
    }

    return item.content
  }

  /*
  =========================================================
  HERO
  =========================================================
  */

  const heroEyebrow = getContent(
    'hero',
    'eyebrow',
    'Rechtliche Angaben'
  )

  const heroTitle = getContent(
    'hero',
    'title',
    'Datenschutz'
  )

  const heroSubtitle = getContent(
    'hero',
    'subtitle',
    'Ihre Daten. Unser Umgang.'
  )

  /*
  =========================================================
  SEKTIONEN
  =========================================================
  */

  const sections = [
    {
      section: 'allgemein',
      eyebrow: 'Datenschutz',
      title: 'Allgemeine Hinweise.',
      paragraphs: [
        getContent(
          'allgemein',
          'text_1',
          'Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung informiert Sie darüber, welche personenbezogenen Daten beim Besuch unserer Website bearbeitet werden und zu welchen Zwecken dies erfolgt.'
        ),
        getContent(
          'allgemein',
          'text_2',
          'Die Bearbeitung personenbezogener Daten erfolgt im Rahmen der geltenden gesetzlichen Bestimmungen, insbesondere des Schweizer Datenschutzgesetzes (DSG).'
        ),
      ],
    },

    {
      section: 'verantwortlich',
      eyebrow: 'Verantwortlich',
      title: 'Verantwortliche Stelle.',
      paragraphs: [
        getContent(
          'verantwortlich',
          'text_1',
          'mySan Jeitziner GmbH\nKrydenweg 86\n3900 Gamsen\nSchweiz\n\nTelefon: 079 590 09 60\nBüro: 079 217 25 71\nE-Mail: info@mysan.ch'
        ),
      ],
    },

    {
      section: 'website',
      eyebrow: 'Website',
      title: 'Besuch unserer Website.',
      paragraphs: [
        getContent(
          'website',
          'text_1',
          'Beim Besuch unserer Website können technische Daten automatisch erfasst werden. Dazu können insbesondere IP-Adresse, Datum und Uhrzeit des Zugriffs, verwendeter Browser, Betriebssystem sowie technische Informationen über das verwendete Gerät gehören.'
        ),
        getContent(
          'website',
          'text_2',
          'Diese Daten können erforderlich sein, damit die Website technisch sicher und zuverlässig betrieben werden kann.'
        ),
      ],
    },

    {
      section: 'kontaktformular',
      eyebrow: 'Kontakt',
      title: 'Kontaktformular.',
      paragraphs: [
        getContent(
          'kontaktformular',
          'text_1',
          'Wenn Sie uns über das Kontaktformular kontaktieren, bearbeiten wir die von Ihnen übermittelten Angaben, insbesondere Name, Vorname, Adresse, E-Mail-Adresse und Nachricht.'
        ),
        getContent(
          'kontaktformular',
          'text_2',
          'Diese Daten werden verwendet, um Ihre Anfrage zu bearbeiten und mit Ihnen Kontakt aufzunehmen.'
        ),
        getContent(
          'kontaktformular',
          'text_3',
          'Die Angabe der mit einem Sternchen gekennzeichneten Felder ist erforderlich, damit wir Ihre Anfrage bearbeiten können.'
        ),
      ],
    },

    {
      section: 'resend',
      eyebrow: 'E-Mail',
      title: 'Versand über Resend.',
      paragraphs: [
        getContent(
          'resend',
          'text_1',
          'Für den Versand von Nachrichten aus unserem Kontaktformular verwenden wir den Dienst Resend.'
        ),
        getContent(
          'resend',
          'text_2',
          'Die über das Kontaktformular eingegebenen Daten werden verarbeitet, soweit dies für die Übermittlung und Bearbeitung Ihrer Anfrage erforderlich ist.'
        ),
        getContent(
          'resend',
          'text_3',
          'Dabei können personenbezogene Daten an Resend bzw. dessen technische Dienstleister übermittelt werden. Die Bearbeitung erfolgt im Rahmen der jeweiligen Datenschutzbestimmungen des Dienstleisters.'
        ),
      ],
    },

    {
      section: 'supabase',
      eyebrow: 'Datenbank',
      title: 'Verwendung von Supabase.',
      paragraphs: [
        getContent(
          'supabase',
          'text_1',
          'Für die Speicherung und Verarbeitung bestimmter Daten unserer Website verwenden wir Supabase.'
        ),
        getContent(
          'supabase',
          'text_2',
          'Supabase stellt unter anderem Datenbank-, Speicher- und Authentifizierungsfunktionen zur Verfügung.'
        ),
        getContent(
          'supabase',
          'text_3',
          'Im Rahmen der Nutzung von Funktionen unserer Website können personenbezogene Daten verarbeitet und gespeichert werden, soweit dies für den Betrieb der Website und die angebotenen Funktionen erforderlich ist.'
        ),
      ],
    },

    {
      section: 'admin',
      eyebrow: 'Administration',
      title: 'Login und Benutzerkonten.',
      paragraphs: [
        getContent(
          'admin',
          'text_1',
          'Der geschützte Administrationsbereich unserer Website verwendet eine Authentifizierung. Dabei können insbesondere E-Mail-Adresse und technische Authentifizierungsdaten verarbeitet werden.'
        ),
        getContent(
          'admin',
          'text_2',
          'Der Administrationsbereich ist nicht für die öffentliche Nutzung bestimmt.'
        ),
      ],
    },

    {
      section: 'google_maps',
      eyebrow: 'Standort',
      title: 'Google Maps.',
      paragraphs: [
        getContent(
          'google_maps',
          'text_1',
          'Auf unserer Kontaktseite verwenden wir Google Maps zur Darstellung unseres Standorts.'
        ),
        getContent(
          'google_maps',
          'text_2',
          'Beim Aufruf der Karte können technische Daten an Google übermittelt werden. Dazu können insbesondere IP-Adresse, Informationen über das verwendete Gerät sowie weitere technische Daten gehören.'
        ),
        getContent(
          'google_maps',
          'text_3',
          'Die Nutzung von Google Maps erfolgt, um unseren Standort übersichtlich darzustellen und Ihnen die Anfahrt zu erleichtern.'
        ),
      ],
    },

    {
      section: 'social_media',
      eyebrow: 'Social Media',
      title: 'Instagram.',
      paragraphs: [
        getContent(
          'social_media',
          'text_1',
          'Auf unserer Website kann ein Link zu unserem Instagram-Auftritt enthalten sein.'
        ),
        getContent(
          'social_media',
          'text_2',
          'Wenn Sie den entsprechenden Link aufrufen, verlassen Sie unsere Website und gelangen zum Angebot von Instagram. Für die anschliessende Bearbeitung personenbezogener Daten ist der jeweilige Betreiber der Plattform verantwortlich.'
        ),
      ],
    },

    {
      section: 'cookies',
      eyebrow: 'Cookies',
      title: 'Verwendung von Cookies.',
      paragraphs: [
        getContent(
          'cookies',
          'text_1',
          'Unsere Website kann technisch notwendige Cookies oder vergleichbare Technologien verwenden, die für den Betrieb der Website und bestimmte Funktionen erforderlich sind.'
        ),
        getContent(
          'cookies',
          'text_2',
          'Soweit Cookies oder vergleichbare Technologien eingesetzt werden, die nicht technisch erforderlich sind, informieren wir darüber und holen – soweit gesetzlich erforderlich – Ihre Einwilligung ein.'
        ),
      ],
    },

    {
      section: 'analyse',
      eyebrow: 'Analyse',
      title: 'Keine Besucheranalyse.',
      paragraphs: [
        getContent(
          'analyse',
          'text_1',
          'Auf unserer Website wird derzeit kein Google Analytics und kein vergleichbarer Dienst zur Erstellung von Besucherprofilen oder zur Analyse des Nutzungsverhaltens eingesetzt.'
        ),
      ],
    },

    {
      section: 'rechte',
      eyebrow: 'Ihre Rechte',
      title: 'Rechte der betroffenen Personen.',
      paragraphs: [
        getContent(
          'rechte',
          'text_1',
          'Im Rahmen des anwendbaren Datenschutzrechts haben Sie insbesondere das Recht, Auskunft über Ihre bearbeiteten personenbezogenen Daten zu verlangen.'
        ),
        getContent(
          'rechte',
          'text_2',
          'Je nach den gesetzlichen Voraussetzungen können Sie zudem die Berichtigung, Löschung oder Einschränkung der Bearbeitung Ihrer personenbezogenen Daten verlangen.'
        ),
        getContent(
          'rechte',
          'text_3',
          'Für entsprechende Anliegen können Sie uns über die oben angegebenen Kontaktdaten erreichen.'
        ),
      ],
    },

    {
      section: 'sicherheit',
      eyebrow: 'Sicherheit',
      title: 'Schutz Ihrer Daten.',
      paragraphs: [
        getContent(
          'sicherheit',
          'text_1',
          'Wir treffen angemessene technische und organisatorische Massnahmen, um personenbezogene Daten vor Verlust, Missbrauch, unberechtigtem Zugriff oder unbefugter Offenlegung zu schützen.'
        ),
      ],
    },

    {
      section: 'aktualisierung',
      eyebrow: 'Aktualisierung',
      title: 'Änderungen dieser Datenschutzerklärung.',
      paragraphs: [
        getContent(
          'aktualisierung',
          'text_1',
          'Wir können diese Datenschutzerklärung jederzeit anpassen, wenn sich gesetzliche Anforderungen oder die von uns eingesetzten Dienste und Funktionen ändern.'
        ),
        getContent(
          'aktualisierung',
          'text_2',
          'Es gilt jeweils die auf dieser Website veröffentlichte aktuelle Fassung.'
        ),
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">

        <div
          className="absolute left-0 top-0 z-30 h-full w-2"
          style={{
            backgroundColor: MYSAN_BLUE,
          }}
        />

        <div className="mx-auto max-w-7xl px-8 pb-12 pt-28 md:px-12 md:pb-16 md:pt-32 lg:px-16">

          <div className="max-w-4xl">

            {heroEyebrow && (
              <>
                <div
                  className="mb-5 h-1 w-14"
                  style={{
                    backgroundColor: MYSAN_BLUE,
                  }}
                />

                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{
                    color: MYSAN_BLUE,
                  }}
                >
                  {heroEyebrow}
                </p>
              </>
            )}

            {heroTitle && (
              <h1 className="mt-4 text-5xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                {heroTitle}

                {heroSubtitle && (
                  <>
                    <br />

                    <span
                      style={{
                        color: MYSAN_BLUE,
                      }}
                    >
                      {heroSubtitle}
                    </span>
                  </>
                )}
              </h1>
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          INHALT
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">

        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{
            backgroundColor: MYSAN_BLUE,
          }}
        />

        <div className="mx-auto max-w-7xl px-8 pb-20 md:px-12 md:pb-24 lg:px-16">

          <div className="max-w-4xl">

            {sections.map((section) => {

              /*
              =================================================
              NUR SICHTBARE ABSÄTZE
              =================================================
              */

              const visibleParagraphs =
                section.paragraphs.filter(
                  (paragraph): paragraph is string =>
                    paragraph !== null &&
                    paragraph.trim() !== ''
                )

              /*
              =================================================
              WENN ALLE TEXTE UNSICHTBAR SIND:

              → komplette Section wird nicht angezeigt
              =================================================
              */

              if (visibleParagraphs.length === 0) {
                return null
              }

              return (
                <section
                  key={section.section}
                  className="border-t border-neutral-200 pt-10 first:border-t"
                >

                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: MYSAN_BLUE,
                    }}
                  >
                    {section.eyebrow}
                  </p>

                  <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                    {section.title}
                  </h2>

                  <div className="mt-7 space-y-5 text-base leading-7 text-neutral-700">

                    {visibleParagraphs.map(
                      (paragraph, index) => (
                        <p
                          key={index}
                          className="whitespace-pre-line"
                        >
                          {paragraph}
                        </p>
                      )
                    )}

                  </div>

                </section>
              )
            })}


            {/* =================================================
                STAND
            ================================================= */}

            {(() => {
              const stand = getContent(
                'meta',
                'stand',
                'Stand: August 2026'
              )

              const back = getContent(
                'meta',
                'back',
                'Zurück zur Startseite'
              )

              if (!stand && !back) {
                return null
              }

              return (
                <div className="mt-16 border-t border-neutral-200 pt-8">

                  {stand && (
                    <p className="text-sm text-neutral-400">
                      {stand}
                    </p>
                  )}

                  {back && (
                    <Link
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

                      {back}
                    </Link>
                  )}

                </div>
              )
            })()}

          </div>

        </div>

      </section>

    </main>
  )
}