import Link from 'next/link'
import PageHero from '@/components/page-hero'

import {
  getSiteContent,
  getContent,
  getStorageUrl,
} from '@/lib/site-content'

import { createClient } from '@/lib/supabase/server'

const MYSAN_BLUE = '#1dabff'

/* =========================================================
   TYPES
========================================================= */

type PageMedia = {
  id: string
  page: string
  media_type: string
  storage_path: string | null
  public_url: string | null
  alt_text: string | null
  opacity: number | null
  visible: boolean
}

/* =========================================================
   PAGE
========================================================= */

export default async function TeamPage() {
  const supabase = await createClient()

  /* =========================================================
     WEBSITE-INHALTE
  ========================================================= */

  const contents = await getSiteContent('team')

  /* =========================================================
     BILDER AUS PAGE_MEDIA
  ========================================================= */

  const {
    data: mediaData,
    error: mediaError,
  } = await supabase
    .from('page_media')
    .select(`
      id,
      page,
      media_type,
      storage_path,
      public_url,
      alt_text,
      opacity,
      visible
    `)
    .eq('page', 'team')

  const media =
    (mediaData as PageMedia[] | null) || []

  /* =========================================================
     HERO-BILD
  ========================================================= */

  const heroMedia =
    media.find(
      (item) =>
        item.media_type === 'hero' &&
        item.visible !== false
    ) || null

  const heroImageFromDatabase =
    heroMedia?.public_url ||
    (
      heroMedia?.storage_path
        ? getStorageUrl(
            heroMedia.storage_path
          )
        : null
    )

  const heroImage =
    heroImageFromDatabase ||
    '/wir.jpg'

  const heroImageAlt =
    heroMedia?.alt_text ||
    'mySan Jeitziner'

  const heroImageOpacity =
    heroMedia?.opacity ??
    0.4

  /* =========================================================
     TEAM-BILD
  ========================================================= */

  const teamMedia =
    media.find(
      (item) =>
        item.media_type === 'team' &&
        item.visible !== false
    ) || null

  const teamImageFromDatabase =
    teamMedia?.public_url ||
    (
      teamMedia?.storage_path
        ? getStorageUrl(
            teamMedia.storage_path
          )
        : null
    )

  const teamImage =
    teamImageFromDatabase ||
    '/zwei.jpg'

  const teamImageAlt =
    teamMedia?.alt_text ||
    'Mathias und Evelyne Jeitziner'

  /* =========================================================
     HERO
  ========================================================= */

  const heroEyebrow =
    getContent(
      contents,
      'hero',
      'eyebrow',
      'mySan Jeitziner'
    )

  const heroTitle =
    getContent(
      contents,
      'hero',
      'title',
      'Gerne stellen wir uns vor.'
    )

  const heroText =
    getContent(
      contents,
      'hero',
      'text',
      'Menschen, die für Qualität, Service und persönliche Beratung stehen.'
    )

  const heroDescription =
    getContent(
      contents,
      'hero',
      'description',
      'Gerne stellen wir uns vor!'
    )

  /* =========================================================
     TEAM
  ========================================================= */

  const teamEyebrow =
    getContent(
      contents,
      'team',
      'eyebrow',
      'Unser Team'
    )

  const teamHeading =
    getContent(
      contents,
      'team',
      'heading',
      'Persönlich.\nKompetent.\nGemeinsam.'
    )

  const teamIntro =
    getContent(
      contents,
      'team',
      'intro',
      'Gerne stellen wir uns vor!'
    )

  const mathias =
    getContent(
      contents,
      'team',
      'mathias',
      'Mein Name ist Mathias Jeitziner. Im Jahr 2009 habe ich meine Ausbildung zum Sanitärinstallateur abgeschlossen und seither vielseitige Erfahrungen im Kundendienst, bei Umbauten und Neubauten sowie in der Wasserversorgung gesammelt.'
    )

  const passion =
    getContent(
      contents,
      'team',
      'passion',
      'Die Arbeit mit Wasser und die handwerklichen Herausforderungen, die jeder Auftrag mit sich bringt, begeistern mich bis heute. Qualität, Zuverlässigkeit und eine saubere, präzise Arbeitsweise stehen für mich an erster Stelle.'
    )

  const company =
    getContent(
      contents,
      'team',
      'company',
      'Am 3. August 2023 gründeten wir unser Unternehmen als Einzelfirma. Seit dem 1. September 2025 führen wir unser Unternehmen als mySan Jeitziner GmbH weiter.'
    )

  const evelyne =
    getContent(
      contents,
      'team',
      'evelyne',
      'Unterstützt werde ich von meiner Frau Evelyne. Sie ist von Anfang an fester Bestandteil unseres Unternehmens, arbeitet täglich an meiner Seite auf den Baustellen und kümmert sich gleichzeitig um die Administration.'
    )

  const conclusion =
    getContent(
      contents,
      'team',
      'conclusion',
      'Gemeinsam bilden wir ein eingespieltes Team – persönlich, bodenständig und mit vollem Einsatz für unsere Kundinnen und Kunden.'
    )

  /* =========================================================
     INTRO
  ========================================================= */

  const introTitle =
    getContent(
      contents,
      'intro',
      'title',
      'Persönlich für Sie da.'
    )

  const introText =
    getContent(
      contents,
      'intro',
      'text',
      'Unser Team steht Ihnen mit Erfahrung und Fachwissen zur Seite.'
    )

  /* =========================================================
     WERTE
  ========================================================= */

  const personalTitle =
    getContent(
      contents,
      'values',
      'personal_title',
      'Persönlich'
    )

  const personalText =
    getContent(
      contents,
      'values',
      'personal_text',
      'Direkter Kontakt, persönliche Beratung und kurze Wege.'
    )

  const groundedTitle =
    getContent(
      contents,
      'values',
      'grounded_title',
      'Bodenständig'
    )

  const groundedText =
    getContent(
      contents,
      'values',
      'grounded_text',
      'Wir arbeiten unkompliziert, zuverlässig und mit Freude an unserem Handwerk.'
    )

  const reliableTitle =
    getContent(
      contents,
      'values',
      'reliable_title',
      'Zuverlässig'
    )

  const reliableText =
    getContent(
      contents,
      'values',
      'reliable_text',
      'Saubere Arbeit, fachgerechte Lösungen und ein Service, auf den Sie zählen können.'
    )

  /* =========================================================
     KONTAKT
  ========================================================= */

  const contactEyebrow =
    getContent(
      contents,
      'contact',
      'eyebrow',
      'Kontakt'
    )

  const contactTitle =
    getContent(
      contents,
      'contact',
      'title',
      'Wir freuen uns auf Sie.'
    )

  const contactText =
    getContent(
      contents,
      'contact',
      'text',
      'Persönlich, kompetent und zuverlässig.'
    )

  const contactButton =
    getContent(
      contents,
      'contact',
      'button',
      'Kontakt aufnehmen'
    )

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* =====================================================
          HERO
      ===================================================== */}

      <PageHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        description={
          <>
            {heroText}

            {heroDescription && (
              <span className="mt-3 block text-sm text-neutral-500">
                {heroDescription}
              </span>
            )}
          </>
        }
        image={heroImage}
        imageOpacity={heroImageOpacity}
      />

      {/* =====================================================
          TEAM
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">

        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{
            backgroundColor:
              MYSAN_BLUE,
          }}
        />

        <div className="mx-auto max-w-7xl px-8 py-10 md:px-12 md:py-14 lg:px-16">

          <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-center">

            {/* =================================================
                LINKE SEITE
            ================================================= */}

            <div>

              {teamEyebrow && (
                <p
                  className="text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{
                    color:
                      MYSAN_BLUE,
                  }}
                >
                  {teamEyebrow}
                </p>
              )}

              {teamHeading && (
                <h2 className="mt-3 whitespace-pre-line text-4xl font-light leading-tight tracking-tight md:text-5xl">
                  {teamHeading}
                </h2>
              )}

              {/* =================================================
                  TEAM-BILD AUS SUPABASE
              ================================================= */}

              <div className="mt-8 overflow-hidden rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.12)]">

                {teamImage ? (
                  <img
                    src={teamImage}
                    alt={teamImageAlt}
                    className="h-auto w-full object-cover transition duration-700 hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-[#F4F7FA] text-sm text-neutral-400">
                    Kein Team-Bild vorhanden
                  </div>
                )}

              </div>

            </div>

            {/* =================================================
                RECHTE SEITE
            ================================================= */}

            <div className="flex items-center">

              <div className="max-w-3xl">

                {teamIntro && (
                  <p className="mb-5 text-base font-medium leading-7 text-neutral-900">
                    {teamIntro}
                  </p>
                )}

                {mathias && (
                  <p className="text-base leading-7 text-neutral-700">
                    {mathias}
                  </p>
                )}

                {passion && (
                  <p className="mt-5 text-base leading-7 text-neutral-700">
                    {passion}
                  </p>
                )}

                {company && (
                  <p className="mt-5 text-base leading-7 text-neutral-700">
                    {company}
                  </p>
                )}

                {evelyne && (
                  <p className="mt-5 text-base leading-7 text-neutral-700">
                    {evelyne}
                  </p>
                )}

                {conclusion && (
                  <p className="mt-5 text-base leading-7 text-neutral-700">
                    {conclusion}
                  </p>
                )}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      {(introTitle || introText) && (

        <section className="relative overflow-hidden bg-white">

          <div
            className="absolute left-0 top-0 h-full w-2"
            style={{
              backgroundColor:
                MYSAN_BLUE,
            }}
          />

          <div className="mx-auto max-w-7xl px-8 py-10 md:px-12 md:py-14 lg:px-16">

            <div className="max-w-3xl">

              {introTitle && (
                <h2 className="text-3xl font-light md:text-4xl">
                  {introTitle}
                </h2>
              )}

              {introText && (
                <p className="mt-4 text-base leading-7 text-neutral-600">
                  {introText}
                </p>
              )}

            </div>

          </div>

        </section>

      )}

      {/* =====================================================
          WERTE
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">

        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{
            backgroundColor:
              MYSAN_BLUE,
          }}
        />

        <div className="mx-auto max-w-7xl px-8 py-10 md:px-12 md:py-14 lg:px-16">

          <div className="grid gap-5 md:grid-cols-3">

            <TeamValue
              title={personalTitle}
              text={personalText}
            />

            <TeamValue
              title={groundedTitle}
              text={groundedText}
            />

            <TeamValue
              title={reliableTitle}
              text={reliableText}
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          KONTAKT
      ===================================================== */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor:
            MYSAN_BLUE,
        }}
      >

        <div className="mx-auto max-w-7xl px-8 py-10 md:px-12 md:py-12 lg:px-16">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              {contactEyebrow && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                  {contactEyebrow}
                </p>
              )}

              {contactTitle && (
                <h2 className="mt-2 text-3xl font-light text-white md:text-4xl">
                  {contactTitle}
                </h2>
              )}

              {contactText && (
                <p className="mt-2 text-sm text-white/75">
                  {contactText}
                </p>
              )}

            </div>

            {contactButton && (
              <Link
                href="/kontakt"
                className="inline-flex w-fit items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                {contactButton}

                <span className="ml-3 text-lg">
                  →
                </span>
              </Link>
            )}

          </div>

        </div>

      </section>

    </main>
  )
}


/* =========================================================
   TEAM VALUE
========================================================= */

function TeamValue({
  title,
  text,
}: {
  title: string | null
  text: string | null
}) {
  return (
    <div className="relative border border-neutral-200 bg-white p-6">

      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{
          backgroundColor:
            MYSAN_BLUE,
        }}
      />

      <div
        className="flex h-8 w-8 items-center justify-center"
        style={{
          color:
            MYSAN_BLUE,
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

      {title && (
        <h3 className="mt-4 text-xl font-light">
          {title}
        </h3>
      )}

      {text && (
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          {text}
        </p>
      )}

    </div>
  )
}