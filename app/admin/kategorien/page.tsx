import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import KategorieForm from './KategorieForm'

export default async function KategorienPage() {
  const supabase = await createClient()

  const {
    data: categories,
    error,
  } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold">
            Kategorien
          </h1>

          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
            Fehler beim Laden der Kategorien:
            <br />
            {error.message}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Zurück zum Admin
          </Link>

          <div className="mt-4">
            <h1 className="text-4xl font-bold">
              Kategorien
            </h1>

            <p className="mt-2 text-gray-500">
              Kategorien für deine Referenzen verwalten
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* KATEGORIEN */}

          <section className="overflow-hidden rounded-2xl bg-white shadow">

            <div className="border-b p-6">
              <h2 className="text-xl font-semibold">
                Vorhandene Kategorien
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {categories?.length || 0} Kategorien
              </p>
            </div>

            <div>
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <KategorieForm
                    key={category.id}
                    category={category}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Noch keine Kategorien vorhanden.
                </div>
              )}
            </div>

          </section>

          {/* NEUE KATEGORIE */}

          <section className="h-fit rounded-2xl bg-white p-6 shadow">

            <h2 className="text-xl font-semibold">
              Neue Kategorie
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Neue Kategorie für Referenzen erstellen
            </p>

            <KategorieForm />

          </section>

        </div>

      </div>
    </main>
  )
}