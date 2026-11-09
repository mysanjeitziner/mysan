import Link from 'next/link'
import { sql } from '@/lib/neon'

export const dynamic = 'force-dynamic'

const MYSAN_BLUE = '#1dabff'

type SiteContent = {
  section: string
  content_key: string
  content: string | null
  visible: boolean
  sort_order?: number
}

type SectionConfig = {
  section: string
  eyebrow: string
  title: string
  fallback: string[]
}

const sectionConfigs: SectionConfig[] = [
  {
    section: 'allgemein',
    eyebrow: 'Datenschutz',
    title: 'Allgemeine Hinweise.',
    fallback: [
      'Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung informiert Sie darüber, welche personenbezogenen Daten beim Besuch unserer Website bearbeitet werden und zu welchen Zwecken dies erfolgt.',
      'Die Bearbeitung personenbezogener Daten erfolgt im Rahmen der geltenden gesetzlichen Bestimmungen, insbesondere des Schweizer Datenschutzgesetzes (DSG).',
    ],
  },
  {
    section: 'verantwortlich',
    eyebrow: 'Verantwortlich',
    title: 'Verantwortliche Stelle.',
    fallback: [
      'mySan Jeitziner GmbH\nKrydenweg 86\n3900 Gamsen\nSchweiz\n\nTelefon: 079 590 09 60\nBüro: 079 217 25 71\nE-Mail: info@mysan.ch',
    ],
  },
  {
    section: 'website',
    eyebrow: 'Website',
    title: 'Besuch unserer Website.',
    fallback: [
      'Beim Besuch unserer Website können technische Daten automatisch erfasst werden. Dazu können insbesondere IP-Adresse, Datum und Uhrzeit des Zugriffs, verwendeter Browser, Betriebssystem sowie technische Informationen über das verwendete Gerät gehören.',
      'Diese Daten können erforderlich sein, damit die Website technisch sicher und zuverlässig betrieben werden kann.',
    ],
  },
  {
    section: 'kontaktformular',
    eyebrow: 'Kontakt',
    title: 'Kontaktformular.',
    fallback: [
      'Wenn Sie uns über das Kontaktformular kontaktieren, bearbeiten wir die von Ihnen übermittelten Angaben, insbesondere Name, Vorname, Adresse, E-Mail-Adresse und Nachricht.',
      'Diese Daten werden verwendet, um Ihre Anfrage zu bearbeiten und mit Ihnen Kontakt aufzunehmen.',
      'Die Angabe der mit einem Sternchen gekennzeichneten Felder ist erforderlich, damit wir Ihre Anfrage bearbeiten können.',
    ],
  },
  {
    section: 'resend',
    eyebrow: 'E-Mail',
    title: 'Versand über Resend.',
    fallback: [
      'Für den Versand von Nachrichten aus unserem Kontaktformular verwenden wir den Dienst Resend.',
      'Die über das Kontaktformular eingegebenen Daten werden verarbeitet, soweit dies für die Übermittlung und Bearbeitung Ihrer Anfrage erforderlich ist.',
      'Dabei können personenbezogene Daten an Resend bzw. dessen technische Dienstleister übermittelt werden. Die Bearbeitung erfolgt im Rahmen der jeweiligen Datenschutzbestimmungen des Dienstleisters.',
    ],
  },
  {
    section: 'supabase',
    eyebrow: 'Datenbank',
    title: 'Verwendung von Supabase.',
    fallback: [
      'Für die Speicherung und Verarbeitung bestimmter Daten unserer Website verwenden wir Supabase.',
      'Supabase stellt unter anderem Datenbank-, Speicher- und Authentifizierungsfunktionen zur Verfügung.',
      'Im Rahmen der Nutzung von Funktionen unserer Website können personenbezogene Daten verarbeitet und gespeichert werden, soweit dies für den Betrieb der Website und die angebotenen Funktionen erforderlich ist.',
    ],
  },
  {
    section: 'admin',
    eyebrow: 'Administration',
    title: 'Login und Benutzerkonten.',
    fallback: [
      'Der geschützte Administrationsbereich unserer Website verwendet eine Authentifizierung. Dabei können insbesondere E-Mail-Adresse und technische Authentifizierungsdaten verarbeitet werden.',
      'Der Administrationsbereich ist nicht für die öffentliche Nutzung bestimmt.',
    ],
  },
  {
    section: 'google_maps',
    eyebrow: 'Standort',
    title: 'Google Maps.',
    fallback: [
      'Auf unserer Kontaktseite verwenden wir Google Maps zur Darstellung unseres Standorts.',
      'Beim Aufruf der Karte können technische Daten an Google übermittelt werden. Dazu können insbesondere IP-Adresse, Informationen über das verwendete Gerät sowie weitere technische Daten gehören.',
      'Die Nutzung von Google Maps erfolgt, um unseren Standort übersichtlich darzustellen und Ihnen die Anfahrt zu erleichtern.',
    ],
  },
  {
    section: 'social_media',
    eyebrow: 'Social Media',
    title: 'Instagram.',
    fallback: [
      'Auf unserer Website kann ein Link zu unserem Instagram-Auftritt enthalten sein.',
      'Wenn Sie den entsprechenden Link aufrufen, verlassen Sie unsere Website und gelangen zum Angebot von Instagram. Für die anschliessende Bearbeitung personenbezogener Daten ist der jeweilige Betreiber der Plattform verantwortlich.',
    ],
  },
  {
    section: 'cookies',
    eyebrow: 'Cookies',
    title: 'Verwendung von Cookies.',
    fallback: [
      'Unsere Website kann technisch notwendige Cookies oder vergleichbare Technologien verwenden, die für den Betrieb der Website und bestimmte Funktionen erforderlich sind.',
      'Soweit Cookies oder vergleichbare Technologien eingesetzt werden, die nicht technisch erforderlich sind, informieren wir darüber und holen – soweit gesetzlich erforderlich – Ihre Einwilligung ein.',
    ],
  },
  {
    section: 'analyse',
    eyebrow: 'Analyse',
    title: 'Keine Besucheranalyse.',
    fallback: [
      'Auf unserer Website wird derzeit kein Google Analytics und kein vergleichbarer Dienst zur Erstellung von Besucherprofilen oder zur Analyse des Nutzungsverhaltens eingesetzt.',
    ],
  },
  {
    section: 'rechte',
    eyebrow: 'Ihre Rechte',
    title: 'Rechte der betroffenen Personen.',
    fallback: [
      'Im Rahmen des anwendbaren Datenschutzrechts haben Sie insbesondere das Recht, Auskunft über Ihre bearbeiteten personenbezogenen Daten zu verlangen.',
      'Je nach den gesetzlichen Voraussetzungen können Sie zudem die Berichtigung, Löschung oder Einschränkung der Bearbeitung Ihrer personenbezogenen Daten verlangen.',
      'Für entsprechende Anliegen können Sie uns über die oben angegebenen Kontaktdaten erreichen.',
    ],
  },
  {
    section: 'sicherheit',
    eyebrow: 'Sicherheit',
    title: 'Schutz Ihrer Daten.',
    fallback: [
      'Wir treffen angemessene technische und organisatorische Massnahmen, um personenbezogene Daten vor Verlust, Missbrauch, unberechtigtem Zugriff oder unbefugter Offenlegung zu schützen.',
    ],
  },
  {
    section: 'aktualisierung',
    eyebrow: 'Aktualisierung',
    title: 'Änderungen dieser Datenschutzerklärung.',
    fallback: [
      'Wir können diese Datenschutzerklärung jederzeit anpassen, wenn sich gesetzliche Anforderungen oder die von uns eingesetzten Dienste und Funktionen ändern.',
      'Es gilt jeweils die auf dieser Website veröffentlichte aktuelle Fassung.',
    ],
  },
]

export default async function DatenschutzPage() {
  const data = await sql`
    SELECT
      section,
      content_key,
      content,
      visible,
      sort_order
    FROM public.site_content
    WHERE page = 'datenschutz'
    ORDER BY sort_order ASC
  `

  const contents = data as SiteContent[]

  function getItem(section: string, key: string) {
    return contents.find(
      (item) =>
        item.section === section &&
        item.content_key === key
    )
  }

  function getContent(
    section: string,
    key: string,
    fallback: string
  ): string | null {
    const item = getItem(section, key)

    if (!item) return fallback
    if (!item.visible) return null

    return item.content ?? ''
  }

  function getParagraphs(
    section: string,
    fallback: string[]
  ): string[] {
    // Die Datenbank verwendet aktuell beispielsweise
    // allgemein/text statt allgemein/text_1.
    const singleText = getItem(section, 'text')

    if (singleText) {
      if (!singleText.visible || !singleText.content?.trim()) {
        return []
      }

      return [singleText.content]
    }

    // Kompatibilität mit älteren Datensätzen text_1, text_2 usw.
    const numberedTexts = contents
      .filter(
        (item) =>
          item.section === section &&
          /^text_\d+$/.test(item.content_key)
      )
      .sort((a, b) => {
        const numberA = Number(a.content_key.replace('text_', ''))
        const numberB = Number(b.content_key.replace('text_', ''))
        return numberA - numberB
      })

    if (numberedTexts.length > 0) {
      return numberedTexts
        .filter(
          (item) =>
            item.visible &&
            typeof item.content === 'string' &&
            item.content.trim() !== ''
        )
        .map((item) => item.content as string)
    }

    // Wenn keine Texte in Neon existieren, Standardtexte anzeigen.
    return fallback
  }

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
    'title_accent',
    getContent(
      'hero',
      'subtitle',
      'Ihre Daten. Unser Umgang.'
    ) ?? ''
  )

  const sections = sectionConfigs
    .map((config) => {
      const eyebrow = getContent(
        config.section,
        'eyebrow',
        config.eyebrow
      )

      const title = getContent(
        config.section,
        'title',
        config.title
      )

      const paragraphs = getParagraphs(
        config.section,
        config.fallback
      )

      return {
        ...config,
        eyebrow,
        title,
        paragraphs,
      }
    })
    .filter(
      (section) =>
        section.eyebrow !== null &&
        section.title !== null &&
        section.paragraphs.length > 0
    )

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

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <div
          className="absolute left-0 top-0 z-30 h-full w-2"
          style={{ backgroundColor: MYSAN_BLUE }}
        />

        <div className="mx-auto max-w-7xl px-8 pb-12 pt-28 md:px-12 md:pb-16 md:pt-32 lg:px-16">
          <div className="max-w-4xl">
            {heroEyebrow && (
              <>
                <div
                  className="mb-5 h-1 w-14"
                  style={{ backgroundColor: MYSAN_BLUE }}
                />

                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{ color: MYSAN_BLUE }}
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
                    <span style={{ color: MYSAN_BLUE }}>
                      {heroSubtitle}
                    </span>
                  </>
                )}
              </h1>
            )}
          </div>
        </div>
      </section>

      {/* INHALT */}
      <section className="relative overflow-hidden bg-white">
        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{ backgroundColor: MYSAN_BLUE }}
        />

        <div className="mx-auto max-w-7xl px-8 pb-20 md:px-12 md:pb-24 lg:px-16">
          <div className="max-w-4xl">
            {sections.map((section) => (
              <section
                key={section.section}
                className="border-t border-neutral-200 pt-10 first:border-t"
              >
                {section.eyebrow && (
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: MYSAN_BLUE }}
                  >
                    {section.eyebrow}
                  </p>
                )}

                {section.title && (
                  <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                    {section.title}
                  </h2>
                )}

                <div className="mt-7 space-y-5 text-base leading-7 text-neutral-700">
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="whitespace-pre-line"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            {/* STAND UND ZURÜCK-LINK */}
            {(stand || back) && (
              <div className="mt-16 border-t border-neutral-200 pt-8">
                {stand && (
                  <p className="text-sm text-neutral-400">
                    {stand}
                  </p>
                )}

                {back && (
                  <Link
                    href="/"
                    className="mt-5 inline-flex items-center text-sm font-medium text-neutral-500 transition-colors hover:text-[#1dabff]"
                  >
                    <span className="mr-3 text-lg">←</span>
                    {back}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}