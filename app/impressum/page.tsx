import PageHero from '@/components/page-hero'

export default function ImpressumPage() {
return ( <main> <PageHero
     eyebrow="Rechtliches"
     title="Impressum"
     description="Angaben zum Unternehmen und zur verantwortlichen Stelle."
   />

  <section className="relative overflow-hidden">
    <div className="absolute left-0 top-0 h-full w-2 bg-[#1dabff]" />

    <div className="mx-auto max-w-4xl px-8 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="space-y-12">

        <div>
          <h2 className="text-2xl font-light tracking-tight md:text-3xl">
            Mysan Jeitziner
          </h2>

          <div className="mt-5 space-y-1 leading-7 text-neutral-600">
            <p>Sanitär und Heizung</p>
            <p>Wallis, Schweiz</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-light tracking-tight md:text-3xl">
            Kontakt
          </h2>

          <div className="mt-5 space-y-1 leading-7 text-neutral-600">
            <p>
              Telefon:{' '}
              <a
                href="tel:+41000000000"
                className="transition-colors hover:text-[#1dabff]"
              >
                +41 XX XXX XX XX
              </a>
            </p>

            <p>
              E-Mail:{' '}
              <a
                href="mailto:info@mysan.ch"
                className="transition-colors hover:text-[#1dabff]"
              >
                info@mysan.ch
              </a>
            </p>

            <p>
              Website:{' '}
              <a
                href="https://www.mysan.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#1dabff]"
              >
                www.mysan.ch
              </a>
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-light tracking-tight md:text-3xl">
            Verantwortlich für den Inhalt
          </h2>

          <p className="mt-5 leading-7 text-neutral-600">
            Mysan Jeitziner
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-light tracking-tight md:text-3xl">
            Haftung für Inhalte
          </h2>

          <p className="mt-5 leading-7 text-neutral-600">
            Die Inhalte dieser Website wurden mit grösstmöglicher Sorgfalt
            erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität
            der Inhalte können wir jedoch keine Gewähr übernehmen.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-light tracking-tight md:text-3xl">
            Haftung für Links
          </h2>

          <p className="mt-5 leading-7 text-neutral-600">
            Unsere Website kann Links zu externen Websites Dritter
            enthalten. Auf deren Inhalte haben wir keinen Einfluss.
            Für die Inhalte der verlinkten Seiten ist stets der jeweilige
            Anbieter oder Betreiber verantwortlich.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-light tracking-tight md:text-3xl">
            Urheberrecht
          </h2>

          <p className="mt-5 leading-7 text-neutral-600">
            Die auf dieser Website veröffentlichten Inhalte und Werke
            unterliegen dem schweizerischen Urheberrecht. Jede über den
            gesetzlich zulässigen Rahmen hinausgehende Verwendung bedarf
            der vorherigen Zustimmung des jeweiligen Rechteinhabers.
          </p>
        </div>

      </div>
    </div>
  </section>
</main>


)
}
