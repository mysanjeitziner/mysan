import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Category = {
  id: string;
  name: string;
};

type Reference = {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  year: number | null;
  published: boolean;
  featured: boolean;
  created_at: string;
  categories: Category | Category[] | null;
};

const BLUE = "#1dabff";

export default async function AdminReferenzenPage() {
  const supabase = await createClient();

  // Anmeldung prüfen
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  // Referenzen aus Supabase laden
  const { data, error } = await supabase
    .from("references")
    .select(`
      id,
      title,
      slug,
      location,
      year,
      published,
      featured,
      created_at,
      categories (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false });

  const references = (data ?? []) as Reference[];

  const publishedCount = references.filter(
    (item) => item.published
  ).length;

  const draftCount = references.filter(
    (item) => !item.published
  ).length;

  return (
    <main className="min-h-screen bg-[#F4F7FA] text-[#222222]">
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">

        {/* HEADER */}
        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: BLUE }}
            >
              mySan Jeitziner · Admin
            </p>

            <h1 className="text-3xl font-light tracking-tight md:text-4xl">
              Referenzen
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Verwalte deine Projekte und Referenzen.
            </p>
          </div>

          <Link
            href="/admin/referenzen/neu"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: BLUE }}
          >
            <span className="text-lg">+</span>
            Neue Referenz
          </Link>
        </header>

        {/* STATISTIKEN */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Referenzen gesamt"
            value={references.length}
          />

          <StatCard
            label="Veröffentlicht"
            value={publishedCount}
            color="text-green-600"
          />

          <StatCard
            label="Entwürfe"
            value={draftCount}
            color="text-amber-600"
          />
        </section>

        {/* FEHLERMELDUNG */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            <p className="font-semibold">
              Die Referenzen konnten nicht geladen werden.
            </p>
            <p className="mt-2">{error.message}</p>
          </div>
        )}

        {/* REFERENZLISTE */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="flex flex-col gap-2 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Alle Referenzen
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {references.length} Einträge
              </p>
            </div>
          </div>

          {!error && references.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mb-4 text-4xl">▧</div>

              <h3 className="font-semibold">
                Noch keine Referenzen vorhanden
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Erstelle deine erste Referenz.
              </p>

              <Link
                href="/admin/referenzen/neu"
                className="mt-5 inline-flex rounded-full px-5 py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: BLUE }}
              >
                Neue Referenz erstellen
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      Referenz
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Kategorie
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Ort / Jahr
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right font-medium">
                      Aktion
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {references.map((item) => {
                    const category = Array.isArray(item.categories)
                      ? item.categories[0]
                      : item.categories;

                    return (
                      <tr
                        key={item.id}
                        className="transition hover:bg-gray-50"
                      >
                        {/* TITEL */}
                        <td className="px-6 py-5">
                          <div className="font-semibold text-gray-900">
                            {item.title}
                          </div>

                          <div className="mt-1 text-xs text-gray-400">
                            /referenzen/{item.slug}
                          </div>

                          {item.featured && (
                            <span className="mt-2 inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                              Hervorgehoben
                            </span>
                          )}
                        </td>

                        {/* KATEGORIE */}
                        <td className="px-6 py-5 text-gray-600">
                          {category?.name ?? "–"}
                        </td>

                        {/* ORT / JAHR */}
                        <td className="px-6 py-5 text-gray-600">
                          {[item.location, item.year]
                            .filter(
                              (value) =>
                                value !== null &&
                                value !== undefined &&
                                value !== ""
                            )
                            .join(" · ") || "–"}
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">
                          {item.published ? (
                            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                              <span>●</span>
                              Veröffentlicht
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                              <span>●</span>
                              Entwurf
                            </span>
                          )}
                        </td>

                        {/* AKTIONEN */}
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/referenzen/${item.slug}`}
                              target="_blank"
                              className="text-gray-400 transition hover:text-gray-700"
                              title="Öffentliche Referenz ansehen"
                              aria-label="Öffentliche Referenz ansehen"
                            >
                              ↗
                            </Link>

                            <Link
                              href={`/admin/referenzen/${item.slug}`}
                              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 font-medium transition hover:border-[#1dabff] hover:text-[#168ed6]"
                            >
                              Bearbeiten
                              <span>→</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <div className="mt-8">
          <Link
            href="/admin"
            className="text-sm text-gray-500 transition hover:text-[#1dabff]"
          >
            ← Zurück zum Admin-Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  color = "text-gray-900",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${color}`}>
        {value}
      </p>
    </div>
  );
}
