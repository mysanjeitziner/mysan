
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NeueNewsPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function handleFile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Bitte wähle ein JPG-, PNG- oder WebP-Bild.");
      event.target.value = "";
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Das Bild darf maximal 10 MB gross sein.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      if (!title.trim()) {
        throw new Error("Bitte einen Titel eingeben.");
      }

      if (!createSlug(title)) {
        throw new Error(
          "Aus dem Titel konnte kein gültiger Slug erstellt werden."
        );
      }

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("excerpt", excerpt.trim());
      formData.append("content", content.trim());
      formData.append("published", String(published));
      formData.append("featured", String(featured));

      if (file) {
        formData.append("file", file);
      }

      const response = await fetch("/api/admin/news", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Die News konnte nicht gespeichert werden."
        );
      }

      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      console.error("NEWS SAVE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Die News konnte nicht gespeichert werden."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Zurück
          </button>

          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            Neue News
          </h1>

          <p className="mt-2 text-gray-500">
            Neue Meldung für mySan Jeitziner GmbH erstellen
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* TEXT */}

          <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-semibold">Inhalt</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Titel *
                </label>

                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                  placeholder="z. B. Neue Wärmepumpenanlage in Brig"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Kurzbeschreibung
                </label>

                <textarea
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  rows={3}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                  placeholder="Kurze Zusammenfassung der News..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Inhalt
                </label>

                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={12}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                  placeholder="Hier den vollständigen Text eingeben..."
                />
              </div>
            </div>
          </section>

          {/* BILD */}

          <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-semibold">Titelbild</h2>

            <p className="mt-2 text-sm text-gray-500">
              Ein Bild für die News auswählen.
            </p>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center hover:bg-gray-50">
              <span className="text-lg font-medium">
                Bild auswählen
              </span>

              <span className="mt-2 text-sm text-gray-500">
                JPG, PNG oder WebP · maximal 10 MB
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFile}
                className="hidden"
              />
            </label>

            {file && (
              <p className="mt-3 text-sm text-gray-600">
                Ausgewählt: {file.name}
              </p>
            )}

            {preview && (
              <div className="mt-6 overflow-hidden rounded-xl">
                <img
                  src={preview}
                  alt="Vorschau"
                  className="max-h-[400px] w-full object-cover"
                />
              </div>
            )}
          </section>

          {/* VERÖFFENTLICHUNG */}

          <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-semibold">
              Veröffentlichung
            </h2>

            <div className="mt-6 space-y-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(event) =>
                    setPublished(event.target.checked)
                  }
                  className="h-5 w-5"
                />

                <span>News veröffentlichen</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) =>
                    setFeatured(event.target.checked)
                  }
                  className="h-5 w-5"
                />

                <span>Auf der Startseite anzeigen</span>
              </label>
            </div>
          </section>

          {/* FEHLER */}

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* BUTTONS */}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="rounded-lg border bg-white px-6 py-3 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Abbrechen
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-black px-8 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Speichern..." : "News speichern"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
