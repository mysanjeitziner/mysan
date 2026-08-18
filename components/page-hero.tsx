import React from 'react'

const MYSAN_BLUE = '#1dabff'

type PageHeroProps = {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode

  image?: string | null

  imageOpacity?: number

  imageAlt?: string

  children?: React.ReactNode
}


export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageOpacity = 0.18,
  imageAlt = '',
  children,
}: PageHeroProps) {

  return (
    <section className="relative overflow-hidden bg-white">

      {/* =====================================================
          BLAUER RAND
      ===================================================== */}

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
          backgroundColor: MYSAN_BLUE,
        }}
      />


      {/* =====================================================
          HERO BILD
      ===================================================== */}

      {image && (

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
                src={image}
                alt={imageAlt}
                aria-hidden={!imageAlt}
                className="
                  h-auto
                  min-h-[360px]
                  w-full
                  object-cover
                  object-center
                "
                style={{
                  opacity: imageOpacity,
                }}
              />

              {/* OBEN */}

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

              {/* UNTEN */}

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


      {/* =====================================================
          HERO INHALT
      ===================================================== */}

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
          md:pt-36
          lg:px-16
        "
      >

        <div className="max-w-3xl">

          {eyebrow && (

            <>

              <div
                className="
                  mb-5
                  h-1
                  w-16
                "
                style={{
                  backgroundColor: MYSAN_BLUE,
                }}
              />

              <p
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                "
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                {eyebrow}
              </p>

            </>

          )}


          {/* TITEL */}

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
            {title}
          </h1>


          {/* BESCHREIBUNG */}

          {description && (

            <div
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
              {description}
            </div>

          )}


          {/* BUTTONS */}

          {children && (

            <div className="mt-7">
              {children}
            </div>

          )}

        </div>

      </div>

    </section>
  )
}