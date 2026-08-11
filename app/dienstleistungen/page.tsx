
import Link from 'next/link'

const MYSAN_BLUE = '#1dabff'

export default function DienstleistungenPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-white">

        {/* Blauer linker Rand */}

        <div
          className="absolute left-0 top-0 z-30 h-full w-2"
          style={{
            backgroundColor: MYSAN_BLUE,
          }}
        />

        {/* Hintergrund */}

        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />

        {/* Wasserbild */}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10">

          <div className="mx-auto max-w-7xl px-8 md:px-12 lg:px-16">

            <div
              className="
                relative
                overflow-hidden
                [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]
                [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]
              "
            >

              <img
                src="/wasser.jpg"
                alt=""
                aria-hidden="true"
                className="
                  h-auto
                  w-full
                  object-cover
                  object-center
                  opacity-[0.18]
                "
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

        {/* Hero Inhalt */}

        <div className="relative z-20 mx-auto max-w-7xl px-8 pb-12 pt-28 md:px-12 md:pb-16 md:pt-32 lg:px-16">

          <div className="max-w-3xl">

            {/* Kleiner blauer Strich */}

            <div
              className="mb-5 h-1 w-14"
              style={{
                backgroundColor: MYSAN_BLUE,
              }}
            />

            {/* Eyebrow */}

            <p
              className="text-sm font-semibold uppercase tracking-[0.25em]"
              style={{
                color: MYSAN_BLUE,
              }}
            >
              mySan Jeitziner
            </p>

            {/* Titel */}

            <h1 className="mt-4 text-5xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Unsere
              <br />
              <span
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Dienstleistungen
              </span>
            </h1>

            {/* Beschreibung */}

            <p className="mt-5 max-w-2xl text-lg font-light leading-7 text-neutral-600 md:text-xl">
              Ob Reparatur, Neuinstallation oder Umbau:
              Wir stehen Ihnen mit Erfahrung und Fachwissen zur Seite.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          DIENSTLEISTUNGEN
      ===================================================== */}

      <section className="relative overflow-hidden">

        {/* Blauer linker Rand */}

        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{
            backgroundColor: MYSAN_BLUE,
          }}
        />

        <div className="mx-auto max-w-7xl px-8 py-12 md:px-12 md:py-16 lg:px-16">

          {/* Überschrift */}

          <div className="max-w-3xl">

            <p className="max-w-xl text-base leading-7 text-neutral-500">
              Fachgerechte Lösungen rund um Sanitär,
              Wasser und Ihr Zuhause.
            </p>

          </div>

          {/* =================================================
              DIENSTLEISTUNGEN
          ================================================= */}

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <ServiceCard
              title="Servicearbeiten"
              text="Zuverlässiger Service und fachgerechte Reparaturen für Ihre Sanitäranlagen."
            />

            <ServiceCard
              title="Neuinstallationen"
              text="Moderne und fachgerechte Sanitärinstallationen für Neubauten und neue Anlagen."
            />

            <ServiceCard
              title="Umbauten"
              text="Wir passen bestehende Sanitäranlagen an und realisieren individuelle Umbauten."
            />

            <ServiceCard
              title="Alles rund ums Bad"
              text="Von der Planung bis zur Umsetzung: Ihr Badezimmer aus einer Hand."
            />

            <ServiceCard
              title="Wasserversorgung"
              text="Fachgerechte Lösungen für eine zuverlässige Wasserversorgung."
            />

          </div>

          {/* =================================================
              ZITAT
          ================================================= */}

          <div className="mt-10 flex max-w-4xl flex-col gap-6 border-l-2 pl-6 md:mt-12 md:flex-row md:items-center md:gap-8"
            style={{
              borderColor: MYSAN_BLUE,
            }}
          >

            {/* Leonardo da Vinci Bild */}

            <div className="shrink-0">

              <img
                src="/davinci.jpg"
                alt="Leonardo da Vinci"
                className="h-28 w-28 object-cover grayscale md:h-32 md:w-32"
              />

            </div>

            {/* Zitat */}

            <div>

              <p className="text-xl font-light italic leading-8 text-neutral-700 md:text-2xl">
                «Wasser ist die treibende Kraft der Natur»
              </p>

              <p
                className="mt-3 text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Leonardo da Vinci
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          KONTAKT
      ===================================================== */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: MYSAN_BLUE,
        }}
      >

        <div className="mx-auto max-w-7xl px-8 py-12 md:px-12 md:py-14 lg:px-16">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                Kontakt
              </p>

              <h2 className="mt-2 text-3xl font-light text-white md:text-4xl">
                Sie haben ein Projekt?
              </h2>

              <p className="mt-2 text-sm text-white/75">
                Wir freuen uns über Ihre Kontaktaufnahme.
              </p>

            </div>

            <Link
              href="/kontakt"
              className="inline-flex w-fit items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
            >
              Kontakt aufnehmen

              <span className="ml-3 text-lg">
                →
              </span>
            </Link>

          </div>

        </div>

      </section>

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
  title: string
  text: string
}) {
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

      {/* Blauer linker Strich */}

      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{
          backgroundColor: MYSAN_BLUE,
        }}
      />

      {/* Tropfen */}

      <div
        className="flex h-10 w-10 items-center justify-center"
        style={{
          color: MYSAN_BLUE,
        }}
      >

        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2.5C12 2.5 5.5 10.1 5.5 15.2C5.5 19.2 8.4 22 12 22s6.5-2.8 6.5-6.8C18.5 10.1 12 2.5 12 2.5Z" />
        </svg>

      </div>

      {/* Titel */}

      <h3 className="mt-6 text-2xl font-light">
        {title}
      </h3>

      {/* Beschreibung */}

      <p className="mt-3 text-sm leading-6 text-neutral-600">
        {text}
      </p>

    </div>
  )
}

