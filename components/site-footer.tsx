import Link from 'next/link'

const MYSAN_BLUE = '#1dabff'

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white">
      {/* Dezente obere Linie */}
      <div
        className="h-px w-full"
        style={{
          backgroundColor: '#E5E7EB',
        }}
      />

      <div className="mx-auto max-w-7xl px-8 py-7 md:px-12 lg:px-16">
        <div className="flex flex-col items-start justify-between gap-4 text-xs md:flex-row md:items-center">

          {/* Copyright */}
          <p className="text-neutral-400">
            © {currentYear} Mysan Jeitziner
          </p>

          {/* Rechtliche Links */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/impressum"
              className="text-neutral-400 transition-colors duration-200 hover:text-[#1dabff]"
            >
              Impressum
            </Link>

            <span className="text-neutral-200">
              |
            </span>

            <Link
              href="/datenschutz"
              className="text-neutral-400 transition-colors duration-200 hover:text-[#1dabff]"
            >
              Datenschutz
            </Link>

            <span className="text-neutral-200">
              |
            </span>

            <Link
              href="/cookies"
              className="text-neutral-400 transition-colors duration-200 hover:text-[#1dabff]"
            >
              Cookies
            </Link>
          </nav>

        </div>
      </div>
    </footer>
  )
}