'use client'

import Link from 'next/link'
import { useState } from 'react'

const navigation = [
  {
    label: 'Sanitär',
    href: '/sanitaer',
  },
  {
    label: 'Heizung',
    href: '/heizung',
  },
  {
    label: 'Referenzen',
    href: '/referenzen',
  },
  {
    label: 'News',
    href: '/news',
  },
]

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="absolute left-0 right-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-5 md:px-8">
          <div className="flex items-center justify-between">

            {/* LOGO */}

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="relative z-50 text-white"
            >
              <div className="text-2xl font-bold leading-none tracking-tight">
                MYSAN
              </div>

              <div className="mt-1 text-[10px] font-medium tracking-[0.28em] text-white/70">
                JEITZINER
              </div>
            </Link>

            {/* DESKTOP */}

            <nav className="hidden items-center gap-8 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-white transition hover:text-white/60"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/kontakt"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200"
              >
                Kontakt
              </Link>
            </nav>

            {/* MOBILE BUTTON */}

            <button
              type="button"
              aria-label={
                menuOpen
                  ? 'Menü schliessen'
                  : 'Menü öffnen'
              }
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white md:hidden"
            >
              <div className="relative h-4 w-5">

                <span
                  className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-300 ${
                    menuOpen
                      ? 'translate-y-2 rotate-45'
                      : ''
                  }`}
                />

                <span
                  className={`absolute left-0 top-2 h-px w-5 bg-current transition-opacity duration-300 ${
                    menuOpen
                      ? 'opacity-0'
                      : ''
                  }`}
                />

                <span
                  className={`absolute left-0 top-4 h-px w-5 bg-current transition-transform duration-300 ${
                    menuOpen
                      ? '-translate-y-2 -rotate-45'
                      : ''
                  }`}
                />

              </div>
            </button>

          </div>
        </div>
      </header>

      {/* MOBILE MENU */}

      <div
        className={`fixed inset-0 z-40 bg-neutral-950 transition-all duration-300 md:hidden ${
          menuOpen
            ? 'visible opacity-100'
            : 'invisible opacity-0'
        }`}
      >
        <div className="flex min-h-full flex-col px-6 pb-8 pt-28">

          <nav className="flex flex-col">

            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-5 text-3xl font-medium text-white"
              >
                <span className="mr-4 text-xs text-white/30">
                  0{index + 1}
                </span>

                {item.label}
              </Link>
            ))}

            <Link
              href="/kontakt"
              onClick={() => setMenuOpen(false)}
              className="mt-8 flex items-center justify-between rounded-full bg-white px-6 py-4 text-lg font-medium text-neutral-900"
            >
              Kontakt aufnehmen

              <span>→</span>
            </Link>

          </nav>

          <div className="mt-auto border-t border-white/10 pt-6">

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/50">

              <Link
                href="/impressum"
                onClick={() => setMenuOpen(false)}
                className="transition hover:text-white"
              >
                Impressum
              </Link>

              <Link
                href="/datenschutz"
                onClick={() => setMenuOpen(false)}
                className="transition hover:text-white"
              >
                Datenschutz
              </Link>

              <Link
                href="/cookies"
                onClick={() => setMenuOpen(false)}
                className="transition hover:text-white"
              >
                Cookies
              </Link>

            </div>

            <p className="mt-6 text-xs text-white/30">
              © {new Date().getFullYear()} Mysan Jeitziner
            </p>

          </div>
        </div>
      </div>
    </>
  )
}