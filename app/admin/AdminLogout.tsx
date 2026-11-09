
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function AdminLogout() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    const confirmed = window.confirm(
      'Möchtest du dich wirklich abmelden?'
    )

    if (!confirmed) return

    setLoading(true)

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace('/login')
            router.refresh()
          },
          onError: (context) => {
            console.error(
              'Logout Fehler:',
              context.error
            )

            alert(
              'Die Abmeldung konnte nicht durchgeführt werden.'
            )

            setLoading(false)
          },
        },
      })
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
