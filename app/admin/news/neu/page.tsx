'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function NeueNewsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')

  const [published, setPublished] = useState(false)
  const [featured, setFeatured] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleFile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0]

    if (!selectedFile) return

    setFile(selectedFile)
    setPreview(
      URL.createObjectURL(selectedFile)
    )
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setLoading(true)
    setError('')

    try {
      if (!title.trim()) {
        throw new Error(
          'Bitte einen Titel eingeben.'
        )
      }

      const slug = createSlug(title)

      if (!slug) {
        throw new Error(
          'Aus dem Titel konnte kein gültiger Slug erstellt werden.'
        )
      }

      /*
       * 1. NEWS ERSTELLEN
       */

      const {
        data: news,
        error: newsError,
      } = await supabase
        .from('news')
        .insert({
          title: title.trim(),
          slug,
          excerpt:
            excerpt.trim() || null,
          content:
            content.trim() || null,
          published,
          featured,
        })
        .select()
        .single()

      if (newsError) {
        throw newsError
      }

      /*
       * 2. BILD HOCHLADEN
       */

      if (file) {

        const extension =
          file.name
            .split('.')
            .pop()
            ?.toLowerCase() || 'jpg'

        const filePath =
          `news/${news.id}/image.${extension}`

        const {
          error: uploadError,
        } = await supabase.storage
          .from('images')
          .upload(
            filePath,
            file,
            {
              cacheControl: '3600',
              upsert: true,
            }
          )

        if (uploadError) {
          throw uploadError
        }

        /*
         * 3. ÖFFENTLICHE URL
         */

        const {
          data: publicUrlData,
        } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)

        /*
         * 4. NEWS AKTUALISIEREN
         */

        const {
          error: updateError,
        } = await supabase
          .from('news')
          .update({
            image_url:
              publicUrlData.publicUrl,
            updated_at:
              new Date().toISOString(),
          })
          .eq('id', news.id)

        if (updateError) {
          throw updateError
        }
      }

      router.push('/admin/news')
      router.refresh()

    } catch (err) {
      console.error(err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(
          'Die News konnte nicht gespeichert werden.'
        )
      }

      setLoading(false)
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
            Neue Meldung für Mysan Jeitziner erstellen
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* TEXT */}

          <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="text-xl font-semibold">
              Inhalt
            </h2>

            <div className="mt-6 space-y-5">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Titel *
                </label>

                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
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
                  onChange={(event) =>
                    setExcerpt(event.target.value)
                  }
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
                  onChange={(event) =>
                    setContent(event.target.value)
                  }
                  rows={12}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                  placeholder="Hier den vollständigen Text eingeben..."
                />

              </div>

            </div>

          </section>

          {/* BILD */}

          <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="text-xl font-semibold">
              Titelbild
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Ein Bild für die News auswählen.
            </p>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center hover:bg-gray-50">

              <span className="text-lg font-medium">
                Bild auswählen
              </span>

              <span className="mt-2 text-sm text-gray-500">
                JPG, PNG oder WEBP
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFile}
                className="hidden"
              />

            </label>

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
                    setPublished(
                      event.target.checked
                    )
                  }
                  className="h-5 w-5"
                />

                <span>
                  News veröffentlichen
                </span>

              </label>

              <label className="flex cursor-pointer items-center gap-3">

                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) =>
                    setFeatured(
                      event.target.checked
                    )
                  }
                  className="h-5 w-5"
                />

                <span>
                  Auf der Startseite anzeigen
                </span>

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
              className="rounded-lg border bg-white px-6 py-3 font-medium hover:bg-gray-50"
            >
              Abbrechen
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-black px-8 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading
                ? 'Speichern...'
                : 'News speichern'}
            </button>

          </div>

        </form>

      </div>

    </main>
  )
}