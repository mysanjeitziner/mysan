
'use client'

export default function CookieSettingsButton() {
  function resetCookies() {
    localStorage.removeItem('mysan-cookie-consent')
    window.location.reload()
  }

  return (
    <button
      type="button"
      onClick={resetCookies}
      className="mt-5 rounded-full bg-[#1dabff] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#149be5]"
    >
      Cookie-Einstellungen erneut anzeigen
    </button>
  )
}
