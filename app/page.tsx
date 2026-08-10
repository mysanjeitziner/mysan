
import Link from "next/link";

const references = [
  {
    title: "Sanitär",
    text: "Sanitärinstallationen für Neubauten, Umbauten und Renovationen.",
    image: "/images/referenzen/sanitaer.jpg",
  },
  {
    title: "Heizung",
    text: "Moderne Heizsysteme, Sanierungen und zuverlässiger Service.",
    image: "/images/referenzen/heizung.jpg",
  },
  {
    title: "Umbau & Renovation",
    text: "Kompetente Lösungen für Bad, Küche und gesamte Gebäudetechnik.",
    image: "/images/referenzen/umbau.jpg",
  },
];

const news = [
  {
    date: "10.08.2026",
    title: "Unsere aktuellen Projekte",
    text: "Entdecken Sie unsere neuesten Arbeiten und Referenzen.",
  },
  {
    date: "01.08.2026",
    title: "Sanitär & Heizung aus einer Hand",
    text: "Wir begleiten Sie von der Planung bis zur fertigen Installation.",
  },
  {
    date: "15.07.2026",
    title: "Mysan Jeitziner",
    text: "Ihr zuverlässiger Partner für Sanitär und Heizung im Wallis.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-[#222222]">
      {/* =========================================================
          LINKER MYsan MARKENSTREIFEN
      ========================================================= */}
      <div className="fixed left-0 top-0 z-50 hidden h-screen w-[8px] bg-[#3C70B7] md:block" />

      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="relative z-40 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-[90px] max-w-[1500px] items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center"
            aria-label="Mysan Jeitziner Startseite"
          >
            <div className="leading-none">
              <div className="text-[30px] font-light tracking-[-1px] text-[#3C70B7]">
                mySan
              </div>

              <div className="mt-1 text-[12px] font-semibold uppercase tracking-[4px] text-[#222222]">
                JEITZINER
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              href="/"
              className="text-[15px] font-medium text-[#3C70B7]"
            >
              Home
            </Link>

            <Link
              href="/sanitaer"
              className="text-[15px] font-medium text-gray-700 transition hover:text-[#3C70B7]"
            >
              Sanitär
            </Link>

            <Link
              href="/heizung"
              className="text-[15px] font-medium text-gray-700 transition hover:text-[#3C70B7]"
            >
              Heizung
            </Link>

            <Link
              href="/referenzen"
              className="text-[15px] font-medium text-gray-700 transition hover:text-[#3C70B7]"
            >
              Referenzen
            </Link>

            <Link
              href="/news"
              className="text-[15px] font-medium text-gray-700 transition hover:text-[#3C70B7]"
            >
              News
            </Link>

            <Link
              href="/kontakt"
              className="rounded-full bg-[#3C70B7] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#315f9d]"
            >
              Kontakt
            </Link>
          </nav>

          {/* Mobile menu */}
          <button
            type="button"
            aria-label="Menü öffnen"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 lg:hidden"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-[2px] w-5 bg-[#222222]" />
              <span className="block h-[2px] w-5 bg-[#222222]" />
              <span className="block h-[2px] w-5 bg-[#222222]" />
            </span>
          </button>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative min-h-[680px] overflow-hidden bg-[#F4F7FA]">
        {/* Hintergrundbild */}
        <div className="absolute inset-0">
          <img
            src="/images/hero/mysan-hero.jpg"
            alt="Mysan Jeitziner Sanitär und Heizung"
            className="h-full w-full object-cover"
          />

          {/* dunkler Overlay für bessere Lesbarkeit */}
          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
        </div>

        {/* =====================================================
            AUTO.PNG – TRANSPARENTES OVERLAY
        ===================================================== */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-[60%] overflow-hidden">
          <img
            src="/auto.png"
            alt=""
            className="absolute right-[-70px] top-[-30px] w-[720px] max-w-none opacity-[0.15]"
          />
        </div>

        {/* Hero Inhalt */}
        <div className="relative z-20 mx-auto flex min-h-[680px] max-w-[1500px] items-center px-6 lg:px-20">
          <div className="max-w-[720px] text-white">
            <div className="mb-6 flex items-center gap-4">
              <span className="h-[2px] w-12 bg-[#3C70B7]" />

              <span className="text-sm font-semibold uppercase tracking-[4px]">
                Mysan Jeitziner
              </span>
            </div>

            <h1 className="text-5xl font-light leading-[1.05] tracking-[-2px] sm:text-6xl lg:text-8xl">
              Ihr Sanitär
              <br />
              <span className="font-semibold">im Wallis.</span>
            </h1>

            <p className="mt-8 max-w-[560px] text-lg leading-8 text-white/90 lg:text-xl">
              Für sämtliche Sanitär- und Heizungsarbeiten in und ums Haus.
              Persönlich, zuverlässig und kompetent.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="rounded-full bg-[#3C70B7] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#315f9d]"
              >
                Kontakt aufnehmen
              </Link>

              <Link
                href="/referenzen"
                className="rounded-full border border-white/70 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#222222]"
              >
                Referenzen ansehen
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Informationsleiste */}
        <div className="absolute bottom-0 left-0 right-0 z-20 hidden bg-white/95 backdrop-blur md:block">
          <div className="mx-auto grid max-w-[1500px] grid-cols-3">
            <div className="border-r border-gray-200 px-10 py-6">
              <div className="text-sm font-semibold uppercase tracking-[2px] text-[#3C70B7]">
                Sanitär
              </div>

              <div className="mt-1 text-sm text-gray-600">
                Planung · Installation · Service
              </div>
            </div>

            <div className="border-r border-gray-200 px-10 py-6">
              <div className="text-sm font-semibold uppercase tracking-[2px] text-[#3C70B7]">
                Heizung
              </div>

              <div className="mt-1 text-sm text-gray-600">
                Modernisierung · Neubau · Unterhalt
              </div>
            </div>

            <div className="px-10 py-6">
              <div className="text-sm font-semibold uppercase tracking-[2px] text-[#3C70B7]">
                Wallis
              </div>

              <div className="mt-1 text-sm text-gray-600">
                Persönlich für Sie da
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRO
      ========================================================= */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1300px] gap-16 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[3px] text-[#3C70B7]">
              Mysan Jeitziner
            </span>

            <h2 className="mt-5 text-4xl font-light leading-tight tracking-[-1px] sm:text-5xl">
              Technik, auf die
              <br />
              <span className="font-semibold">Sie zählen können.</span>
            </h2>
          </div>

          <div className="max-w-[720px]">
            <p className="text-lg leading-8 text-gray-600">
              Ob Neubau, Umbau oder Renovation – Mysan Jeitziner ist Ihr
              Ansprechpartner für Sanitär und Heizung. Wir planen und
              realisieren individuelle Lösungen und sorgen dafür, dass
              Technik zuverlässig funktioniert.
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Von der ersten Beratung über die fachgerechte Installation bis
              zum Service und Unterhalt stehen wir persönlich an Ihrer Seite.
            </p>

            <Link
              href="/ueber-uns"
              className="mt-8 inline-flex items-center gap-3 font-semibold text-[#3C70B7]"
            >
              Mehr über uns
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          LEISTUNGEN
      ========================================================= */}
      <section className="bg-[#F4F7FA] py-24 lg:py-32">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
          <div className="mb-14 max-w-[700px]">
            <span className="text-sm font-semibold uppercase tracking-[3px] text-[#3C70B7]">
              Unsere Leistungen
            </span>

            <h2 className="mt-4 text-4xl font-light tracking-[-1px] sm:text-5xl">
              Sanitär & Heizung
              <br />
              <span className="font-semibold">aus einer Hand.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Sanitär */}
            <Link
              href="/sanitaer"
              className="group relative min-h-[430px] overflow-hidden bg-white"
            >
              <img
                src="/images/leistungen/sanitaer.jpg"
                alt="Sanitär"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white lg:p-10">
                <div className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-[#8eb6e8]">
                  Leistung
                </div>

                <h3 className="text-4xl font-light">
                  <span className="font-semibold">Sanitär</span>
                </h3>

                <p className="mt-3 max-w-[500px] leading-7 text-white/85">
                  Badezimmer, Wasserinstallationen, Küchen und sämtliche
                  Sanitärarbeiten rund ums Gebäude.
                </p>

                <div className="mt-6 font-semibold">
                  Mehr erfahren <span className="ml-2">→</span>
                </div>
              </div>
            </Link>

            {/* Heizung */}
            <Link
              href="/heizung"
              className="group relative min-h-[430px] overflow-hidden bg-white"
            >
              <img
                src="/images/leistungen/heizung.jpg"
                alt="Heizung"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white lg:p-10">
                <div className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-[#8eb6e8]">
                  Leistung
                </div>

                <h3 className="text-4xl font-light">
                  <span className="font-semibold">Heizung</span>
                </h3>

                <p className="mt-3 max-w-[500px] leading-7 text-white/85">
                  Moderne Heizlösungen, Sanierungen, Installationen, Service
                  und Unterhalt.
                </p>

                <div className="mt-6 font-semibold">
                  Mehr erfahren <span className="ml-2">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          REFERENZEN
      ========================================================= */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[3px] text-[#3C70B7]">
                Unsere Arbeiten
              </span>

              <h2 className="mt-4 text-4xl font-light tracking-[-1px] sm:text-5xl">
                Referenzen
              </h2>
            </div>

            <Link
              href="/referenzen"
              className="font-semibold text-[#3C70B7]"
            >
              Alle Referenzen ansehen →
            </Link>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {references.map((reference) => (
              <Link
                href="/referenzen"
                key={reference.title}
                className="group overflow-hidden border border-gray-100 bg-white"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#F4F7FA]">
                  <img
                    src={reference.image}
                    alt={reference.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-7">
                  <div className="text-sm font-semibold uppercase tracking-[2px] text-[#3C70B7]">
                    Mysan Jeitziner
                  </div>

                  <h3 className="mt-2 text-2xl font-semibold">
                    {reference.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {reference.text}
                  </p>

                  <div className="mt-5 font-semibold text-[#3C70B7]">
                    Projekt ansehen →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          NEWS
      ========================================================= */}
      <section className="bg-[#F4F7FA] py-24 lg:py-32">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[3px] text-[#3C70B7]">
                Aktuelles
              </span>

              <h2 className="mt-4 text-4xl font-light tracking-[-1px] sm:text-5xl">
                News
              </h2>
            </div>

            <Link
              href="/news"
              className="font-semibold text-[#3C70B7]"
            >
              Alle News ansehen →
            </Link>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {news.map((item) => (
              <Link
                href="/news"
                key={item.title}
                className="group bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="text-sm font-semibold text-[#3C70B7]">
                  {item.date}
                </div>

                <h3 className="mt-5 text-2xl font-semibold leading-tight">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {item.text}
                </p>

                <div className="mt-7 font-semibold text-[#3C70B7]">
                  Weiterlesen →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#3C70B7] py-24 text-white lg:py-28">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5" />

        <div className="relative mx-auto flex max-w-[1300px] flex-col justify-between gap-10 px-6 lg:flex-row lg:items-center lg:px-12">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[3px] text-white/70">
              Ihr Projekt
            </div>

            <h2 className="mt-4 max-w-[700px] text-4xl font-light leading-tight sm:text-5xl">
              Sie haben ein Projekt?
              <br />
              <span className="font-semibold">
                Wir haben die Lösung.
              </span>
            </h2>

            <p className="mt-5 max-w-[650px] text-lg leading-8 text-white/80">
              Sprechen Sie mit uns. Wir beraten Sie gerne persönlich und
              finden gemeinsam die passende Lösung.
            </p>
          </div>

          <Link
            href="/kontakt"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-9 py-4 font-semibold text-[#3C70B7] transition hover:bg-gray-100"
          >
            Kontakt aufnehmen
          </Link>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="bg-[#222222] text-white">
        <div className="mx-auto grid max-w-[1300px] gap-12 px-6 py-16 lg:grid-cols-4 lg:px-12">
          <div className="lg:col-span-2">
            <div className="text-[30px] font-light text-white">
              mySan
            </div>

            <div className="mt-1 text-[12px] font-semibold uppercase tracking-[4px] text-white/60">
              JEITZINER
            </div>

            <p className="mt-6 max-w-[420px] leading-7 text-white/60">
              Ihr zuverlässiger Partner für Sanitär und Heizung im Wallis.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Navigation</h3>

            <div className="mt-5 flex flex-col gap-3 text-white/60">
              <Link
                href="/sanitaer"
                className="transition hover:text-white"
              >
                Sanitär
              </Link>

              <Link
                href="/heizung"
                className="transition hover:text-white"
              >
                Heizung
              </Link>

              <Link
                href="/referenzen"
                className="transition hover:text-white"
              >
                Referenzen
              </Link>

              <Link
                href="/news"
                className="transition hover:text-white"
              >
                News
              </Link>

              <Link
                href="/kontakt"
                className="transition hover:text-white"
              >
                Kontakt
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Kontakt</h3>

            <div className="mt-5 space-y-3 text-white/60">
              <p>Mysan Jeitziner</p>
              <p>Sanitär & Heizung</p>
              <p>Wallis, Schweiz</p>

              <Link
                href="/kontakt"
                className="inline-block pt-2 text-[#6f9fd5] transition hover:text-white"
              >
                Kontakt aufnehmen →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1300px] flex-col justify-between gap-4 px-6 py-6 text-sm text-white/40 md:flex-row lg:px-12">
            <div>
              © {new Date().getFullYear()} Mysan Jeitziner. Alle Rechte
              vorbehalten.
            </div>

            <div className="flex gap-6">
              <Link
                href="/impressum"
                className="hover:text-white"
              >
                Impressum
              </Link>

              <Link
                href="/datenschutz"
                className="hover:text-white"
              >
                Datenschutz
              </Link>

              <Link
                href="/cookies"
                className="hover:text-white"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

