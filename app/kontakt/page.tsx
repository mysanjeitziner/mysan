import Link from 'next/link'
import ContactForm from '@/components/contact-form'

const MYSAN_BLUE = '#1dabff'

export default function KontaktPage() {
  return (
    <main className="bg-white text-neutral-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-white">

        <div
          className="absolute left-0 top-0 z-30 h-full w-2"
          style={{ backgroundColor: MYSAN_BLUE }}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
          <div className="mx-auto max-w-7xl px-8 md:px-12 lg:px-16">
            <div
              className="
                relative overflow-hidden
                [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]
                [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]
              "
            >
              <img
                src="/kontakt.jpg"
                alt=""
                aria-hidden="true"
                className="h-auto w-full object-cover object-center opacity-[0.18]"
              />

              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />

              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />
            </div>
          </div>
        </div>

        <div className="relative z-20 mx-auto max-w-7xl px-8 pb-10 pt-28 md:px-12 md:pb-12 md:pt-32 lg:px-16">
          <div className="max-w-3xl">

            <div
              className="mb-5 h-1 w-14"
              style={{ backgroundColor: MYSAN_BLUE }}
            />

            <p
              className="text-xs font-semibold uppercase tracking-[0.25em]"
              style={{ color: MYSAN_BLUE }}
            >
              mySan Jeitziner
            </p>

            <h1 className="mt-4 text-5xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Kontaktieren
              <br />
              <span style={{ color: MYSAN_BLUE }}>
                Sie uns!
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg font-light leading-7 text-neutral-600 md:text-xl">
              Gerne stehen wir Ihnen mit Rat &amp; Tat zur Verfügung.
            </p>

          </div>
        </div>
      </section>

      {/* KONTAKT */}
      <section className="relative overflow-hidden bg-white">

        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{ backgroundColor: MYSAN_BLUE }}
        />

        <div className="mx-auto max-w-7xl px-8 py-10 md:px-12 md:py-14 lg:px-16">

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">

            {/* FORMULAR */}
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: MYSAN_BLUE }}
              >
                Schreiben Sie uns
              </p>

              <h2 className="mt-3 text-4xl font-light tracking-tight md:text-5xl">
                Wir sind für Sie da.
              </h2>

              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            {/* KONTAKTINFO */}
            <div className="lg:pt-14">

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: MYSAN_BLUE }}
              >
                Wo Sie uns finden
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                mySan Jeitziner GmbH
              </h2>

              <div className="mt-7 space-y-6 text-sm leading-6 text-neutral-600">

                <div>
                  <p className="font-medium text-neutral-900">
                    Adresse
                  </p>

                  <p className="mt-1">
                    Krydenweg 86
                    <br />
                    3900 Gamsen
                  </p>
                </div>

                <div>
                  <p className="font-medium text-neutral-900">
                    Telefon
                  </p>

                  <a
                    href="tel:+41795900960"
                    className="mt-1 block transition hover:text-[#1dabff]"
                  >
                    079 590 09 60
                  </a>
                </div>

                <div>
                  <p className="font-medium text-neutral-900">
                    Büro
                  </p>

                  <a
                    href="tel:+41792172571"
                    className="mt-1 block transition hover:text-[#1dabff]"
                  >
                    079 217 25 71
                  </a>
                </div>

                <div>
                  <p className="font-medium text-neutral-900">
                    E-Mail
                  </p>

                  <a
                    href="mailto:info@mysan.ch"
                    className="mt-1 block transition hover:text-[#1dabff]"
                  >
                    info@mysan.ch
                  </a>
                </div>

              </div>

          {/* GOOGLE MAPS */}
<div className="mt-10 overflow-hidden rounded-xl border border-neutral-200 bg-[#F4F7FA] shadow-sm">

  <iframe
    title="mySan Jeitziner GmbH Standort"
    src="https://www.google.com/maps?q=Krydenweg+86,+3900+Gamsen,+Schweiz&output=embed"
    className="h-[320px] w-full border-0 md:h-[360px]"
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />

</div>

<a
  href="https://www.google.com/maps/search/?api=1&query=Krydenweg+86%2C+3900+Gamsen%2C+Schweiz"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-4 inline-flex items-center text-sm font-semibold"
  style={{ color: MYSAN_BLUE }}
>
  Route zu uns
  <span className="ml-2 text-lg">→</span>
</a>

            </div>

          </div>
        </div>
      </section>

      {/* KONTAKT CTA */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: MYSAN_BLUE }}
      >
        <div className="mx-auto max-w-7xl px-8 py-10 md:px-12 md:py-12 lg:px-16">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                mySan Jeitziner
              </p>

              <h2 className="mt-2 text-3xl font-light text-white md:text-4xl">
                Persönlich. Kompetent. Zuverlässig.
              </h2>
            </div>

            <Link
              href="/referenzen"
              className="inline-flex w-fit items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
            >
              Unsere Referenzen
              <span className="ml-3 text-lg">→</span>
            </Link>

          </div>
        </div>
      </section>

    </main>
  )
}