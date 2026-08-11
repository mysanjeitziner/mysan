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
    <section className="relative min-h-[calc(100vh-6rem)] overflow-hidden bg-white">

      {/* Hintergrund */}

      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#F4F7FA]" />

      {/* Linker Streifen */}

      <div
        className="absolute left-0 top-0 z-30 h-full w-2"
        style={{
          backgroundColor: MYSAN_BLUE,
        }}
      />

      {/* Auto */}

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
                className="h-auto w-full object-contain object-left-top"
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
                  h-32
                  bg-gradient-to-b
                  from-white
                  via-white/40
                  to-transparent
                "
              />

              {/* Unterer Übergang */}

              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  h-48
                  bg-gradient-to-t
                  from-white
                  via-white/50
                  to-transparent
                "
              />

            </div>

          </div>

        </div>
      )}

      {/* Text */}

      <div className="relative z-20 mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-start px-8 pb-[35vh] pt-28 md:px-12 md:pb-[32vh] md:pt-36 lg:px-16">

        <div className="max-w-3xl">

          {/* Strich */}

          <div
            className="mb-6 h-1 w-16"
            style={{
              backgroundColor: MYSAN_BLUE,
            }}
          />

          {/* Eyebrow */}

          {eyebrow && (
            <p
              className="text-sm font-semibold uppercase tracking-[0.25em]"
              style={{
                color: MYSAN_BLUE,
              }}
            >
              {eyebrow}
            </p>
          )}

          {/* Titel */}

          <h1 className="mt-5 text-5xl font-light leading-[1.05] tracking-tight text-neutral-900 md:text-7xl lg:text-8xl">
            {title}
          </h1>

          {/* Beschreibung */}

          {description && (
            <p className="mt-8 max-w-xl text-xl font-light leading-8 text-neutral-600 md:text-2xl">
              {description}
            </p>
          )}

          {/* Buttons */}

          {children && (
            <div className="mt-10">
              {children}
            </div>
          )}

        </div>

      </div>

    </section>
  )
}