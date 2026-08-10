import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DeleteReferenceButton from './DeleteReferenceButton'

type Reference = {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  year: number | null;
  published: boolean;
  featured: boolean;
  category_id: string | null;
  created_at: string;
  categories: {
    id: string;
    name: string;
  }[];
};

type ReferenceImage = {
  reference_id: string
  image_url: string
  sort_order: number
}

export default async function ReferenzenPage() {
  const supabase = await createClient()

  const { data: references, error } = await supabase
    .from('references')
    .select(`
      id,
      title,
      slug,
      location,
      year,
      published,
      featured,
      category_id,
      created_at,
      categories (
        id,
        name
      )
    `)
    .order('created_at', {
      ascending: false,
    })

  const { data: images, error: imagesError } =
    await supabase
      .from('reference_images')
      .select(`
        reference_id,
        image_url,
        sort_order
      `)
      .order('sort_order', {
        ascending: true,
      })

  if (error) {
    return (
      <main className="min-h-screen p-6 md:p-8">
        <div className="mx-auto max-w-7xl">

          <h1 className="text-3xl font-bold">
            Referenzen
          </h1>

          <div className="mt-6 rounded-xl bg-red-50 p-5 text-red-700">
            {error.message}
          </div>

        </div>
      </main>
    )
  }

  if (imagesError) {
    console.error(imagesError)
  }

  function getImages(referenceId: string) {
    return (
      images?.filter(
        (image) =>
          image.reference_id === referenceId
      ) || []
    )
  }

  function getCategory(reference: Reference) {
    if (Array.isArray(reference.categories)) {
      return reference.categories[0] || null
    }

    return reference.categories
  }

  return (
    <main className="min-h-screen p-6 md:p-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-bold md:text-4xl">
              Referenzen
            </h1>

            <p className="mt-2 text-gray-500">
              Projekte und Arbeiten von Mysan Jeitziner
            </p>

          </div>

          <Link
            href="/admin/referenzen/neu"
            className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
          >
            + Neue Referenz
          </Link>

        </div>

        {/* LISTE */}

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">

          {/* DESKTOP HEADER */}

          <div className="hidden border-b bg-gray-50 px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 md:grid md:grid-cols-[80px_1fr_180px_120px_140px_260px] md:items-center md:gap-4">

            <div>Bild</div>

            <div>Projekt</div>

            <div>Kategorie</div>

            <div>Jahr / Ort</div>

            <div>Status</div>

            <div className="text-right">
              Aktionen
            </div>

          </div>

          {/* EINTRÄGE */}

          {references && references.length > 0 ? (

            <div className="divide-y">

              {references.map((reference) => {

                const referenceImages =
                  getImages(reference.id)

                const mainImage =
                  referenceImages[0]?.image_url || null

                const category =
                  getCategory(reference)

                return (
                  <div
                    key={reference.id}
                    className="group px-5 py-4 transition hover:bg-gray-50"
                  >

                    {/* DESKTOP */}

                    <div className="hidden md:grid md:grid-cols-[80px_1fr_180px_120px_140px_260px] md:items-center md:gap-4">

                      {/* BILD */}

                      <div className="h-16 w-20 overflow-hidden rounded-lg bg-gray-100">

                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt={reference.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            —
                          </div>
                        )}

                      </div>

                      {/* PROJEKT */}

                      <div className="min-w-0">

                        <div className="truncate font-semibold">
                          {reference.title}
                        </div>

                        {reference.location && (
                          <div className="mt-1 truncate text-sm text-gray-500">
                            {reference.location}
                          </div>
                        )}

                        <div className="mt-1 text-xs text-gray-400">
                          {referenceImages.length}{' '}
                          {referenceImages.length === 1
                            ? 'Bild'
                            : 'Bilder'}
                        </div>

                      </div>

                      {/* KATEGORIE */}

                      <div>

                        {category ? (
                          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                            {category.name}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Keine Kategorie
                          </span>
                        )}

                      </div>

                      {/* JAHR / ORT */}

                      <div className="text-sm">

                        {reference.year && (
                          <div className="font-medium">
                            {reference.year}
                          </div>
                        )}

                        {reference.location && (
                          <div className="mt-1 text-xs text-gray-500">
                            {reference.location}
                          </div>
                        )}

                      </div>

                      {/* STATUS */}

                      <div className="flex flex-col items-start gap-2">

                        {reference.published ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Veröffentlicht
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                            Entwurf
                          </span>
                        )}

                        {reference.featured && (
                          <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                            Startseite
                          </span>
                        )}

                      </div>

                      {/* AKTIONEN */}

                      <div className="flex justify-end gap-2">

                        <Link
                          href={`/admin/referenzen/${reference.id}`}
                          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                          Bearbeiten
                        </Link>

                        <Link
                          href={`/referenzen/${reference.slug}`}
                          target="_blank"
                          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-white"
                        >
                          Anzeigen
                        </Link>

                        <DeleteReferenceButton
                          id={reference.id}
                          title={reference.title}
                        />

                      </div>

                    </div>

                    {/* MOBILE */}

                    <div className="md:hidden">

                      <div className="flex gap-4">

                        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">

                          {mainImage ? (
                            <img
                              src={mainImage}
                              alt={reference.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              Kein Bild
                            </div>
                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <h2 className="font-semibold">
                            {reference.title}
                          </h2>

                          {category && (
                            <div className="mt-2">
                              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                                {category.name}
                              </span>
                            </div>
                          )}

                          <div className="mt-2 text-sm text-gray-500">

                            {reference.location}

                            {reference.year &&
                              ` · ${reference.year}`}

                          </div>

                        </div>

                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">

                        {reference.published ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                            Veröffentlicht
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                            Entwurf
                          </span>
                        )}

                        {reference.featured && (
                          <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
                            Startseite
                          </span>
                        )}

                        <span className="text-xs text-gray-400">
                          {referenceImages.length}{' '}
                          {referenceImages.length === 1
                            ? 'Bild'
                            : 'Bilder'}
                        </span>

                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">

                        <Link
                          href={`/admin/referenzen/${reference.id}`}
                          className="flex-1 rounded-lg bg-black px-4 py-2.5 text-center text-sm font-medium text-white"
                        >
                          Bearbeiten
                        </Link>

                        <Link
                          href={`/referenzen/${reference.slug}`}
                          target="_blank"
                          className="rounded-lg border px-4 py-2.5 text-sm font-medium"
                        >
                          Anzeigen
                        </Link>

                        <DeleteReferenceButton
                          id={reference.id}
                          title={reference.title}
                        />

                      </div>

                    </div>

                  </div>
                )
              })}

            </div>

          ) : (

            <div className="p-12 text-center">

              <div className="text-lg font-semibold">
                Noch keine Referenzen
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Erstelle deine erste Referenz.
              </p>

              <Link
                href="/admin/referenzen/neu"
                className="mt-5 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                + Neue Referenz
              </Link>

            </div>

          )}

        </div>

      </div>

    </main>
  )
}