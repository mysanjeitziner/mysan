
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function ReferenzPage({
  params,
}: PageProps) {
  const { slug } = await params

  const supabase = await createClient()

  /*
   * REFERENZ LADEN
   */

  const {
    data: reference,
    error,
  } = await supabase
    .from('references')
    .select(`
      id,
      title,
      slug,
      location,
      year,
      description,
      published,
      featured,
      categories (
        id,
        name
      )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !reference) {
    notFound()
  }

  /*
   * BILDER LADEN
   */

  const {
    data: images,
  } = await supabase
    .from('reference_images')
    .select(`
      id,
      image_url,
      sort_order
    `)
    .eq('reference_id', reference.id)
    .order('sort_order', {
      ascending: true,
    })

  /*
   * KATEGORIE
   */

  const category = Array.isArray(
    reference.categories
  )
    ? reference.categories[0]
    : reference.categories

  return (
    <main className="min-h-screen bg-white">

      {/* HEADER */}

      <section className="border-b">

        <div className="mx-auto max-w-7xl px-6 py-6 md:px-8">

          <Link
            href="/referenzen"
            className="text-sm text-gray-500 transition hover:text-black"
          >
            ← Alle Referenzen
          </Link>

        </div>

      </section>

      {/* TITEL */}

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-10 md:px-8 md:pb-14 md:pt-14">

        <div className="max-w-4xl">

          {category && (
            <div className="mb-4">

              <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                {category.name}
              </span>

            </div>
          )}

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {reference.title}
          </h1>

          {(reference.location ||
            reference.year) && (

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-gray-500">

              {reference.location && (
                <span>
                  {reference.location}
                </span>
              )}

              {reference.year && (
                <span>
                  {reference.year}
                </span>
              )}

            </div>

          )}

        </div>

      </section>

      {/* HAUPTBILD */}

      {images && images.length > 0 && (

        <section className="mx-auto max-w-7xl px-6 md:px-8">

          <div className="overflow-hidden rounded-2xl bg-gray-100">

            <img
              src={images[0].image_url}
              alt={reference.title}
              className="max-h-[75vh] w-full object-cover"
            />

          </div>

        </section>

      )}

      {/* BESCHREIBUNG */}

      {reference.description && (

        <section className="mx-auto max-w-4xl px-6 py-12 md:px-8 md:py-16">

          <div className="whitespace-pre-line text-lg leading-8 text-gray-700">
            {reference.description}
          </div>

        </section>

      )}

      {/* BILDERGALERIE */}

      {images && images.length > 1 && (

        <section className="mx-auto max-w-7xl px-6 pb-16 md:px-8 md:pb-24">

          <h2 className="mb-6 text-2xl font-semibold">
            Weitere Bilder
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {images
              .slice(1)
              .map((image, index) => (

                <div
                  key={image.id}
                  className="overflow-hidden rounded-2xl bg-gray-100"
                >

                  <img
                    src={image.image_url}
                    alt={`${reference.title} – Bild ${index + 2}`}
                    className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-105"
                  />

                </div>

              ))}

          </div>

        </section>

      )}

      {/* ZURÜCK */}

      <section className="border-t">

        <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">

          <Link
            href="/referenzen"
            className="font-medium hover:underline"
          >
            ← Zurück zu allen Referenzen
          </Link>

        </div>

      </section>

    </main>
  )
}

