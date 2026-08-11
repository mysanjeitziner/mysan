'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const MYSAN_BLUE = '#1dabff'

const navItems = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/dienstleistungen',
    label: 'Dienstleistungen',
  },
  {
    href: '/news',
    label: 'News',
  },
  {
    href: '/referenzen',
    label: 'Referenzen',
  },
  {
    href: '/team',
    label: 'Team',
  },
  {
    href: '/kontakt',
    label: 'Kontakt',
  },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  /*
   * =========================================================
   * AKTIVER MENÜPUNKT
   * =========================================================
   */

  function isActive(href: string) {
    if (href === '/') {
      return pathname === '/'
    }

    return pathname === href || pathname.startsWith(`${href}/`)
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
                src="/logo.png"
                alt="mySan Jeitziner"
                className="h-16 w-auto object-contain"
              />
            </Link>

            {/* =================================================
                DESKTOP MENÜ
            ================================================= */}

            <nav className="hidden items-center gap-2 lg:flex">
              {navItems.map((item) => {
                const active = isActive(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group relative flex h-12 items-center
                      gap-3
                      px-4
                      text-sm
                      font-medium
                      transition-all
                      duration-200
                      ${
                        active
                          ? 'text-[#1dabff]'
                          : 'text-neutral-400 hover:text-[#1dabff]'
                      }
                    `}
                  >
                    {/* =================================================
                        LINKER STRICH
                    ================================================= */}

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
                            ? 'bg-[#1dabff]'
                            : 'bg-transparent group-hover:bg-[#1dabff]'
                        }
                      `}
                    />

                    {/* =================================================
                        WASSERTROPFEN
                    ================================================= */}

                    <span
                      className={`
                        flex
                        h-4
                        w-4
                        shrink-0
                        items-center
                        justify-center
                        transition-all
                        duration-200
                        ${
                          active
                            ? 'text-[#1dabff]'
                            : 'text-neutral-300 group-hover:text-[#1dabff]'
                        }
                      `}
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M12 2.5C12 2.5 5.5 10.1 5.5 15.2C5.5 19.3 8.4 22 12 22s6.5-2.7 6.5-6.8C18.5 10.1 12 2.5 12 2.5Z" />
                      </svg>
                    </span>

                    {item.label}
                  </Link>
                )
              })}
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
              onClick={() => setMenuOpen(!menuOpen)}
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                text-white
                transition-transform
                duration-200
                hover:scale-105
                lg:hidden
              "
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
          fixed
          inset-0
          z-40
          bg-white
          transition-all
          duration-300
          lg:hidden
          ${
            menuOpen
              ? 'visible opacity-100'
              : 'pointer-events-none invisible opacity-0'
          }
        `}
      >

        {/* LINKER SEITENSTREIFEN */}

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
            {navItems.map((item) => {
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    group
                    relative
                    flex
                    items-center
                    border-b
                    border-neutral-200
                    py-5
                    pl-8
                    text-2xl
                    font-light
                    transition-all
                    duration-200
                    ${
                      active
                        ? 'text-[#1dabff]'
                        : 'text-neutral-400 hover:text-[#1dabff]'
                    }
                  `}
                >

                  {/* LINKER STRICH */}

                  <span
                    className={`
                      absolute
                      left-0
                      top-1/2
                      h-8
                      w-0.5
                      -translate-y-1/2
                      transition-all
                      duration-200
                      ${
                        active
                          ? 'bg-[#1dabff]'
                          : 'bg-transparent group-hover:bg-[#1dabff]'
                      }
                    `}
                  />

                  {/* WASSERTROPFEN */}

                  <span
                    className={`
                      mr-5
                      flex
                      h-5
                      w-5
                      shrink-0
                      items-center
                      justify-center
                      transition-all
                      duration-200
                      ${
                        active
                          ? 'scale-110 text-[#1dabff]'
                          : 'text-neutral-300 group-hover:text-[#1dabff]'
                      }
                    `}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M12 2.5C12 2.5 5.5 10.1 5.5 15.2C5.5 19.3 8.4 22 12 22s6.5-2.7 6.5-6.8C18.5 10.1 12 2.5 12 2.5Z" />
                    </svg>
                  </span>

                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* =================================================
              FOOTER IM MOBILE MENÜ
          ================================================= */}

          <div className="mt-auto pt-8">

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-400">

              <Link
                href="/impressum"
                onClick={() => setMenuOpen(false)}
                className={`
                  transition-colors
                  ${
                    pathname === '/impressum'
                      ? 'text-[#1dabff]'
                      : 'hover:text-[#1dabff]'
                  }
                `}
              >
                Impressum
              </Link>

              <Link
                href="/datenschutz"
                onClick={() => setMenuOpen(false)}
                className={`
                  transition-colors
                  ${
                    pathname === '/datenschutz'
                      ? 'text-[#1dabff]'
                      : 'hover:text-[#1dabff]'
                  }
                `}
              >
                Datenschutz
              </Link>

              <Link
                href="/cookies"
                onClick={() => setMenuOpen(false)}
                className={`
                  transition-colors
                  ${
                    pathname === '/cookies'
                      ? 'text-[#1dabff]'
                      : 'hover:text-[#1dabff]'
                  }
                `}
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
