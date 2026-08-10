import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminLogout from './AdminLogout'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gray-100">

      {/* DESKTOP SIDEBAR */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-white lg:flex lg:flex-col">

        {/* LOGO */}

        <div className="flex h-24 items-center border-b px-6">

          <Link
            href="/admin"
            className="flex items-center"
          >
            <img
              src="/logo.jpg"
              alt="Mysan Jeitziner"
              className="max-h-14 w-auto max-w-[190px]"
            />
          </Link>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 p-4">

          <div className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Verwaltung
          </div>

          <div className="space-y-1">

            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
            >
              <span className="flex h-6 w-6 items-center justify-center">
                ▦
              </span>

              Dashboard
            </Link>

            <Link
              href="/admin/referenzen"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
            >
              <span className="flex h-6 w-6 items-center justify-center">
                ▧
              </span>

              Referenzen
            </Link>

            <Link
              href="/admin/kategorien"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
            >
              <span className="flex h-6 w-6 items-center justify-center">
                ☷
              </span>

              Kategorien
            </Link>

            <Link
              href="/admin/news"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
            >
              <span className="flex h-6 w-6 items-center justify-center">
                ◫
              </span>

              News
            </Link>

          </div>

        </nav>

        {/* FOOTER SIDEBAR */}

        <div className="border-t p-4">

          <Link
            href="/"
            target="_blank"
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-black"
          >
            <span className="flex h-6 w-6 items-center justify-center">
              ↗
            </span>

            Website öffnen
          </Link>

          {user && (
            <div className="mb-2 truncate px-4 text-xs text-gray-400">
              {user.email}
            </div>
          )}

          <AdminLogout />

        </div>

      </aside>

      {/* MOBILE HEADER */}

      <div className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-5 lg:hidden">

        <Link href="/admin">
          <img
            src="/logo-mysan.svg"
            alt="Mysan Jeitziner"
            className="h-10 w-auto max-w-[160px]"
          />
        </Link>

      </div>

      {/* HAUPTINHALT */}

      <main className="min-h-screen lg:pl-64">
        {children}
      </main>

    </div>
  )
}