'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

const MYSAN_BLUE = '#20A7E8'

export default function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  /*
   * Prüft, ob ein Menüpunkt aktiv ist.
   *
   * Beispiel:
   * /referenzen
   * /referenzen/mein-projekt
   *
   * → Referenzen bleibt aktiv.
   */
  function isActive(href: string) {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    )
  }

  return (
    <>
      {/* =====================================================
          LINKER MYSAN SEITENSTREIFEN
      ===================================================== */}

      <div
        className="fixed left-0 top-0 z-[100] hidden h-screen w-2 md:block"
        style={{
          backgroundColor: MYSAN_BLUE,
        }}
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative z-50 w-full bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="flex h-24 items-center justify-between">

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center"
            >
              <img
                src="/logo.jpg"
                alt="mySan Jeitziner"
                className="h-16 w-auto object-contain"
              />
            </Link>

            {/* =================================================
                DESKTOP MENÜ
            ================================================= */}

            <nav className="hidden items-center gap-2 lg:flex">

              {navigation.map((item) => {
                const active = isActive(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group relative flex h-12 items-center
                      px-5
                      text-sm
                      font-medium
                      transition-all
                      duration-200
                      ${
                        active
                          ? 'text-[#20A7E8]'
                          : 'text-neutral-800 hover:text-[#20A7E8]'
                      }
                    `}
                  >

                    {/* Kurzer linker Strich */}

                    <span
                      className={`
                        absolute
                        left-0
                        top-1/2
                        h-6
                        w-0.5
                        -translate-y-1/2
                        transition-all
                        duration-200
                        ${
                          active
                            ? 'bg-[#20A7E8]'
                            : 'bg-transparent group-hover:bg-[#20A7E8]'
                        }
                      `}
                    />

                    {item.label}

                  </Link>
                )
              })}

              {/* =================================================
                  KONTAKT
              ================================================= */}

              <Link
                href="/kontakt"
                className={`
                  group relative ml-3 flex h-12 items-center
                  px-6
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  ${
                    pathname === '/kontakt'
                      ? 'text-[#20A7E8]'
                      : 'text-white'
                  }
                `}
                style={{
                  backgroundColor:
                    pathname === '/kontakt'
                      ? 'transparent'
                      : MYSAN_BLUE,
                }}
              >

                {/* Kurzer linker Strich bei aktivem Kontakt */}

                {pathname === '/kontakt' && (
                  <span
                    className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2"
                    style={{
                      backgroundColor: MYSAN_BLUE,
                    }}
                  />
                )}

                Kontakt

              </Link>

            </nav>

            {/* =================================================
                MOBILE BUTTON
            ================================================= */}

            <button
              type="button"
              aria-label={
                menuOpen
                  ? 'Menü schliessen'
                  : 'Menü öffnen'
              }
              aria-expanded={menuOpen}
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-white lg:hidden"
              style={{
                backgroundColor: MYSAN_BLUE,
              }}
            >

              <div className="relative h-5 w-6">

                {/* Obere Linie */}

                <span
                  className={`
                    absolute
                    left-0
                    h-0.5
                    w-6
                    bg-white
                    transition-all
                    duration-300
                    ${
                      menuOpen
                        ? 'top-2 rotate-45'
                        : 'top-0'
                    }
                  `}
                />

                {/* Mittlere Linie */}

                <span
                  className={`
                    absolute
                    left-0
                    top-2
                    h-0.5
                    w-6
                    bg-white
                    transition-all
                    duration-300
                    ${
                      menuOpen
                        ? 'opacity-0'
                        : 'opacity-100'
                    }
                  `}
                />

                {/* Untere Linie */}

                <span
                  className={`
                    absolute
                    left-0
                    h-0.5
                    w-6
                    bg-white
                    transition-all
                    duration-300
                    ${
                      menuOpen
                        ? 'top-2 -rotate-45'
                        : 'top-4'
                    }
                  `}
                />

              </div>

            </button>

          </div>
        </div>
      </header>

      {/* =====================================================
          MOBILE MENÜ
      ===================================================== */}

      <div
        className={`
          fixed inset-0 z-40
          bg-white
          transition-all duration-300
          lg:hidden
          ${
            menuOpen
              ? 'visible opacity-100'
              : 'pointer-events-none invisible opacity-0'
          }
        `}
      >

        {/* =================================================
            LINKER SEITENSTREIFEN
        ================================================= */}

        <div
          className="absolute left-0 top-0 h-full w-2"
          style={{
            backgroundColor: MYSAN_BLUE,
          }}
        />

        <div className="flex min-h-full flex-col px-8 pb-8 pt-32">

          {/* =================================================
              MOBILE NAVIGATION
          ================================================= */}

          <nav className="flex flex-col">

            {navigation.map((item, index) => {
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className={`
                    flex
                    items-center
                    border-b
                    border-neutral-200
                    border-l-4
                    py-5
                    pl-4
                    text-2xl
                    font-light
                    transition-all
                    duration-200
                    ${
                      active
                        ? 'border-l-[#20A7E8] text-[#20A7E8]'
                        : 'border-l-transparent text-neutral-900 hover:border-l-[#20A7E8] hover:text-[#20A7E8]'
                    }
                  `}
                >

                  {/* Nummer */}

                  <span
                    className="mr-5 text-xs font-semibold"
                    style={{
                      color: MYSAN_BLUE,
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {item.label}

                </Link>
              )
            })}

            {/* =================================================
                MOBILE KONTAKT
            ================================================= */}

            <Link
              href="/kontakt"
              onClick={() =>
                setMenuOpen(false)
              }
              className={`
                mt-8
                flex
                items-center
                justify-between
                border-l-4
                px-6
                py-4
                text-base
                font-semibold
                transition-all
                duration-200
                ${
                  pathname === '/kontakt'
                    ? 'border-l-[#20A7E8] bg-white text-[#20A7E8]'
                    : 'border-l-transparent text-white'
                }
              `}
              style={{
                backgroundColor:
                  pathname === '/kontakt'
                    ? 'white'
                    : MYSAN_BLUE,
              }}
            >

              Kontakt aufnehmen

              <span className="text-xl">
                →
              </span>

            </Link>

          </nav>

          {/* =================================================
              DEZENTER FOOTER
          ================================================= */}

          <div className="mt-auto pt-8">

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-400">

              <Link
                href="/impressum"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="transition-colors hover:text-[#20A7E8]"
              >
                Impressum
              </Link>

              <Link
                href="/datenschutz"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="transition-colors hover:text-[#20A7E8]"
              >
                Datenschutz
              </Link>

              <Link
                href="/cookies"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="transition-colors hover:text-[#20A7E8]"
              >
                Cookies
              </Link>

            </div>

          </div>

        </div>

      </div>
    </>
  )
}