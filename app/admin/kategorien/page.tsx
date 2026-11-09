import Link from 'next/link'
import { sql } from '@/lib/neon'
import KategorieForm from './KategorieForm'

type Category = {
  id: string
  name: string
  slug: string
  sort_order: number
  active: boolean
  created_at: string
  updated_at: string
}

type CategoryRow = {
  id: string
  name: string | null
  slug: string | null
  sort_order: number | string | null
  active: boolean | null
  created_at: string | Date | null
  updated_at: string | Date | null
}

export default async function KategorienPage() {
  let categories: Category[] = []

  try {
    const rows = (await sql`
      SELECT
        id,
        name,
        slug,
        sort_order,
        active,
        created_at,
        updated_at
      FROM public.categories
      ORDER BY sort_order ASC NULLS LAST, name ASC
    `) as CategoryRow[]

    categories = rows.map((row) => ({
      id: String(row.id),
      name: row.name ?? '',
      slug: row.slug ?? '',
      sort_order:
        row.sort_order === null ? 0 : Number(row.sort_order),
      active: row.active ?? true,
      created_at: row.created_at
        ? String(row.created_at)
        : '',
      updated_at: row.updated_at
        ? String(row.updated_at)
        : '',
    }))
  } catch (error) {
    console.error('Fehler beim Laden der Kategorien:', error)

    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold">
            Kategorien
          </h1>

          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
            Fehler beim Laden der Kategorien.
            Bitte überprüfe die Server-Konsole und die Neon-Datenbank.
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
          <section className="overflow-hidden rounded-2xl bg-white shadow">
            <div className="border-b p-6">
              <h2 className="text-xl font-semibold">
                Vorhandene Kategorien
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {categories.length} Kategorien
              </p>
            </div>

            <div>
              {categories.length > 0 ? (
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