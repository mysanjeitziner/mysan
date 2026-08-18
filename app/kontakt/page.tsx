import Link from 'next/link'

import {
  getSiteContent,
  getContent,
  getStorageUrl,
} from '@/lib/site-content'

import { createClient } from '@/lib/supabase/server'

import ContactForm from '@/components/contact-form'
import ConsentGatedMap from '@/components/consent-gated-map'

const MYSAN_BLUE = '#1dabff'

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps?q=Krydenweg+86,+3900+Gamsen,+Schweiz&output=embed'

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
}

/* =========================================================
   PAGE
========================================================= */

export default async function KontaktPage() {

  const supabase = await createClient()

  /* =========================================================
     WEBSITE CONTENT
  ========================================================= */

  const contents =
    await getSiteContent('kontakt')


  /* =========================================================
     KONTAKT-BILD AUS PAGE_MEDIA
     
     media_type = "contact"
     
     Das Bild wird im Admin unter:
     Website-Inhalte → Kontakt → Bilder
     hochgeladen.
  ========================================================= */

  const {
    data: contactMediaData,
    error: contactMediaError,
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
    .eq('page', 'kontakt')
    .eq('media_type', 'contact')
    .eq('visible', true)
    .maybeSingle()

  const contactMedia =
    contactMediaData as PageMedia | null


  /* =========================================================
     KONTAKT-BILD URL
     
     Priorität:
     
     1. public_url
     2. storage_path über getStorageUrl()
     3. /kontakt.jpg als Fallback
  ========================================================= */

  let contactImage = '/kontakt.jpg'

  if (contactMedia) {

    if (contactMedia.public_url) {

      contactImage =
        contactMedia.public_url

    } else if (contactMedia.storage_path) {

      contactImage =
        getStorageUrl(
          contactMedia.storage_path
        ) || '/kontakt.jpg'

    }

  }


  /* =========================================================
     ALT-TEXT
  ========================================================= */

  const contactImageAlt =
    contactMedia?.alt_text ||
    'mySan Jeitziner GmbH'


  /* =========================================================
     HERO
  ========================================================= */

  const heroEyebrow = getContent(
    contents,
    'hero',
    'eyebrow',
    'mySan Jeitziner'
  )

  const heroTitle = getContent(
    contents,
    'hero',
    'title',
    'Kontaktieren'
  )

  const heroTitleHighlight = getContent(
    contents,
    'hero',
    'title_highlight',
    'Sie uns!'
  )

  const heroDescription = getContent(
    contents,
    'hero',
    'description',
    'Gerne stehen wir Ihnen mit Rat & Tat zur Verfügung.'
  )


  /* =========================================================
     FORMULAR
  ========================================================= */

  const formEyebrow = getContent(
    contents,
    'form',
    'eyebrow',
    'Schreiben Sie uns'
  )

  const formTitle = getContent(
    contents,
    'form',
    'title',
    'Wir sind für Sie da.'
  )


  /* =========================================================
     KONTAKT INFORMATIONEN
  ========================================================= */

  const contactEyebrow = getContent(
    contents,
    'contact',
    'eyebrow',
    'Wo Sie uns finden'
  )

  const contactCompany = getContent(
    contents,
    'contact',
    'company',
    'mySan Jeitziner GmbH'
  )

  const addressLabel = getContent(
    contents,
    'contact',
    'address_label',
    'Adresse'
  )

  const address = getContent(
    contents,
    'contact',
    'address',
    'Krydenweg 86\n3900 Gamsen'
  )

  const phoneLabel = getContent(
    contents,
    'contact',
    'phone_label',
    'Telefon'
  )

  const phone = getContent(
    contents,
    'contact',
    'phone',
    '079 590 09 60'
  )

  const officeLabel = getContent(
    contents,
    'contact',
    'office_label',
    'Büro'
  )

  const office = getContent(
    contents,
    'contact',
    'office',
    '079 217 25 71'
  )

  const emailLabel = getContent(
    contents,
    'contact',
    'email_label',
    'E-Mail'
  )

  const email = getContent(
    contents,
    'contact',
    'email',
    'info@mysan.ch'
  )


  /* =========================================================
     MAP
  ========================================================= */

  const mapTitle = getContent(
    contents,
    'map',
    'title',
    'mySan Jeitziner GmbH Standort'
  )

  const routeText = getContent(
    contents,
    'map',
    'route',
    'Route zu uns'
  )


  /* =========================================================
     CTA
  ========================================================= */

  const ctaEyebrow = getContent(
    contents,
    'cta',
    'eyebrow',
    'mySan Jeitziner'
  )

  const ctaTitle = getContent(
    contents,
    'cta',
    'title',
    'Persönlich. Kompetent. Zuverlässig.'
  )

  const ctaButton = getContent(
    contents,
    'cta',
    'button',
    'Unsere Referenzen'
  )


  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="bg-white text-neutral-900">


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">

        {/* Blauer linker Rand */}

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
            HINTERGRUNDBILD
        =================================================== */}

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
                src={contactImage}
                alt={contactImageAlt}
                aria-hidden="true"
                className="
                  h-auto
                  w-full
                  object-cover
                  object-center
                  opacity-[0.18]
                "
                style={{
                  opacity:
                    contactMedia?.opacity != null
                      ? contactMedia.opacity
                      : 0.18,
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
            pb-10
            pt-28
            md:px-12
            md:pb-12
            md:pt-32
            lg:px-16
          "
        >

          <div className="max-w-3xl">


            {/* Eyebrow */}

            {heroEyebrow && (

              <>

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

                <p
                  className="
                    text-xs
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

              </>

            )}


            {/* Titel */}

            {heroTitle && (

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

                {heroTitle}

                {heroTitleHighlight && (

                  <>

                    <br />

                    <span
                      style={{
                        color:
                          MYSAN_BLUE,
                      }}
                    >
                      {heroTitleHighlight}
                    </span>

                  </>

                )}

              </h1>

            )}


            {/* Beschreibung */}

            {heroDescription && (

              <p
                className="
                  mt-6
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
          KONTAKT
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-white
        "
      >

        {/* Blauer linker Rand */}

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
            py-10
            md:px-12
            md:py-14
            lg:px-16
          "
        >

          <div
            className="
              grid
              gap-12
              lg:grid-cols-[1.15fr_0.85fr]
            "
          >


            {/* =================================================
                FORMULAR
            ================================================= */}

            <div>

              {formEyebrow && (

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
                  {formEyebrow}
                </p>

              )}


              {formTitle && (

                <h2
                  className="
                    mt-3
                    text-4xl
                    font-light
                    tracking-tight
                    md:text-5xl
                  "
                >
                  {formTitle}
                </h2>

              )}


              <div className="mt-8">

                <ContactForm />

              </div>

            </div>


            {/* =================================================
                KONTAKTINFO
            ================================================= */}

            <div className="lg:pt-14">

              {contactEyebrow && (

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
                  {contactEyebrow}
                </p>

              )}


              {contactCompany && (

                <h2
                  className="
                    mt-3
                    text-3xl
                    font-light
                    tracking-tight
                    md:text-4xl
                  "
                >
                  {contactCompany}
                </h2>

              )}


              <div
                className="
                  mt-7
                  space-y-6
                  text-sm
                  leading-6
                  text-neutral-600
                "
              >


                {/* ADRESSE */}

                {addressLabel && address && (

                  <div>

                    <p
                      className="
                        font-medium
                        text-neutral-900
                      "
                    >
                      {addressLabel}
                    </p>

                    <p
                      className="
                        mt-1
                        whitespace-pre-line
                      "
                    >
                      {address}
                    </p>

                  </div>

                )}


                {/* TELEFON */}

                {phoneLabel && phone && (

                  <div>

                    <p
                      className="
                        font-medium
                        text-neutral-900
                      "
                    >
                      {phoneLabel}
                    </p>

                    <a
                      href="tel:+41795900960"
                      className="
                        mt-1
                        block
                        transition
                        hover:text-[#1dabff]
                      "
                    >
                      {phone}
                    </a>

                  </div>

                )}


                {/* BÜRO */}

                {officeLabel && office && (

                  <div>

                    <p
                      className="
                        font-medium
                        text-neutral-900
                      "
                    >
                      {officeLabel}
                    </p>

                    <a
                      href="tel:+41792172571"
                      className="
                        mt-1
                        block
                        transition
                        hover:text-[#1dabff]
                      "
                    >
                      {office}
                    </a>

                  </div>

                )}


                {/* E-MAIL */}

                {emailLabel && email && (

                  <div>

                    <p
                      className="
                        font-medium
                        text-neutral-900
                      "
                    >
                      {emailLabel}
                    </p>

                    <a
                      href={`mailto:${email}`}
                      className="
                        mt-1
                        block
                        transition
                        hover:text-[#1dabff]
                      "
                    >
                      {email}
                    </a>

                  </div>

                )}

              </div>


              {/* =================================================
                  MAP
              ================================================= */}

              <div
                className="
                  mt-10
                  overflow-hidden
                  rounded-xl
                  border
                  border-neutral-200
                  bg-[#F4F7FA]
                  shadow-sm
                "
              >

                <ConsentGatedMap
                  src={GOOGLE_MAPS_URL}
                  title={
                    mapTitle ||
                    'mySan Jeitziner GmbH Standort'
                  }
                />

              </div>


              {/* =================================================
                  ROUTE
              ================================================= */}

              {routeText && (

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Krydenweg+86%2C+3900+Gamsen%2C+Schweiz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-4
                    inline-flex
                    items-center
                    text-sm
                    font-semibold
                  "
                  style={{
                    color:
                      MYSAN_BLUE,
                  }}
                >

                  {routeText}

                  <span
                    className="
                      ml-2
                      text-lg
                    "
                  >
                    →
                  </span>

                </a>

              )}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
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
            py-10
            md:px-12
            md:py-12
            lg:px-16
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            {/* LINKER BEREICH */}

            <div>

              {ctaEyebrow && (

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-white/60
                  "
                >
                  {ctaEyebrow}
                </p>

              )}


              {ctaTitle && (

                <h2
                  className="
                    mt-2
                    text-3xl
                    font-light
                    text-white
                    md:text-4xl
                  "
                >
                  {ctaTitle}
                </h2>

              )}

            </div>


            {/* BUTTON */}

            {ctaButton && (

              <Link
                href="/referenzen"
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

                {ctaButton}

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