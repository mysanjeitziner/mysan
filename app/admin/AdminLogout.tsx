'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogout() {
  const router = useRouter()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()

    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
    >
      <span>
        ⇥
      </span>

      Abmelden
    </button>
  )
}