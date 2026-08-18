import Link from 'next/link'
import PageHero from '@/components/page-hero'

import {
  getSiteContent,
  getContent,
  getStorageUrl,
} from '@/lib/site-content'

import { createClient } from '@/lib/supabase/server'

const MYSAN_BLUE = '#1dabff'

type News = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  image_url?: string | null
  published?: boolean
  featured?: boolean
  created_at: string
}

/* =========================================================
   PAGE MEDIA
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
  created_at?: string
  updated_at?: string
}

export default async function NewsPage() {

  const supabase = await createClient()

  /* =========================================================
     CONTENT
  ========================================================= */

  const contents =
    await getSiteContent('news')


  /* =========================================================
     HERO TEXTE
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
      'Aktuelles'
    ) || ''

  const heroTitleAccent =
    getContent(
      contents,
      'hero',
      'title_accent',
      'von mySan'
    ) || ''

  const heroDescription =
    getContent(
      contents,
      'hero',
      'description',
      'Neuigkeiten, Projekte und Einblicke rund um mySan Jeitziner.'
    )


  /* =========================================================
     HERO BILD AUS PAGE_MEDIA
     
     Admin:
     Website-Inhalte → News → Hero-Bild

     page       = news
     media_type = hero
  ========================================================= */

  const {
    data: heroMediaData,
    error: heroMediaError,
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
      visible,
      created_at,
      updated_at
    `)
    .eq('page', 'news')
    .eq('media_type', 'hero')
    .eq('visible', true)
    .maybeSingle()

  const heroMedia =
    heroMediaData as PageMedia | null


  /* =========================================================
     FALLBACK HERO BILD
     
     Falls kein page_media Eintrag vorhanden ist,
     wird weiterhin das alte site_content Bild verwendet.
  ========================================================= */

  const fallbackHeroImagePath =
    getContent(
      contents,
      'hero',
      'image',
      'hero/news.jpg'
    )

  const fallbackHeroImage =
    getStorageUrl(
      fallbackHeroImagePath
    ) || '/news.jpg'


  /* =========================================================
     AKTIVES HERO BILD
     
     PRIORITÄT:

     1. public_url
     2. storage_path
     3. site_content
     4. /news.jpg
  ========================================================= */

  let heroImage =
    fallbackHeroImage

  if (heroMedia) {

    if (heroMedia.public_url) {

      heroImage =
        heroMedia.public_url

    } else if (heroMedia.storage_path) {

      heroImage =
        getStorageUrl(
          heroMedia.storage_path
        ) || fallbackHeroImage

    }

  }


  /* =========================================================
     HERO OPACITY
  ========================================================= */

  const heroImageOpacity =
    heroMedia?.opacity ?? 0.18


  /* =========================================================
     HERO ALT TEXT
  ========================================================= */

  const heroImageAlt =
    heroMedia?.alt_text ||
    'Aktuelles von mySan Jeitziner'


  /* =========================================================
     MEDIA FEHLER
  ========================================================= */

  if (heroMediaError) {

    console.error(
      'NEWS PAGE MEDIA ERROR:',
      heroMediaError
    )

  }


  /* =========================================================
     TEXTE
  ========================================================= */

  const emptyText =
    getContent(
      contents,
      'overview',
      'empty',
      'Aktuell gibt es keine Neuigkeiten.'
    ) || ''

  const readMoreText =
    getContent(
      contents,
      'overview',
      'read_more',
      'Weiterlesen'
    ) || ''

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
      'Sie haben ein Projekt?'
    )

  const contactText =
    getContent(
      contents,
      'contact',
      'text',
      'Wir freuen uns über Ihre Kontaktaufnahme.'
    )

  const contactButton =
    getContent(
      contents,
      'contact',
      'button',
      'Kontakt aufnehmen'
    )


  /* =========================================================
     NEWS
  ========================================================= */

  const {
    data: newsData,
    error: newsError,
  } =
    await supabase
      .from('news')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        image_url,
        published,
        featured,
        created_at
      `)
      .eq(
        'published',
        true
      )
      .order(
        'created_at',
        {
          ascending: false,
        }
      )

  const news =
    (newsData as News[] | null) || []


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <main className="bg-white text-neutral-900">


      {/* =====================================================
          HERO
      ===================================================== */}

      <PageHero

        eyebrow={
          heroEyebrow
        }

        title={
          <>
            {heroTitle}

            <br />

            <span
              style={{
                color:
                  MYSAN_BLUE,
              }}
            >
              {heroTitleAccent}
            </span>
          </>
        }

        description={
          heroDescription
        }

        image={
          heroImage
        }

        imageOpacity={
          heroImageOpacity
        }

      />


      {/* =====================================================
          NEWS
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-white
        "
      >

        {/* Blauer Rand */}

        <div
          className="
            absolute
            left-0
            top-0
            h-full
            w-2
          "
          style={{
            backgroundColor:
              MYSAN_BLUE,
          }}
        />


        <div
          className="
            mx-auto
            max-w-7xl
            px-8
            pb-16
            pt-8
            md:px-12
            md:pb-20
            md:pt-10
            lg:px-16
          "
        >


          {/* Fehler */}

          {newsError && (

            <div
              className="
                border
                border-red-200
                bg-red-50
                px-6
                py-5
                text-sm
                text-red-700
              "
            >
              Die News konnten momentan nicht geladen werden.
            </div>

          )}


          {/* Keine News */}

          {!newsError &&
            news.length === 0 && (

              <div
                className="
                  border
                  border-dashed
                  border-neutral-300
                  px-6
                  py-12
                  text-center
                  text-sm
                  text-neutral-500
                "
              >
                {emptyText}
              </div>

            )}


          {/* News */}

          {news.length > 0 && (

            <div
              className="
                grid
                gap-x-6
                gap-y-10
                md:grid-cols-2
                lg:grid-cols-3
              "
            >

              {news.map(
                (item) => (

                  <Link
                    key={
                      item.id
                    }
                    href={`/news/${item.slug}`}
                    className="
                      group
                      block
                    "
                  >

                    {/* Bild */}

                    <div
                      className="
                        relative
                        aspect-[16/10]
                        overflow-hidden
                        bg-[#F4F7FA]
                      "
                    >

                      {item.image_url ? (

                        <img
                          src={
                            item.image_url
                          }
                          alt={
                            item.title
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-700
                            group-hover:scale-105
                          "
                        />

                      ) : (

                        <div
                          className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            text-white
                          "
                          style={{
                            backgroundColor:
                              MYSAN_BLUE,
                          }}
                        >
                          Kein Bild vorhanden
                        </div>

                      )}

                    </div>


                    {/* Text */}

                    <div
                      className="
                        relative
                        border-b
                        border-neutral-200
                        pb-6
                        pt-5
                      "
                    >

                      {/* Blauer Rand */}

                      <div
                        className="
                          absolute
                          left-0
                          top-0
                          h-full
                          w-1
                        "
                        style={{
                          backgroundColor:
                            MYSAN_BLUE,
                        }}
                      />


                      <div
                        className="
                          pl-4
                        "
                      >

                        {/* Datum */}

                        <p
                          className="
                            text-xs
                            font-medium
                            text-neutral-400
                          "
                        >
                          {new Intl.DateTimeFormat(
                            'de-CH',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            }
                          ).format(
                            new Date(
                              item.created_at
                            )
                          )}
                        </p>


                        {/* Titel */}

                        <h3
                          className="
                            mt-2
                            text-xl
                            font-light
                            leading-tight
                            transition-colors
                            duration-200
                            group-hover:text-[#1dabff]
                          "
                        >
                          {item.title}
                        </h3>


                        {/* Excerpt */}

                        {item.excerpt && (

                          <div
                            className="
                              mt-3
                              line-clamp-3
                              text-sm
                              leading-6
                              text-neutral-600
                            "
                            dangerouslySetInnerHTML={{
                              __html:
                                item.excerpt,
                            }}
                          />

                        )}


                        {/* Weiterlesen */}

                        <div
                          className="
                            mt-4
                            text-sm
                            font-semibold
                          "
                          style={{
                            color:
                              MYSAN_BLUE,
                          }}
                        >

                          {readMoreText}

                          <span
                            className="
                              ml-2
                            "
                          >
                            →
                          </span>

                        </div>

                      </div>

                    </div>

                  </Link>

                )
              )}

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          KONTAKT
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
        "
        style={{
          backgroundColor:
            MYSAN_BLUE,
        }}
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-8
            py-12
            md:px-12
            md:py-14
            lg:px-16
          "
        >

          <div
            className="
              flex
              flex-col
              gap-6
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            <div>

              {contactEyebrow && (

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-white/60
                  "
                >
                  {contactEyebrow}
                </p>

              )}


              {contactTitle && (

                <h2
                  className="
                    mt-2
                    text-3xl
                    font-light
                    text-white
                    md:text-4xl
                  "
                >
                  {contactTitle}
                </h2>

              )}


              {contactText && (

                <p
                  className="
                    mt-2
                    text-sm
                    text-white/75
                  "
                >
                  {contactText}
                </p>

              )}

            </div>


            {contactButton && (

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

                {contactButton}

                <span
                  className="
                    ml-3
                    text-lg
                  "
                >
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