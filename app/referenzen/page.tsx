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
   REFERENCE
========================================================= */

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

/* =========================================================
   REFERENCE IMAGE
========================================================= */

type ReferenceImage = {
  id: string
  reference_id: string
  image_url: string | null
  sort_order?: number | null
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

/* =========================================================
   PAGE
========================================================= */

export default async function ReferenzenPage() {

  const supabase = await createClient()

  /* =========================================================
     CONTENT
  ========================================================= */

  const contents =
    await getSiteContent('referenzen')


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
      'Unsere\nReferenzen'
    ) || ''

  const heroDescription =
    getContent(
      contents,
      'hero',
      'description',
      'Einblick in ausgewählte Projekte und Arbeiten von mySan Jeitziner.'
    )


  /* =========================================================
     HERO BILD AUS PAGE_MEDIA
     
     Admin:
     Website-Inhalte → Referenzen → Hero-Bild

     page       = referenzen
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
    .eq('page', 'referenzen')
    .eq('media_type', 'hero')
    .eq('visible', true)
    .maybeSingle()

  const heroMedia =
    heroMediaData as PageMedia | null


  /* =========================================================
     FALLBACK HERO BILD
  ========================================================= */

  const fallbackHeroImagePath =
    getContent(
      contents,
      'hero',
      'image',
      'hero/referenzen.jpg'
    )

  const fallbackHeroImage =
    getStorageUrl(
      fallbackHeroImagePath
    ) || '/badewanne.jpg'


  /* =========================================================
     AKTIVES HERO BILD
     
     PRIORITÄT:

     1. public_url
     2. storage_path
     3. site_content
     4. /badewanne.jpg
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
    heroMedia?.opacity ?? 0.40


  /* =========================================================
     HERO ALT
  ========================================================= */

  const heroImageAlt =
    heroMedia?.alt_text ||
    'Referenzen von mySan Jeitziner'


  /* =========================================================
     MEDIA FEHLER
  ========================================================= */

  if (heroMediaError) {

    console.error(
      'REFERENZEN PAGE MEDIA ERROR:',
      heroMediaError
    )

  }


  /* =========================================================
     PROJEKTE TEXTE
  ========================================================= */

  const projectsEyebrow =
    getContent(
      contents,
      'projects',
      'eyebrow',
      'Projekte'
    )

  const projectsTitle =
    getContent(
      contents,
      'projects',
      'title',
      'Sanitärarbeiten mit Qualität'
    )

  const emptyText =
    getContent(
      contents,
      'projects',
      'empty',
      'Aktuell sind keine Referenzen veröffentlicht.'
    ) || ''


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
     REFERENZEN LADEN
  ========================================================= */

  const {
    data: referencesData,
    error: referencesError,
  } = await supabase
    .from('references')
    .select(`
      id,
      title,
      slug,
      location,
      year,
      published,
      featured,
      created_at
    `)
    .eq('published', true)
    .order('created_at', {
      ascending: false,
    })

  const references =
    (referencesData as Reference[] | null) || []


  /* =========================================================
     REFERENZ-BILDER LADEN
  ========================================================= */

  const referenceIds =
    references.map(
      (reference) =>
        reference.id
    )

  let referenceImages:
    ReferenceImage[] = []

  if (referenceIds.length > 0) {

    const {
      data: imagesData,
      error: imagesError,
    } = await supabase
      .from('reference_images')
      .select(`
        id,
        reference_id,
        image_url,
        sort_order
      `)
      .in(
        'reference_id',
        referenceIds
      )
      .order(
        'sort_order',
        {
          ascending: true,
        }
      )

    if (imagesError) {

      console.error(
        'REFERENZ BILDER FEHLER:',
        imagesError
      )

    }

    referenceImages =
      (imagesData as ReferenceImage[] | null) || []

  }


  /* =========================================================
     REFERENZ-BILD AUFLÖSEN
     
     Die Bilder aus deiner Datenbank sind bereits
     vollständige Supabase URLs:

     https://jkuysvbbsxfbuqmxqfaw.supabase.co/...
     
     Deshalb werden vollständige URLs direkt verwendet.
  ========================================================= */

  function resolveReferenceImage(
    imageUrl: string | null | undefined
  ): string | null {

    if (!imageUrl) {
      return null
    }

    const value =
      imageUrl.trim()

    if (!value) {
      return null
    }

    /* Vollständige URL */

    if (
      value.startsWith('http://') ||
      value.startsWith('https://')
    ) {

      return value

    }

    /* Lokaler Pfad */

    if (
      value.startsWith('/')
    ) {

      return value

    }

    /* Supabase Storage Pfad */

    return (
      getStorageUrl(value) ||
      `/${value}`
    )

  }


  /* =========================================================
     BILD ZUR REFERENZ
  ========================================================= */

  function getReferenceImage(
    referenceId: string
  ): string | null {

    const image =
      referenceImages.find(
        (item) =>
          item.reference_id ===
          referenceId
      )

    return resolveReferenceImage(
      image?.image_url
    )

  }


  /* =========================================================
     HERO TITEL
  ========================================================= */

  const heroTitleParts =
    heroTitle.split('\n')


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
            {heroTitleParts.map(
              (line, index) => (

                <span
                  key={index}
                >

                  {index > 0 && (
                    <br />
                  )}

                  {index === 1 ? (

                    <span
                      style={{
                        color:
                          MYSAN_BLUE,
                      }}
                    >
                      {line}
                    </span>

                  ) : (

                    line

                  )}

                </span>

              )
            )}
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
          REFERENZEN
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
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
            pb-14
            pt-6
            md:px-12
            md:pb-18
            md:pt-8
            lg:px-16
          "
        >


          {/* =================================================
              ÜBERSCHRIFT
          ================================================= */}

          <div className="mb-8">

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
              "
              style={{
                color:
                  MYSAN_BLUE,
              }}
            >
              {projectsEyebrow}
            </p>


            <h2
              className="
                mt-2
                text-3xl
                font-light
                tracking-tight
                md:text-4xl
              "
            >
              {projectsTitle}
            </h2>

          </div>


          {/* =================================================
              FEHLER
          ================================================= */}

          {referencesError && (

            <div
              className="
                mb-6
                rounded-lg
                bg-red-50
                p-4
                text-sm
                text-red-700
              "
            >
              Die Referenzen konnten nicht geladen werden.
            </div>

          )}


          {/* =================================================
              KEINE REFERENZEN
          ================================================= */}

          {!referencesError &&
            references.length === 0 && (

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


          {/* =================================================
              REFERENZEN GRID
          ================================================= */}

          {references.length > 0 && (

            <div
              className="
                grid
                gap-x-6
                gap-y-10
                md:grid-cols-2
                lg:grid-cols-3
              "
            >

              {references.map(
                (reference) => {

                  const image =
                    getReferenceImage(
                      reference.id
                    )

                  return (

                    <Link
                      key={
                        reference.id
                      }
                      href={`/referenzen/${reference.slug}`}
                      className="
                        group
                        block
                      "
                    >


                      {/* =====================================
                          BILD
                      ===================================== */}

                      <div
                        className="
                          relative
                          aspect-[4/3]
                          overflow-hidden
                          bg-[#F4F7FA]
                        "
                      >

                        {image ? (

                          <img
                            src={image}
                            alt={
                              reference.title
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
                              text-sm
                              text-neutral-400
                            "
                          >
                            Kein Bild vorhanden
                          </div>

                        )}

                      </div>


                      {/* =====================================
                          TEXT
                      ===================================== */}

                      <div
                        className="
                          relative
                          border-b
                          border-neutral-200
                          pb-5
                          pt-4
                        "
                      >

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


                          {/* ICON */}

                          <div
                            className="
                              mb-3
                              flex
                              h-7
                              w-7
                              items-center
                            "
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

                              <path
                                d="
                                  M12 2.5
                                  C12 2.5 5.5 10.1 5.5 15.2
                                  C5.5 19.2 8.4 22 12 22
                                  S18.5 19.2 18.5 15.2
                                  C18.5 10.1 12 2.5 12 2.5Z
                                "
                              />

                            </svg>

                          </div>


                          {/* TITEL */}

                          <h3
                            className="
                              text-xl
                              font-light
                              transition-colors
                              duration-200
                              group-hover:text-[#1dabff]
                            "
                          >
                            {reference.title}
                          </h3>


                          {/* ORT / JAHR */}

                          {(reference.location ||
                            reference.year) && (

                            <p
                              className="
                                mt-1.5
                                text-sm
                                text-neutral-500
                              "
                            >

                              {reference.location}

                              {reference.location &&
                                reference.year &&
                                ' · '}

                              {reference.year}

                            </p>

                          )}

                        </div>

                      </div>

                    </Link>

                  )

                }
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