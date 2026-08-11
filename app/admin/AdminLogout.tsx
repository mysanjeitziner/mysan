'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogout() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    const confirmed = window.confirm(
      'Möchtest du dich wirklich abmelden?'
    )

    if (!confirmed) return

    setLoading(true)

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      // Zur Login-Seite
      router.replace('/login')

      // Server-Komponenten neu laden,
      // damit die Session überall aktualisiert wird.
      router.refresh()

    } catch (error) {
      console.error('Logout Fehler:', error)

      alert(
        'Die Abmeldung konnte nicht durchgeführt werden.'
      )

      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-4
        py-3
        text-left
        text-sm
        font-medium
        text-red-500
        transition
        hover:bg-red-50
        hover:text-red-600
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      <span className="flex h-6 w-6 items-center justify-center">
        ↪
      </span>

      {loading ? 'Abmelden...' : 'Abmelden'}
    </button>
  )
}

