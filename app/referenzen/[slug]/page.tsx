import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/neon";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Reference = {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  year: number | null;
  description: string | null;
  published: boolean;
  featured: boolean;
  category_id: string | null;
  category_name: string | null;
};

type ReferenceImage = {
  id: string;
  image_url: string;
  sort_order: number;
};

export default async function ReferenzPage({
  params,
}: PageProps) {
  const { slug } = await params;

  /*
   * REFERENZ AUS NEON LADEN
   */
  let reference: Reference | null = null;

  try {
    const references = (await sql`
      SELECT
        r.id,
        r.title,
        r.slug,
        r.location,
        r.year,
        r.description,
        r.published,
        r.featured,
        r.category_id,
        c.name AS category_name
      FROM public."references" AS r
      LEFT JOIN public.categories AS c
        ON c.id = r.category_id
      WHERE r.slug = ${slug}
        AND r.published = true
      LIMIT 1
    `) as Reference[];

    reference = references[0] ?? null;
  } catch (error) {
    console.error("NEON REFERENZ DETAIL FEHLER:", error);

    throw new Error(
      "Die Referenz konnte nicht aus der Datenbank geladen werden."
    );
  }

  if (!reference) {
    notFound();
  }

  /*
   * BILDER AUS NEON LADEN
   */
  let images: ReferenceImage[] = [];

  try {
    images = (await sql`
      SELECT
        id,
        image_url,
        sort_order
      FROM public.reference_images
      WHERE reference_id = ${reference.id}
      ORDER BY sort_order ASC
    `) as ReferenceImage[];
  } catch (error) {
    console.error("NEON REFERENZBILDER FEHLER:", error);

    throw new Error(
      "Die Bilder der Referenz konnten nicht geladen werden."
    );
  }

  /*
   * KATEGORIE
   */
  const category = reference.category_name
    ? { name: reference.category_name }
    : null;

  return (
    <main className="min-h-screen bg-white text-[#222222]">
      {/* HEADER */}
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-6 md:px-8">
          <Link
            href="/referenzen"
            className="text-sm text-gray-500 transition hover:text-[#3C70B7]"
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
              <span className="rounded-full bg-[#F4F7FA] px-4 py-2 text-sm font-medium text-[#3C70B7]">
                {category.name}
              </span>
            </div>
          )}

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {reference.title}
          </h1>

          {(reference.location || reference.year) && (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-gray-500">
              {reference.location && (
                <span>{reference.location}</span>
              )}

              {reference.year && (
                <span>{reference.year}</span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* HAUPTBILD */}
      {images.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={images[0].image_url}
              alt={reference.title}
              className="max-h-[85vh] w-full rounded-2xl object-cover"
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
      {images.length > 1 && (
        <section className="mx-auto max-w-7xl px-6 pb-16 md:px-8 md:pb-24">
          <h2 className="mb-6 text-2xl font-semibold">
            Weitere Bilder
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {images.slice(1).map((image, index) => (
              <div
                key={image.id}
                className="h-[350px] overflow-hidden rounded-2xl bg-gray-100 md:h-[450px]"
              >
                <img
                  src={image.image_url}
                  alt={`${reference.title} – Bild ${index + 2}`}
                  className="h-full w-full rounded-2xl object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ZURÜCK */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">
          <Link
            href="/referenzen"
            className="font-medium text-[#3C70B7] transition hover:underline"
          >
            ← Zurück zu allen Referenzen
          </Link>
        </div>
      </section>
    </main>
  );
}
