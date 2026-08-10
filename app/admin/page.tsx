import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    referencesResult,
    categoriesResult,
    newsResult,
  ] = await Promise.all([
    supabase
      .from('references')
      .select('id, title, created_at, published')
      .order('created_at', { ascending: false }),

    supabase
      .from('categories')
      .select('id, name, active'),

    supabase
      .from('news')
      .select('id, title, created_at, published')
      .order('created_at', { ascending: false }),
  ])

  const references = referencesResult.data || []
  const categories = categoriesResult.data || []
  const news = newsResult.data || []

  const publishedReferences =
    references.filter(
      (reference) => reference.published
    ).length

  const publishedNews =
    news.filter(
      (item) => item.published
    ).length

  return (
    <main className="min-h-screen p-6 md:p-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold md:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Willkommen im Mysan Jeitziner Admin-Bereich.
          </p>

        </div>

        {/* STATISTIK */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* REFERENZEN */}

          <Link
            href="/admin/referenzen"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Referenzen
                </p>

                <p className="mt-2 text-4xl font-bold">
                  {references.length}
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                ▧
              </div>

            </div>

            <p className="mt-4 text-sm text-gray-500">
              {publishedReferences} veröffentlicht
            </p>

          </Link>

          {/* KATEGORIEN */}

          <Link
            href="/admin/kategorien"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Kategorien
                </p>

                <p className="mt-2 text-4xl font-bold">
                  {categories.length}
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                ☷
              </div>

            </div>

            <p className="mt-4 text-sm text-gray-500">
              {
                categories.filter(
                  (category) => category.active
                ).length
              } aktiv
            </p>

          </Link>

          {/* NEWS */}

          <Link
            href="/admin/news"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  News
                </p>

                <p className="mt-2 text-4xl font-bold">
                  {news.length}
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                ◫
              </div>

            </div>

            <p className="mt-4 text-sm text-gray-500">
              {publishedNews} veröffentlicht
            </p>

          </Link>

        </div>

        {/* UNTERER BEREICH */}

        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          {/* LETZTE REFERENZEN */}

          <section className="rounded-2xl bg-white shadow-sm">

            <div className="flex items-center justify-between border-b p-6">

              <div>
                <h2 className="text-xl font-semibold">
                  Letzte Referenzen
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Zuletzt erfasste Projekte
                </p>
              </div>

              <Link
                href="/admin/referenzen"
                className="text-sm font-medium hover:underline"
              >
                Alle anzeigen →
              </Link>

            </div>

            <div>

              {references.length > 0 ? (
                references
                  .slice(0, 5)
                  .map((reference) => (
                    <Link
                      key={reference.id}
                      href={`/admin/referenzen/${reference.id}`}
                      className="flex items-center justify-between border-b px-6 py-4 last:border-0 hover:bg-gray-50"
                    >

                      <div className="min-w-0">

                        <p className="truncate font-medium">
                          {reference.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(
                            reference.created_at
                          ).toLocaleDateString(
                            'de-CH'
                          )}
                        </p>

                      </div>

                      {reference.published ? (
                        <span className="ml-4 shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                          Veröffentlicht
                        </span>
                      ) : (
                        <span className="ml-4 shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                          Entwurf
                        </span>
                      )}

                    </Link>
                  ))
              ) : (
                <div className="p-8 text-center text-sm text-gray-500">
                  Noch keine Referenzen vorhanden.
                </div>
              )}

            </div>

          </section>

          {/* LETZTE NEWS */}

          <section className="rounded-2xl bg-white shadow-sm">

            <div className="flex items-center justify-between border-b p-6">

              <div>
                <h2 className="text-xl font-semibold">
                  Letzte News
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Zuletzt veröffentlichte Meldungen
                </p>
              </div>

              <Link
                href="/admin/news"
                className="text-sm font-medium hover:underline"
              >
                Alle anzeigen →
              </Link>

            </div>

            <div>

              {news.length > 0 ? (
                news
                  .slice(0, 5)
                  .map((item) => (
                    <Link
                      key={item.id}
                      href={`/admin/news/${item.id}`}
                      className="flex items-center justify-between border-b px-6 py-4 last:border-0 hover:bg-gray-50"
                    >

                      <div className="min-w-0">

                        <p className="truncate font-medium">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(
                            item.created_at
                          ).toLocaleDateString(
                            'de-CH'
                          )}
                        </p>

                      </div>

                      {item.published ? (
                        <span className="ml-4 shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                          Veröffentlicht
                        </span>
                      ) : (
                        <span className="ml-4 shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                          Entwurf
                        </span>
                      )}

                    </Link>
                  ))
              ) : (
                <div className="p-8 text-center text-sm text-gray-500">
                  Noch keine News vorhanden.
                </div>
              )}

            </div>

          </section>

        </div>

      </div>

    </main>
  )
}