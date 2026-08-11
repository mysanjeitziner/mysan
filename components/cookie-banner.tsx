
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const COOKIE_NAME = 'mysan-cookie-consent'

type Consent = {
  necessary: true
  external: boolean
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [external, setExternal] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_NAME)

    if (!saved) {
      setVisible(true)
      return
    }

    try {
      const consent = JSON.parse(saved) as Consent

      setExternal(
        consent.external === true
      )
    } catch {
      localStorage.removeItem(COOKIE_NAME)
      setVisible(true)
    }
  }, [])

  function saveConsent(
    allowExternal: boolean
  ) {
    const consent: Consent = {
      necessary: true,
      external: allowExternal,
    }

    localStorage.setItem(
      COOKIE_NAME,
      JSON.stringify(consent)
    )

    setExternal(allowExternal)
    setVisible(false)
    setSettingsOpen(false)

    window.dispatchEvent(
      new CustomEvent(
        'mysan-cookie-consent',
        {
          detail: consent,
        }
      )
    )
  }

  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] p-4 md:p-6">

      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">

        <div className="flex">

          {/* BLAUER LINKER STRICH */}

          <div
            className="w-1 shrink-0"
            style={{
              backgroundColor: '#1dabff',
            }}
          />

          <div className="flex-1 p-5 md:p-6">

            {!settingsOpen ? (
              <>
                <div className="md:flex md:items-start md:justify-between md:gap-8">

                  <div className="max-w-3xl">

                    <p
                      className="text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{
                        color: '#1dabff',
                      }}
                    >
                      Cookies & Datenschutz
                    </p>

                    <h2 className="mt-2 text-xl font-light text-neutral-900 md:text-2xl">
                      Ihre Privatsphäre ist uns wichtig.
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-neutral-600">
                      Wir verwenden technisch notwendige Cookies,
                      damit unsere Website und der geschützte
                      Administrationsbereich funktionieren.
                      Für externe Inhalte können Sie Ihre Zustimmung
                      separat erteilen.
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm">

                      <Link
                        href="/datenschutz"
                        className="font-medium text-neutral-700 underline underline-offset-4 hover:text-[#1dabff]"
                      >
                        Datenschutz
                      </Link>

                      <Link
                        href="/cookies"
                        className="font-medium text-neutral-700 underline underline-offset-4 hover:text-[#1dabff]"
                      >
                        Cookie-Informationen
                      </Link>

                    </div>

                  </div>

                  <div className="mt-5 flex shrink-0 flex-col gap-2 md:mt-0 md:w-48">

                    <button
                      type="button"
                      onClick={() =>
                        saveConsent(true)
                      }
                      className="rounded-full bg-[#1dabff] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#149be5]"
                    >
                      Alle akzeptieren
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        saveConsent(false)
                      }
                      className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                    >
                      Nur notwendige
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSettingsOpen(true)
                      }
                      className="py-2 text-sm text-neutral-500 transition hover:text-[#1dabff]"
                    >
                      Einstellungen
                    </button>

                  </div>

                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p
                      className="text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{
                        color: '#1dabff',
                      }}
                    >
                      Cookie-Einstellungen
                    </p>

                    <h2 className="mt-2 text-2xl font-light">
                      Einstellungen
                    </h2>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSettingsOpen(false)
                    }
                    className="text-2xl text-neutral-400 hover:text-neutral-700"
                    aria-label="Einstellungen schliessen"
                  >
                    ×
                  </button>

                </div>

                <div className="mt-6 space-y-4">

                  {/* NOTWENDIG */}

                  <div className="rounded-xl border border-neutral-200 p-4">

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <h3 className="font-medium">
                          Notwendige Cookies
                        </h3>

                        <p className="mt-1 text-sm leading-5 text-neutral-500">
                          Diese Cookies sind für den Betrieb
                          der Website und insbesondere für den
                          Login im Administrationsbereich
                          erforderlich.
                        </p>

                      </div>

                      <span className="shrink-0 text-sm font-medium text-[#1dabff]">
                        Immer aktiv
                      </span>

                    </div>

                  </div>

                  {/* EXTERNE INHALTE */}

                  <div className="rounded-xl border border-neutral-200 p-4">

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <h3 className="font-medium">
                          Externe Inhalte
                        </h3>

                        <p className="mt-1 text-sm leading-5 text-neutral-500">
                          Dazu können beispielsweise Inhalte
                          von Google Maps oder anderen externen
                          Diensten gehören.
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setExternal(!external)
                        }
                        className={`
                          relative
                          h-6
                          w-11
                          shrink-0
                          rounded-full
                          transition
                          ${
                            external
                              ? 'bg-[#1dabff]'
                              : 'bg-neutral-300'
                          }
                        `}
                        aria-label="Externe Inhalte aktivieren"
                        aria-pressed={external}
                      >

                        <span
                          className={`
                            absolute
                            top-1
                            h-4
                            w-4
                            rounded-full
                            bg-white
                            shadow
                            transition
                            ${
                              external
                                ? 'left-6'
                                : 'left-1'
                            }
                          `}
                        />

                      </button>

                    </div>

                  </div>

                </div>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={() =>
                      saveConsent(false)
                    }
                    className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Nur notwendige
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      saveConsent(external)
                    }
                    className="rounded-full bg-[#1dabff] px-5 py-3 text-sm font-semibold text-white hover:bg-[#149be5]"
                  >
                    Auswahl speichern
                  </button>

                </div>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}
