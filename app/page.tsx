
import Link from 'next/link'
import PageHero from '@/components/page-hero'

import {
  getSiteContent,
  getContent,
  getStorageUrl,
  getHeroMedia,
  getMediaUrl,
} from '@/lib/site-content'

import { sql } from '@/lib/neon'

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

type News = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  image_url?: string | null
  published?: boolean
  featured?: boolean
  created_at: string
}

/* =========================================================
   TEXT RENDERING
========================================================= */

function renderText(text: string) {
  return text.split('\n').map((line, index) => (
    <span key={index}>
      {index > 0 && <br />}
      {line}
    </span>
  ))
}

/* =========================================================
   IMAGE URL
========================================================= */

function resolveImageUrl(
  imageUrl: string | null | undefined
): string | null {
  if (!imageUrl?.trim()) return null

  return getStorageUrl(imageUrl) || imageUrl
}

/* =========================================================
   HOMEPAGE
========================================================= */

export default async function HomePage() {
  /*
  =========================================================
  CONTENT AUS NEON
  =========================================================
  */

  const contents = await getSiteContent('home')

  /*
  =========================================================
  HERO TEXTE
  =========================================================
  */

  const heroEyebrow =
    getContent(
      contents,
      'hero',
      'eyebrow',
      'mySan Jeitziner GmbH'
    ) || ''

  const heroTitle =
    getContent(
      contents,
      'hero',
      'title',
      'Ihr\nSanitär\nim Wallis'
    ) || ''

  const heroDescription =
    getContent(
      contents,
      'hero',
      'description',
      'Für sämtliche Sanitärarbeiten\nin und ums Haus.'
    ) || ''

  /*
  =========================================================
  HERO BILD AUS NEON: page_media
  =========================================================
  */

  const heroMedia = await getHeroMedia('home')

  const fallbackHeroImagePath =
    getContent(
      contents,
      'hero',
      'image',
      'hero/home.jpg'
    )

  const fallbackHeroImage =
    getStorageUrl(fallbackHeroImagePath) || '/auto.png'

  const heroImage =
    getMediaUrl(heroMedia) || fallbackHeroImage

  const heroImageOpacity =
    heroMedia?.opacity ?? 0.18

  /*
  =========================================================
  INTRO
  =========================================================
  */

  const introEyebrow =
    getContent(
      contents,
      'intro',
      'eyebrow',
      'mySan Jeitziner GmbH'
    ) || ''

  const introTitle =
    getContent(
      contents,
      'intro',
      'title',
      'Persönlich.\nKompetent.\nZuverlässig.'
    ) || ''

  const introText1 =
    getContent(
      contents,
      'intro',
      'text_1',
      'Wir sind Ihr Ansprechpartner für Sanitär und Heizung im Wallis.'
    ) || ''

  const introText2 =
    getContent(
      contents,
      'intro',
      'text_2',
      'Von kleinen Reparaturen bis zu kompletten Installationen begleiten wir unsere Kunden kompetent und zuverlässig.'
    ) || ''

  const introLink =
    getContent(
      contents,
      'intro',
      'link',
      'Mehr über uns'
    ) || ''

  /*
  =========================================================
  NEWS TEXTE
  =========================================================
  */

  const newsEyebrow =
    getContent(
      contents,
      'news',
      'eyebrow',
      'Aktuelles'
    ) || ''

  const newsTitle =
    getContent(
      contents,
      'news',
      'title',
      'News'
    ) || ''

  const newsLink =
    getContent(
      contents,
      'news',
      'link',
      'Alle News →'
    ) || ''

  /*
  =========================================================
  REFERENZEN TEXTE
  =========================================================
  */

  const referencesEyebrow =
    getContent(
      contents,
      'references',
      'eyebrow',
      'Projekte'
    ) || ''

  const referencesTitle =
    getContent(
      contents,
      'references',
      'title',
      'Unsere Referenzen'
    ) || ''

  const referencesLink =
    getContent(
      contents,
      'references',
      'link',
      'Alle Referenzen →'
    ) || ''

  const referenceButton =
    getContent(
      contents,
      'references',
      'button',
      'Referenz ansehen →'
    ) || ''

  /*
  =========================================================
  KONTAKT
  =========================================================
  */

  const contactEyebrow =
    getContent(
      contents,
      'contact',
      'eyebrow',
      'Kontakt'
    ) || ''

  const contactTitle =
    getContent(
      contents,
      'contact',
      'title',
      'Sie haben Fragen\noder ein Projekt?'
    ) || ''

  const contactText =
    getContent(
      contents,
      'contact',
      'text',
      'Wir beraten Sie gerne persönlich und finden gemeinsam die passende Lösung.'
    ) || ''

  const contactButton =
    getContent(
      contents,
      'contact',
      'button',
      'Kontakt aufnehmen'
    ) || ''

  /*
  =========================================================
  NEWS AUS NEON
  =========================================================
  */

  let news: News[] = []

  try {
    const newsData = await sql`
      SELECT
        id,
        title,
        slug,
        excerpt,
        image_url,
        published,
        featured,
        created_at
      FROM public.news
      WHERE published = TRUE
  AND featured = TRUE
      ORDER BY created_at DESC
      LIMIT 3
    `

    news = newsData as News[]
  } catch (error) {
    console.error(
      'Fehler beim Laden der News aus Neon:',
      error
    )
  }

  /*
  =========================================================
  REFERENZEN AUS NEON
  =========================================================
  */

  let references: Reference[] = []

  try {
    const referencesData = await sql`
      SELECT
        id,
        title,
        slug,
        location,
        year,
        published,
        featured,
        created_at
      FROM public."references"
      WHERE published = TRUE
        AND featured = TRUE
      ORDER BY created_at DESC
      LIMIT 3
    `

    references = referencesData as Reference[]
  } catch (error) {
    console.error(
      'Fehler beim Laden der Referenzen aus Neon:',
      error
    )
  }

  /*
  =========================================================
  REFERENZBILDER AUS NEON
  =========================================================
  */

  let referenceImages: ReferenceImage[] = []

  if (references.length > 0) {
    const referenceIds = references.map(
      (reference) => reference.id
    )

    try {
      const imagesData = await sql`
        SELECT
          id,
          reference_id,
          image_url,
          sort_order
        FROM public.reference_images
        WHERE reference_id = ANY(${referenceIds}::uuid[])
        ORDER BY sort_order ASC
      `

      referenceImages = imagesData as ReferenceImage[]
    } catch (error) {
      console.error(
        'Fehler beim Laden der Referenzbilder aus Neon:',
        error
      )
    }
  }

  function getReferenceImage(referenceId: string) {
    const image = referenceImages.find(
      (item) => item.reference_id === referenceId
    )

    return resolveImageUrl(image?.image_url)
  }

  /*
  =========================================================
  DATUM
  =========================================================
  */

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date))
  }

  /*
  =========================================================
  HERO TITEL
  =========================================================
  */

  const heroTitleParts = heroTitle.split('\n')

  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (
    <main className="bg-white text-neutral-900">

      {/* HERO */}

      <PageHero
        eyebrow={heroEyebrow}
        title={
          <>
            {heroTitleParts.map((line, index) => (
              <span key={index}>
                {index > 0 && <br />}

                {index === 1 ? (
                  <span style={{ color: MYSAN_BLUE }}>
                    {line}
                  </span>
                ) : (
                  line
                )}
              </span>
            ))}
          </>
        }
        description={renderText(heroDescription)}
        image={heroImage}
        imageOpacity={heroImageOpacity}
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href="/kontakt"
            className="
              inline-flex h-11 items-center justify-center
              rounded-full px-6 text-sm font-semibold text-white
              transition-all duration-200 hover:-translate-y-0.5
              hover:opacity-90
            "
            style={{ backgroundColor: MYSAN_BLUE }}
          >
            {contactButton}
            <span className="ml-3 text-lg">→</span>
          </Link>

          <Link
            href="/referenzen"
            className="
              inline-flex h-11 items-center justify-center
              rounded-full border px-6 text-sm font-semibold
              transition-all duration-200 hover:bg-neutral-50
            "
            style={{
              borderColor: MYSAN_BLUE,
              color: MYSAN_BLUE,
            }}
          >
            {referencesTitle}
          </Link>
        </div>
      </PageHero>

      {/* INTRO */}

      <section className="relative overflow-hidden bg-white">
        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{ backgroundColor: MYSAN_BLUE }}
        />

        <div className="mx-auto max-w-7xl px-8 py-10 md:px-12 md:py-14 lg:px-16">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: MYSAN_BLUE }}
              >
                {introEyebrow}
              </p>

              <h2 className="mt-3 text-4xl font-light leading-tight tracking-tight md:text-5xl">
                {renderText(introTitle)}
              </h2>
            </div>

            <div>
              <p className="text-base leading-7 text-neutral-600">
                {renderText(introText1)}
              </p>

              <p className="mt-4 text-base leading-7 text-neutral-600">
                {renderText(introText2)}
              </p>

              <Link
                href="/team"
                className="mt-5 inline-flex items-center text-sm font-semibold"
                style={{ color: MYSAN_BLUE }}
              >
                {introLink}
                <span className="ml-3">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS */}

      {news.length > 0 && (
        <section className="relative overflow-hidden bg-[#F4F7FA]">
          <div
            className="absolute left-0 top-0 h-full w-2"
            style={{ backgroundColor: MYSAN_BLUE }}
          />

          <div className="mx-auto max-w-7xl px-8 py-12 md:px-12 md:py-16 lg:px-16">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{ color: MYSAN_BLUE }}
                >
                  {newsEyebrow}
                </p>

                <h2 className="mt-3 text-4xl font-light tracking-tight md:text-5xl">
                  {newsTitle}
                </h2>
              </div>

              <Link
                href="/news"
                className="text-sm font-semibold"
                style={{ color: MYSAN_BLUE }}
              >
                {newsLink}
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {news.map((item) => {
                const imageUrl = resolveImageUrl(item.image_url)

                return (
                  <Link
                    key={item.id}
                    href={`/news/${item.slug}`}
                    className="group overflow-hidden bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {imageUrl ? (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div
                        className="aspect-[16/10]"
                        style={{ backgroundColor: MYSAN_BLUE }}
                      />
                    )}

                    <div className="p-6">
                      <p className="text-xs font-medium text-neutral-400">
                        {formatDate(item.created_at)}
                      </p>

                      <h3 className="mt-2 text-xl font-light transition-colors duration-200 group-hover:text-[#1dabff]">
                        {item.title}
                      </h3>

                      {item.excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
                          {item.excerpt}
                        </p>
                      )}

                      <div
                        className="mt-4 text-sm font-semibold"
                        style={{ color: MYSAN_BLUE }}
                      >
                        Weiterlesen →
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* REFERENZEN */}

      <section className="relative overflow-hidden bg-white">
        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{ backgroundColor: MYSAN_BLUE }}
        />

        <div className="mx-auto max-w-7xl px-8 py-12 md:px-12 md:py-16 lg:px-16">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: MYSAN_BLUE }}
              >
                {referencesEyebrow}
              </p>

              <h2 className="mt-3 text-4xl font-light tracking-tight md:text-5xl">
                {referencesTitle}
              </h2>
            </div>

            <Link
              href="/referenzen"
              className="text-sm font-semibold"
              style={{ color: MYSAN_BLUE }}
            >
              {referencesLink}
            </Link>
          </div>

          {references.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {references.map((reference) => {
                const image = getReferenceImage(reference.id)

                return (
                  <Link
                    key={reference.id}
                    href={`/referenzen/${reference.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F7FA]">
                      {image ? (
                        <img
                          src={image}
                          alt={reference.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                          Kein Bild vorhanden
                        </div>
                      )}
                    </div>

                    <div className="border-b border-neutral-200 pb-5 pt-4">
                      <h3 className="text-lg font-light transition-colors duration-200 group-hover:text-[#1dabff]">
                        {reference.title}
                      </h3>

                      {(reference.location || reference.year) && (
                        <p className="mt-1.5 text-sm text-neutral-500">
                          {reference.location}
                          {reference.location && reference.year && ' · '}
                          {reference.year}
                        </p>
                      )}

                      <div
                        className="mt-3 text-sm font-semibold"
                        style={{ color: MYSAN_BLUE }}
                      >
                        {referenceButton}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="mt-8 border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
              Die ersten Referenzen werden demnächst veröffentlicht.
            </div>
          )}
        </div>
      </section>

      {/* KONTAKT */}

      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: MYSAN_BLUE }}
      >
        <div className="mx-auto max-w-7xl px-8 py-12 md:px-12 md:py-14 lg:px-16">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                {contactEyebrow}
              </p>

              <h2 className="mt-2 text-3xl font-light text-white md:text-4xl">
                {renderText(contactTitle)}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
                {renderText(contactText)}
              </p>
            </div>

            <Link
              href="/kontakt"
              className="inline-flex w-fit items-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
            >
              {contactButton}
              <span className="ml-3 text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
