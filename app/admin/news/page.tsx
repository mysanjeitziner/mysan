import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function NewsPage() {
  const supabase = await createClient()

  const { data: news, error } = await supabase
    .from('news')
    .select(`
      id,
      title,
      slug,
      excerpt,
      image_url,
      published,
      featured,
      created_at
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main className="p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold">
            News
          </h1>

          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">
            {error.message}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold md:text-4xl">
              News
            </h1>

            <p className="mt-2 text-gray-500">
              Neuigkeiten und aktuelle Informationen von Mysan Jeitziner
            </p>
          </div>

          <Link
            href="/admin/news/neu"
            className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            + Neue News
          </Link>

        </div>

        {/* NEWS */}

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">

          {news && news.length > 0 ? (

            <div className="divide-y">

              {news.map((item) => (

                <div
                  key={item.id}
                  className="flex flex-col gap-5 p-5 transition hover:bg-gray-50 md:flex-row md:items-center"
                >

                  {/* BILD */}

                  <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 md:w-36">

                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        Kein Bild
                      </div>
                    )}

                  </div>

                  {/* INHALT */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="font-semibold">
                        {item.title}
                      </h2>

                      {item.featured && (
                        <span className="rounded-full bg-black px-2.5 py-1 text-xs text-white">
                          Startseite
                        </span>
                      )}

                    </div>

                    {item.excerpt && (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                        {item.excerpt}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(
                        item.created_at
                      ).toLocaleDateString('de-CH')}
                    </p>

                  </div>

                  {/* STATUS */}

                  <div className="shrink-0">

                    {item.published ? (
                      <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
                        Veröffentlicht
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
                        Entwurf
                      </span>
                    )}

                  </div>

                  {/* BEARBEITEN */}

                  <Link
                    href={`/admin/news/${item.id}`}
                    className="shrink-0 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-white"
                  >
                    Bearbeiten
                  </Link>

                </div>

              ))}

            </div>

          ) : (

            <div className="p-12 text-center">

              <div className="text-lg font-medium">
                Noch keine News vorhanden
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Erstelle deine erste News.
              </p>

              <Link
                href="/admin/news/neu"
                className="mt-5 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                + Neue News
              </Link>

            </div>

          )}

        </div>

      </div>
    </main>
  )
}