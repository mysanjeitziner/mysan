import Link from 'next/link'
import {
  getSiteContent,
  getContent,
} from '@/lib/site-content'

const MYSAN_BLUE = '#1dabff'

export default async function ImpressumPage() {
  const contents = await getSiteContent('impressum')

  const heroEyebrow = getContent(
    contents,
    'hero',
    'eyebrow',
    'Rechtliche Angaben'
  )

  const heroTitle = getContent(
    contents,
    'hero',
    'title',
    'Impressum'
  )

  const heroTitleAccent = getContent(
    contents,
    'hero',
    'title_accent',
    'Rechtliche Angaben.'
  )

  const companyEyebrow = getContent(
    contents,
    'unternehmen',
    'eyebrow',
    'Angaben'
  )

  const companyTitle = getContent(
    contents,
    'unternehmen',
    'title',
    'zum Unternehmen.'
  )

  const companyContent = getContent(
    contents,
    'unternehmen',
    'content',
    '<strong>mySan Jeitziner GmbH</strong><br>Krydenweg 86<br>3900 Gamsen<br>Schweiz'
  )

  const contactEyebrow = getContent(
    contents,
    'kontakt',
    'eyebrow',
    'Kontakt'
  )

  const contactContent = getContent(
    contents,
    'kontakt',
    'content',
    '<strong>Telefon:</strong> 079 590 09 60<br><strong>Büro:</strong> 079 217 25 71<br><strong>E-Mail:</strong> info@mysan.ch'
  )

  const responsibleEyebrow = getContent(
    contents,
    'verantwortlich',
    'eyebrow',
    'Verantwortlich'
  )

  const responsibleTitle = getContent(
    contents,
    'verantwortlich',
    'title',
    'für den Inhalt.'
  )

  const responsibleContent = getContent(
    contents,
    'verantwortlich',
    'content',
    '<strong>mySan Jeitziner GmbH</strong><br>Krydenweg 86<br>3900 Gamsen<br>Schweiz'
  )

  const liabilityContentEyebrow = getContent(
    contents,
    'haftung_inhalte',
    'eyebrow',
    'Haftung'
  )

  const liabilityContentTitle = getContent(
    contents,
    'haftung_inhalte',
    'title',
    'für Inhalte.'
  )

  const liabilityContent = getContent(
    contents,
    'haftung_inhalte',
    'content',
    '<p>Die Inhalte dieser Website wurden mit grösstmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.</p><p>Als Dienstanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen gesetzlichen Vorschriften verantwortlich.</p>'
  )

  const liabilityLinksEyebrow = getContent(
    contents,
    'haftung_links',
    'eyebrow',
    'Externe Links'
  )

  const liabilityLinksTitle = getContent(
    contents,
    'haftung_links',
    'title',
    'Haftung für Links.'
  )

  const liabilityLinksContent = getContent(
    contents,
    'haftung_links',
    'content',
    '<p>Diese Website kann Links zu externen Websites Dritter enthalten. Auf deren Inhalte haben wir keinen Einfluss. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.</p>'
  )

  const copyrightEyebrow = getContent(
    contents,
    'urheberrecht',
    'eyebrow',
    'Copyright'
  )

  const copyrightTitle = getContent(
    contents,
    'urheberrecht',
    'title',
    'Urheberrecht.'
  )

  const copyrightContent = getContent(
    contents,
    'urheberrecht',
    'content',
    '<p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem Schweizer Urheberrecht.</p>'
  )

  const backText = getContent(
    contents,
    'navigation',
    'back',
    'Zurück zur Startseite'
  )

  function RichText({
    html,
    className = '',
  }: {
    html: string | null
    className?: string
  }) {
    if (!html) return null

    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    )
  }

  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* HERO */}

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

                {heroTitleAccent && (
                  <>
                    <br />

                    <span
                      style={{
                        color: MYSAN_BLUE,
                      }}
                    >
                      {heroTitleAccent}
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
          style={{
            backgroundColor: MYSAN_BLUE,
          }}
        />

        <div className="mx-auto max-w-7xl px-8 pb-20 md:px-12 md:pb-24 lg:px-16">

          <div className="max-w-4xl">


            {/* UNTERNEHMEN */}

            {(companyEyebrow ||
              companyTitle ||
              companyContent) && (

              <section className="border-t border-neutral-200 pt-10">

                {companyEyebrow && (
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: MYSAN_BLUE,
                    }}
                  >
                    {companyEyebrow}
                  </p>
                )}

                {companyTitle && (
                  <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                    {companyTitle}
                  </h2>
                )}

                <RichText
                  html={companyContent}
                  className="mt-7 text-base leading-7 text-neutral-700"
                />

              </section>
            )}


            {/* KONTAKT */}

            {(contactEyebrow ||
              contactContent) && (

              <section className="mt-14 border-t border-neutral-200 pt-10">

                {contactEyebrow && (
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: MYSAN_BLUE,
                    }}
                  >
                    {contactEyebrow}
                  </p>
                )}

                <RichText
                  html={contactContent}
                  className="mt-6 text-base leading-7 text-neutral-700"
                />

              </section>
            )}


            {/* VERANTWORTLICH */}

            {(responsibleEyebrow ||
              responsibleTitle ||
              responsibleContent) && (

              <section className="mt-14 border-t border-neutral-200 pt-10">

                {responsibleEyebrow && (
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: MYSAN_BLUE,
                    }}
                  >
                    {responsibleEyebrow}
                  </p>
                )}

                {responsibleTitle && (
                  <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                    {responsibleTitle}
                  </h2>
                )}

                <RichText
                  html={responsibleContent}
                  className="mt-7 text-base leading-7 text-neutral-700"
                />

              </section>
            )}


            {/* HAFTUNG INHALTE */}

            {(liabilityContentEyebrow ||
              liabilityContentTitle ||
              liabilityContent) && (

              <section className="mt-14 border-t border-neutral-200 pt-10">

                {liabilityContentEyebrow && (
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: MYSAN_BLUE,
                    }}
                  >
                    {liabilityContentEyebrow}
                  </p>
                )}

                {liabilityContentTitle && (
                  <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                    {liabilityContentTitle}
                  </h2>
                )}

                <RichText
                  html={liabilityContent}
                  className="prose prose-neutral mt-7 max-w-none text-base leading-7 text-neutral-700"
                />

              </section>
            )}


            {/* HAFTUNG LINKS */}

            {(liabilityLinksEyebrow ||
              liabilityLinksTitle ||
              liabilityLinksContent) && (

              <section className="mt-14 border-t border-neutral-200 pt-10">

                {liabilityLinksEyebrow && (
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: MYSAN_BLUE,
                    }}
                  >
                    {liabilityLinksEyebrow}
                  </p>
                )}

                {liabilityLinksTitle && (
                  <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                    {liabilityLinksTitle}
                  </h2>
                )}

                <RichText
                  html={liabilityLinksContent}
                  className="prose prose-neutral mt-7 max-w-none text-base leading-7 text-neutral-700"
                />

              </section>
            )}


            {/* URHEBERRECHT */}

            {(copyrightEyebrow ||
              copyrightTitle ||
              copyrightContent) && (

              <section className="mt-14 border-t border-neutral-200 pt-10">

                {copyrightEyebrow && (
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: MYSAN_BLUE,
                    }}
                  >
                    {copyrightEyebrow}
                  </p>
                )}

                {copyrightTitle && (
                  <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                    {copyrightTitle}
                  </h2>
                )}

                <RichText
                  html={copyrightContent}
                  className="prose prose-neutral mt-7 max-w-none text-base leading-7 text-neutral-700"
                />

              </section>
            )}


            {/* ZURÜCK */}

            {backText && (
              <div className="mt-16 border-t border-neutral-200 pt-8">

                <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-neutral-500 transition-colors hover:text-[#1dabff]"
                >
                  <span className="mr-3 text-lg">
                    ←
                  </span>

                  {backText}
                </Link>

              </div>
            )}

          </div>

        </div>

      </section>

    </main>
  )
}