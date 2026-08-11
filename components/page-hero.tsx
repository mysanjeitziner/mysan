
import type { ReactNode } from 'react'

const MYSAN_BLUE = '#1dabff'

type PageHeroProps = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  image?: string
  imageOpacity?: number
  children?: ReactNode
}

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageOpacity = 0.18,
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white">

      {/* =====================================================
          LINKER BLAUER STREIFEN
      ===================================================== */}

      <div
        className="absolute left-0 top-0 z-30 h-full w-2"
        style={{
          backgroundColor: MYSAN_BLUE,
        }}
      />


      {/* =====================================================
          AUTO / HINTERGRUNDBILD
      ===================================================== */}

      {image && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10">

          <div className="mx-auto max-w-7xl px-8 md:px-12 lg:px-16">

            <div
              className="
                relative
                overflow-hidden
                [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_88%,transparent_100%)]
                [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_88%,transparent_100%)]
              "
            >

              <img
                src={image}
                alt=""
                aria-hidden="true"
                className="
                  h-auto
                  w-full
                  object-contain
                  object-left-top
                "
                style={{
                  opacity: imageOpacity,
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
                  h-28
                  bg-gradient-to-t
                  from-white
                  via-white/70
                  to-transparent
                "
              />

            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          HERO TEXT
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


          {/* =================================================
              BLAUER STRICH
          ================================================= */}

          <div
            className="mb-5 h-1 w-16"
            style={{
              backgroundColor: MYSAN_BLUE,
            }}
          />


          {/* =================================================
              EYEBROW
          ================================================= */}

          {eyebrow && (
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
          )}


          {/* =================================================
              TITEL
          ================================================= */}

          <h1
            className="
              mt-4
              text-5xl
              font-light
              leading-[1.05]
              tracking-tight
              text-neutral-900
              md:text-7xl
              lg:text-8xl
            "
          >
            {title}
          </h1>


          {/* =================================================
              BESCHREIBUNG
          ================================================= */}

          {description && (
            <p
              className="
                mt-6
                max-w-xl
                text-xl
                font-light
                leading-8
                text-neutral-600
                md:text-2xl
              "
            >
              {description}
            </p>
          )}


          {/* =================================================
              BUTTONS
          ================================================= */}

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

