import Link from 'next/link'

import {
  getStorageUrl,
} from '@/lib/site-content'

import { createClient } from '@/lib/supabase/server'

const MYSAN_BLUE = '#1dabff'

/* =========================================================
   TYPES
========================================================= */

type SiteContent = {
  section: string
  content_key: string
  content: string
  visible: boolean
  sort_order?: number
}

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
   SEITE
========================================================= */

export default async function DienstleistungenPage() {

  const supabase = await createClient()


  /* =========================================================
     WEBSITE-INHALTE
  ========================================================= */

  const {
    data: contentData,
    error: contentError,
  } = await supabase
    .from('site_content')
    .select(`
      section,
      content_key,
      content,
      visible,
      sort_order
    `)
    .eq('page', 'dienstleistungen')
    .order('sort_order', {
      ascending: true,
    })


  const contents =
    (contentData as SiteContent[] | null) || []


  if (contentError) {

    console.error(
      'DIENSTLEISTUNGEN CONTENT ERROR:',
      contentError
    )

  }


  /* =========================================================
     PAGE MEDIA
     
     ALLE Medien der Seite laden.
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
      visible,
      created_at,
      updated_at
    `)
    .eq('page', 'dienstleistungen')
    .order('created_at', {
      ascending: false,
    })


  const media =
    (mediaData as PageMedia[] | null) || []


  if (mediaError) {

    console.error(
      'DIENSTLEISTUNGEN MEDIA ERROR:',
      mediaError
    )

  }


  /* =========================================================
     HERO-BILD
     
     Das HERO-Bild wird weiterhin separat gesucht.
     
     media_type = hero
  ========================================================= */

  const heroMedia =
    media.find(
      (item) =>
        item.media_type === 'hero' &&
        item.visible !== false
    ) || null


  const heroImage =
    heroMedia?.public_url ||
    (
      heroMedia?.storage_path
        ? getStorageUrl(
            heroMedia.storage_path
          )
        : null
    ) ||
    '/wasser.jpg'


  const heroImageAlt =
    heroMedia?.alt_text ||
    'Sanitär und Dienstleistungen von mySan Jeitziner'


  const heroImageOpacity =
    heroMedia?.opacity ?? 0.18


  /* =========================================================
     DIENSTLEISTUNGS-BILD
     
     Dieses Bild ist NICHT das Hero-Bild.
     
     Gesucht wird:
     
     1. media_type = services
     
     ODER
     
     2. storage_path enthält
        dienstleistungen-services
     
     ODER
     
     3. public_url enthält
        dienstleistungen-services
  ========================================================= */

  const servicesMedia =
    media.find(
      (item) =>
        item.visible !== false &&
        (
          item.media_type === 'services' ||
          item.storage_path
            ?.toLowerCase()
            .includes(
              'dienstleistungen-services'
            ) ||
          item.public_url
            ?.toLowerCase()
            .includes(
              'dienstleistungen-services'
            )
        )
    ) || null


  /* =========================================================
     SERVICES-BILD URL
  ========================================================= */

  const servicesImage =
    servicesMedia?.public_url ||
    (
      servicesMedia?.storage_path
        ? getStorageUrl(
            servicesMedia.storage_path
          )
        : null
    )


  /* =========================================================
     SERVICES-BILD ALT
  ========================================================= */

  const servicesImageAlt =
    servicesMedia?.alt_text ||
    'Dienstleistungen von mySan Jeitziner'


  /* =========================================================
     SERVICES-BILD OPACITY
  ========================================================= */

  const servicesImageOpacity =
    servicesMedia?.opacity ?? 1


  /* =========================================================
     DEBUG
  ========================================================= */

  console.log(
    '========================================'
  )

  console.log(
    'DIENSTLEISTUNGEN MEDIA'
  )

  console.log(
    'Alle Medien:',
    media
  )

  console.log(
    'Hero Media:',
    heroMedia
  )

  console.log(
    'Hero Image:',
    heroImage
  )

  console.log(
    'Services Media:',
    servicesMedia
  )

  console.log(
    'Services Image:',
    servicesImage
  )

  console.log(
    '========================================'
  )


  /* =========================================================
     CONTENT HELPER
  ========================================================= */

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


    /* Kein DB-Eintrag */

    if (!item) {
      return fallback
    }


    /* Im Admin deaktiviert */

    if (item.visible === false) {
      return null
    }


    return item.content
  }


  /* =========================================================
     HERO CONTENT
  ========================================================= */

  const heroEyebrow =
    getContent(
      'hero',
      'eyebrow',
      'mySan Jeitziner'
    )


  const heroTitle =
    getContent(
      'hero',
      'title',
      'Unsere'
    )


  const heroTitleHighlight =
    getContent(
      'hero',
      'title_highlight',
      'Dienstleistungen'
    )


  const heroDescription =
    getContent(
      'hero',
      'description',
      'Ob Reparatur, Neuinstallation oder Umbau: Wir stehen Ihnen mit Erfahrung und Fachwissen zur Seite.'
    )


  /* =========================================================
     INTRO
  ========================================================= */

  const introDescription =
    getContent(
      'intro',
      'description',
      'Fachgerechte Lösungen rund um Sanitär, Wasser und Ihr Zuhause.'
    )


  /* =========================================================
     DIENSTLEISTUNGEN
  ========================================================= */

  const services = [

    {
      key: 'servicearbeiten',

      title:
        getContent(
          'service',
          'servicearbeiten_title',
          'Servicearbeiten'
        ),

      text:
        getContent(
          'service',
          'servicearbeiten_text',
          'Zuverlässiger Service und fachgerechte Reparaturen für Ihre Sanitäranlagen.'
        ),
    },

    {
      key: 'neuinstallationen',

      title:
        getContent(
          'service',
          'neuinstallationen_title',
          'Neuinstallationen'
        ),

      text:
        getContent(
          'service',
          'neuinstallationen_text',
          'Moderne und fachgerechte Sanitärinstallationen für Neubauten und neue Anlagen.'
        ),
    },

    {
      key: 'umbauten',

      title:
        getContent(
          'service',
          'umbauten_title',
          'Umbauten'
        ),

      text:
        getContent(
          'service',
          'umbauten_text',
          'Wir passen bestehende Sanitäranlagen an und realisieren individuelle Umbauten.'
        ),
    },

    {
      key: 'bad',

      title:
        getContent(
          'service',
          'bad_title',
          'Alles rund ums Bad'
        ),

      text:
        getContent(
          'service',
          'bad_text',
          'Von der Planung bis zur Umsetzung: Ihr Badezimmer aus einer Hand.'
        ),
    },

    {
      key: 'wasserversorgung',

      title:
        getContent(
          'service',
          'wasserversorgung_title',
          'Wasserversorgung'
        ),

      text:
        getContent(
          'service',
          'wasserversorgung_text',
          'Fachgerechte Lösungen für eine zuverlässige Wasserversorgung.'
        ),
    },

  ]


  /* =========================================================
     ZITAT
  ========================================================= */

  const quoteText =
    getContent(
      'quote',
      'quote',
      '«Wasser ist die treibende Kraft der Natur»'
    )


  const quoteAuthor =
    getContent(
      'quote',
      'author',
      'Leonardo da Vinci'
    )


  /* =========================================================
     KONTAKT
  ========================================================= */

  const contactEyebrow =
    getContent(
      'contact',
      'eyebrow',
      'Kontakt'
    )


  const contactTitle =
    getContent(
      'contact',
      'title',
      'Sie haben ein Projekt?'
    )


  const contactText =
    getContent(
      'contact',
      'text',
      'Wir freuen uns über Ihre Kontaktaufnahme.'
    )


  const contactButton =
    getContent(
      'contact',
      'button',
      'Kontakt aufnehmen'
    )


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <main className="min-h-screen bg-white text-neutral-900">


      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-white
        "
      >

        {/* ===================================================
            BLAUER LINKER RAND
        =================================================== */}

        <div
          className="
            absolute
            left-0
            top-0
            z-30
            h-full
            w-2
          "
          style={{
            backgroundColor:
              MYSAN_BLUE,
          }}
        />


        {/* ===================================================
            HINTERGRUND
        =================================================== */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-white
            via-white/90
            to-white
          "
        />


        {/* ===================================================
            HERO-BILD AUS SUPABASE
        =================================================== */}

        {heroImage && (

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              z-10
            "
          >

            <div
              className="
                mx-auto
                max-w-7xl
                px-8
                md:px-12
                lg:px-16
              "
            >

              <div
                className="
                  relative
                  overflow-hidden
                  [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]
                  [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]
                "
              >

                <img
                  src={heroImage}
                  alt={heroImageAlt}
                  className="
                    h-auto
                    w-full
                    object-cover
                    object-center
                  "
                  style={{
                    opacity:
                      heroImageOpacity,
                  }}
                />


                {/* Oberer Übergang */}

                <div
                  className="
                    absolute
                    inset-x-0
                    top-0
                    h-24
                    bg-gradient-to-b
                    from-white
                    to-transparent
                  "
                />


                {/* Unterer Übergang */}

                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    h-32
                    bg-gradient-to-t
                    from-white
                    via-white/80
                    to-transparent
                  "
                />

              </div>

            </div>

          </div>

        )}


        {/* ===================================================
            HERO INHALT
        =================================================== */}

        <div
          className="
            relative
            z-20
            mx-auto
            max-w-7xl
            px-8
            pb-12
            pt-28
            md:px-12
            md:pb-16
            md:pt-32
            lg:px-16
          "
        >

          <div className="max-w-3xl">


            {/* =================================================
                BLAUER STRICH
            ================================================= */}

            {(heroEyebrow ||
              heroTitle ||
              heroTitleHighlight ||
              heroDescription) && (

              <div
                className="
                  mb-5
                  h-1
                  w-14
                "
                style={{
                  backgroundColor:
                    MYSAN_BLUE,
                }}
              />

            )}


            {/* =================================================
                EYEBROW
            ================================================= */}

            {heroEyebrow && (

              <p
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                "
                style={{
                  color:
                    MYSAN_BLUE,
                }}
              >
                {heroEyebrow}
              </p>

            )}


            {/* =================================================
                TITEL
            ================================================= */}

            {(heroTitle ||
              heroTitleHighlight) && (

              <h1
                className="
                  mt-4
                  text-5xl
                  font-light
                  leading-[1.05]
                  tracking-tight
                  md:text-6xl
                  lg:text-7xl
                "
              >

                {heroTitle && (
                  <>
                    {heroTitle}

                    {heroTitleHighlight && (
                      <br />
                    )}
                  </>
                )}


                {heroTitleHighlight && (

                  <span
                    style={{
                      color:
                        MYSAN_BLUE,
                    }}
                  >
                    {heroTitleHighlight}
                  </span>

                )}

              </h1>

            )}


            {/* =================================================
                BESCHREIBUNG
            ================================================= */}

            {heroDescription && (

              <p
                className="
                  mt-5
                  max-w-2xl
                  text-lg
                  font-light
                  leading-7
                  text-neutral-600
                  md:text-xl
                "
              >
                {heroDescription}
              </p>

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          DIENSTLEISTUNGEN
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
        "
      >

        {/* ===================================================
            BLAUER LINKER RAND
        =================================================== */}

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
            py-12
            md:px-12
            md:py-16
            lg:px-16
          "
        >


          {/* =================================================
              INTRO
          ================================================= */}

          {introDescription && (

            <div className="max-w-3xl">

              <p
                className="
                  max-w-xl
                  text-base
                  leading-7
                  text-neutral-500
                "
              >
                {introDescription}
              </p>

            </div>

          )}


          {/* =================================================
              SERVICE CARDS
          ================================================= */}

          {services.some(
            (service) =>
              service.title ||
              service.text
          ) && (

            <div
              className="
                mt-8
                grid
                gap-4
                md:grid-cols-2
                lg:grid-cols-3
              "
            >

              {services.map(
                (service) => {

                  if (
                    !service.title &&
                    !service.text
                  ) {
                    return null
                  }

                  return (

                    <ServiceCard
                      key={
                        service.key
                      }
                      title={
                        service.title
                      }
                      text={
                        service.text
                      }
                    />

                  )

                }
              )}

            </div>

          )}


          {/* =================================================
              ZITAT MIT DB-BILD
          ================================================= */}

          {(quoteText ||
            quoteAuthor ||
            servicesImage) && (

            <div
              className="
                mt-10
                flex
                max-w-4xl
                flex-col
                gap-6
                border-l-2
                pl-6
                md:mt-12
                md:flex-row
                md:items-center
                md:gap-8
              "
              style={{
                borderColor:
                  MYSAN_BLUE,
              }}
            >


              {/* =================================================
                  DIENSTLEISTUNGS-BILD AUS SUPABASE
                  
                  NICHT das Hero-Bild.
                  
                  NICHT /davinci.jpg.
              ================================================= */}

              {servicesImage && (

                <div className="shrink-0">

                  <img
                    src={servicesImage}
                    alt={servicesImageAlt}
                    className="
                      h-28
                      w-28
                      object-cover
                      grayscale
                      md:h-32
                      md:w-32
                    "
                    style={{
                      opacity:
                        servicesImageOpacity,
                    }}
                  />

                </div>

              )}


              {/* =================================================
                  ZITAT
              ================================================= */}

              <div>

                {quoteText && (

                  <p
                    className="
                      text-xl
                      font-light
                      italic
                      leading-8
                      text-neutral-700
                      md:text-2xl
                    "
                  >
                    {quoteText}
                  </p>

                )}


                {quoteAuthor && (

                  <p
                    className="
                      mt-3
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
                    {quoteAuthor}
                  </p>

                )}

              </div>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          KONTAKT CTA
      ===================================================== */}

      {(contactEyebrow ||
        contactTitle ||
        contactText ||
        contactButton) && (

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


              {/* =================================================
                  LINKER BEREICH
              ================================================= */}

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


              {/* =================================================
                  BUTTON
              ================================================= */}

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

                  <span className="ml-3 text-lg">
                    →
                  </span>

                </Link>

              )}

            </div>

          </div>

        </section>

      )}

    </main>

  )
}


/* =========================================================
   SERVICE CARD
========================================================= */

function ServiceCard({
  title,
  text,
}: {
  title: string | null
  text: string | null
}) {

  if (!title && !text) {
    return null
  }

  return (

    <div
      className="
        relative
        overflow-hidden
        border
        border-neutral-200
        bg-white
        p-6
        md:p-7
      "
    >

      {/* ===================================================
          BLAUER RAND
      =================================================== */}

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


      {/* ===================================================
          ICON
      =================================================== */}

      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
        "
        style={{
          color:
            MYSAN_BLUE,
        }}
      >

        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
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


      {/* ===================================================
          TITEL
      =================================================== */}

      {title && (

        <h3
          className="
            mt-6
            text-2xl
            font-light
          "
        >
          {title}
        </h3>

      )}


      {/* ===================================================
          BESCHREIBUNG
      =================================================== */}

      {text && (

        <p
          className="
            mt-3
            text-sm
            leading-6
            text-neutral-600
          "
        >
          {text}
        </p>

      )}

    </div>

  )
}