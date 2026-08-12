'use client'

import { useEffect, useState } from 'react'

const COOKIE_NAME = 'mysan-cookie-consent'

type Consent = {
  necessary: true
  external: boolean
}

type Props = {
  src: string
  title?: string
  className?: string
}

export default function ConsentGatedMap({
  src,
  title = 'mySan Jeitziner GmbH Standort',
  className = '',
}: Props) {
  const [allowed, setAllowed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    function checkConsent() {
      const saved = localStorage.getItem(COOKIE_NAME)

      if (!saved) {
        setAllowed(false)
        setChecking(false)
        return
      }

      try {
        const consent = JSON.parse(saved) as Consent

        setAllowed(consent.external === true)
      } catch {
        setAllowed(false)
      }

      setChecking(false)
    }

    checkConsent()

    function handleConsent(event: Event) {
      const customEvent = event as CustomEvent<Consent>

      if (customEvent.detail?.external === true) {
        setAllowed(true)
      }
    }

    window.addEventListener(
      'mysan-cookie-consent',
      handleConsent
    )

    return () => {
      window.removeEventListener(
        'mysan-cookie-consent',
        handleConsent
      )
    }
  }, [])

  function allowGoogleMaps() {
    const consent: Consent = {
      necessary: true,
      external: true,
    }

    localStorage.setItem(
      COOKIE_NAME,
      JSON.stringify(consent)
    )

    setAllowed(true)

    window.dispatchEvent(
      new CustomEvent('mysan-cookie-consent', {
        detail: consent,
      })
    )
  }

  if (checking) {
    return (
      <div
        className={`flex h-[320px] items-center justify-center bg-[#F4F7FA] md:h-[360px] ${className}`}
      >
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-neutral-300 border-t-[#1dabff]" />
      </div>
    )
  }

  if (!allowed) {
    return (
      <div
        className={`
          relative
          flex
          h-[320px]
          items-center
          justify-center
          overflow-hidden
          bg-[#F4F7FA]
          px-6
          md:h-[360px]
          ${className}
        `}
      >
        {/* LINKER BLAUER STRICH */}

        <div
          className="absolute left-0 top-0 h-full w-1"
          style={{
            backgroundColor: '#1dabff',
          }}
        />

        <div className="max-w-md text-center">

          {/* ICON */}

          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              backgroundColor: '#1dabff',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              className="h-7 w-7"
            >
              <path
                d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
              />

              <circle
                cx="12"
                cy="9"
                r="2.2"
              />
            </svg>
          </div>

          <h3 className="mt-5 text-xl font-light text-neutral-900">
            Google Maps laden
          </h3>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Für die Anzeige der Karte wird ein externer
            Dienst von Google geladen. Dabei können Daten
            an Google übertragen werden.
          </p>

          <button
            type="button"
            onClick={allowGoogleMaps}
            className="
              mt-5
              rounded-full
              bg-[#1dabff]
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#149be5]
            "
          >
            Google Maps laden
          </button>

        </div>
      </div>
    )
  }

  return (
    <iframe
      title={title}
      src={src}
      className={`
        h-[320px]
        w-full
        border-0
        md:h-[360px]
        ${className}
      `}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  )
}