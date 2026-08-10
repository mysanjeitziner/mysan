'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type NewsItem = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  image_url: string | null
  published: boolean
  featured: boolean
}

function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function NewsBearbeitenPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  const id = params.id as string

  const [news, setNews] = useState<NewsItem | null>(null)

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')

  const [published, setPublished] = useState(false)
  const [featured, setFeatured] = useState(false)

  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  /*
   * NEWS LADEN
   */

  useEffect(() => {
    async function loadNews() {
      const {
        data,
        error,
      } = await supabase
        .from('news')
        .select(`
          id,
          title,
          slug,
          excerpt,
          content,
          image_url,
          published,
          featured
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error(error)
        setError(
          'Die News konnte nicht geladen werden.'
        )
        setLoading(false)
        return
      }

      setNews(data)

      setTitle(data.title || '')
      setExcerpt(data.excerpt || '')
      setContent(data.content || '')
      setPublished(data.published)
      setFeatured(data.featured)

      if (data.image_url) {
        setImageUrl(data.image_url)
        setPreview(data.image_url)
      }

      setLoading(false)
    }

    if (id) {
      loadNews()
    }
  }, [id, supabase])

  /*
   * BILD AUSWÄHLEN
   */

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

    setSuccess('')
    setError('')
  }

  /*
   * BILD ENTFERNEN
   */

  function removeImage() {
    setFile(null)
    setImageUrl('')
    setPreview('')
  }

  /*
   * SPEICHERN
   */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setSaving(true)
    setError('')
    setSuccess('')

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
       * BILD HOCHLADEN
       */

      let finalImageUrl = imageUrl || null

      if (file) {
        const extension =
          file.name
            .split('.')
            .pop()
            ?.toLowerCase() || 'jpg'

        const filePath =
          `news/${id}/image.${extension}`

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

        const {
          data: publicUrlData,
        } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)

        finalImageUrl =
          `${publicUrlData.publicUrl}?v=${Date.now()}`
      }

      /*
       * NEWS AKTUALISIEREN
       */

      const {
        error: updateError,
      } = await supabase
        .from('news')
        .update({
          title: title.trim(),
          slug,
          excerpt:
            excerpt.trim() || null,
          content:
            content.trim() || null,
          image_url: finalImageUrl,
          published,
          featured,
          updated_at:
            new Date().toISOString(),
        })
        .eq('id', id)

      if (updateError) {
        throw updateError
      }

      setNews((current) =>
        current
          ? {
              ...current,
              title: title.trim(),
              slug,
              excerpt:
                excerpt.trim() || null,
              content:
                content.trim() || null,
              image_url: finalImageUrl,
              published,
              featured,
            }
          : current
      )

      setImageUrl(
        finalImageUrl || ''
      )

      setFile(null)

      setSuccess(
        'Die News wurde erfolgreich gespeichert.'
      )

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
    } finally {
      setSaving(false)
    }
  }

  /*
   * NEWS LÖSCHEN
   */

 async function handleDelete() {
  const confirmed = window.confirm(
    `Möchtest du die News "${title}" wirklich löschen?\n\nDie News und alle dazugehörigen Bilder werden endgültig gelöscht.`
  )

  if (!confirmed) return

  setDeleting(true)
  setError('')

  try {
    /*
     * 1. ALLE BILDER DER NEWS AUS STORAGE LADEN
     */

    const {
      data: storageFiles,
      error: storageListError,
    } = await supabase.storage
      .from('images')
      .list(`news/${id}`, {
        limit: 100,
      })

    if (storageListError) {
      console.error(
        'Storage-Dateien konnten nicht geladen werden:',
        storageListError
      )
    }

    /*
     * 2. ALLE BILDER LÖSCHEN
     */

    if (storageFiles && storageFiles.length > 0) {
      const filePaths = storageFiles.map(
        (file) => `news/${id}/${file.name}`
      )

      const {
        error: storageDeleteError,
      } = await supabase.storage
        .from('images')
        .remove(filePaths)

      if (storageDeleteError) {
        throw new Error(
          `Die Bilder konnten nicht gelöscht werden: ${storageDeleteError.message}`
        )
      }
    }

    /*
     * 3. NEWS AUS DATENBANK LÖSCHEN
     */

    const {
      error: deleteError,
    } = await supabase
      .from('news')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw new Error(
        `Die News konnte nicht gelöscht werden: ${deleteError.message}`
      )
    }

    /*
     * 4. ZUR NEWS-ÜBERSICHT
     */

    router.push('/admin/news')
    router.refresh()

  } catch (err) {
    console.error(err)

    if (err instanceof Error) {
      setError(err.message)
    } else {
      setError(
        'Die News konnte nicht gelöscht werden.'
      )
    }

    setDeleting(false)
  }
}
  /*
   * LADEN
   */

  if (loading) {
    return (
      <main className="min-h-screen p-6 md:p-8">

        <div className="mx-auto max-w-4xl">

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            News wird geladen...
          </div>

        </div>

      </main>
    )
  }

  /*
   * FEHLER / NICHT GEFUNDEN
   */

  if (!news) {
    return (
      <main className="min-h-screen p-6 md:p-8">

        <div className="mx-auto max-w-4xl">

          <div className="rounded-2xl bg-red-50 p-6 text-red-700">
            {error || 'News nicht gefunden.'}
          </div>

          <Link
            href="/admin/news"
            className="mt-4 inline-block text-sm font-medium hover:underline"
          >
            ← Zurück zu News
          </Link>

        </div>

      </main>
    )
  }

  return (
    <main className="min-h-screen p-6 md:p-8">

      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="mb-8">

          <Link
            href="/admin/news"
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Zurück zu News
          </Link>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

            <div>

              <h1 className="text-3xl font-bold md:text-4xl">
                News bearbeiten
              </h1>

              <p className="mt-2 text-gray-500">
                {news.title}
              </p>

            </div>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              {deleting
                ? 'Löschen...'
                : 'News löschen'}
            </button>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* INHALT */}

          <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">

            <h2 className="text-xl font-semibold">
              Inhalt
            </h2>

            <div className="mt-6 space-y-5">

              {/* TITEL */}

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
                />

              </div>

              {/* SLUG */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  URL
                </label>

                <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  /news/{createSlug(title)}
                </div>

              </div>

              {/* KURZBESCHREIBUNG */}

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
                />

              </div>

              {/* INHALT */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Inhalt
                </label>

                <textarea
                  value={content}
                  onChange={(event) =>
                    setContent(event.target.value)
                  }
                  rows={14}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
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
              Das aktuelle Bild kann ersetzt oder entfernt werden.
            </p>

            {preview ? (

              <div className="relative mt-6 overflow-hidden rounded-xl">

                <img
                  src={preview}
                  alt={title}
                  className="max-h-[450px] w-full object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-4 top-4 rounded-lg bg-white px-4 py-2 text-sm font-medium shadow hover:bg-red-50 hover:text-red-600"
                >
                  Bild entfernen
                </button>

              </div>

            ) : (

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

            )}

            {preview && !file && (
              <label className="mt-4 inline-flex cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">

                Bild ersetzen

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFile}
                  className="hidden"
                />

              </label>
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

          {/* ERFOLG */}

          {success && (
            <div className="rounded-xl bg-green-50 p-4 text-green-700">
              {success}
            </div>
          )}

          {/* BUTTONS */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              href="/admin/news"
              className="rounded-xl border bg-white px-6 py-3 text-center font-medium hover:bg-gray-50"
            >
              Abbrechen
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-black px-8 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving
                ? 'Speichern...'
                : 'Änderungen speichern'}
            </button>

          </div>

        </form>

      </div>

    </main>
  )
}