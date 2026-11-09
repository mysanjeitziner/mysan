
'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

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

  // News aus Neon über die geschützte API laden.
  useEffect(() => {
    let cancelled = false

    async function loadNews() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `/api/admin/news/${encodeURIComponent(id)}`,
          { cache: 'no-store' }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Die News konnte nicht geladen werden.')
        }

        if (cancelled) return

        setNews(data)
        setTitle(data.title || '')
        setExcerpt(data.excerpt || '')
        setContent(data.content || '')
        setPublished(Boolean(data.published))
        setFeatured(Boolean(data.featured))
        setImageUrl(data.image_url || '')
        setPreview(data.image_url || '')
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Die News konnte nicht geladen werden.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (id) loadNews()

    return () => {
      cancelled = true
    }
  }, [id])

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
      setError('Bitte ein JPG-, PNG- oder WEBP-Bild auswählen.')
      event.target.value = ''
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Das Bild darf maximal 10 MB gross sein.')
      event.target.value = ''
      return
    }

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setSuccess('')
    setError('')
  }

  function removeImage() {
    setFile(null)
    setImageUrl('')
    setPreview('')
    setSuccess('')
    setError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (!title.trim()) {
        throw new Error('Bitte einen Titel eingeben.')
      }

      if (!createSlug(title)) {
        throw new Error('Aus dem Titel konnte kein gültiger URL-Slug erstellt werden.')
      }

      const formData = new FormData()
      formData.set('title', title.trim())
      formData.set('excerpt', excerpt.trim())
      formData.set('content', content.trim())
      formData.set('published', String(published))
      formData.set('featured', String(featured))
      formData.set('image_url', imageUrl)

      if (file) {
        formData.set('file', file)
      }

      const response = await fetch(
        `/api/admin/news/${encodeURIComponent(id)}`,
        {
          method: 'PUT',
          body: formData,
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Die News konnte nicht gespeichert werden.')
      }

      const updatedNews = result.news as NewsItem

      setNews(updatedNews)
      setTitle(updatedNews.title || '')
      setExcerpt(updatedNews.excerpt || '')
      setContent(updatedNews.content || '')
      setPublished(Boolean(updatedNews.published))
      setFeatured(Boolean(updatedNews.featured))
      setImageUrl(updatedNews.image_url || '')
      setPreview(updatedNews.image_url || '')
      setFile(null)

      setSuccess(
        'Die News wurde erfolgreich in Neon gespeichert.'
      )

      router.refresh()
    } catch (err) {
      console.error('News speichern:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Die News konnte nicht gespeichert werden.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Möchtest du die News "${title}" wirklich löschen?\n\nDie News wird aus der Datenbank entfernt. Zugehörige Bilder werden ebenfalls entfernt.`
    )

    if (!confirmed) return

    setDeleting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(
        `/api/admin/news/${encodeURIComponent(id)}`,
        { method: 'DELETE' }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Die News konnte nicht gelöscht werden.')
      }

      router.push('/admin/news')
      router.refresh()
    } catch (err) {
      console.error('News löschen:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Die News konnte nicht gelöscht werden.'
      )
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-6 md:p-8">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
          News wird geladen ...
        </div>
      </main>
    )
  }

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
              <p className="mt-2 text-gray-500">{news.title}</p>
            </div>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              {deleting ? 'Löschen ...' : 'News löschen'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  URL
                </label>
                <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  /news/{createSlug(title)}
                </div>
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
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Inhalt
                </label>
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={14}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-semibold">Titelbild</h2>
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
                <span className="text-lg font-medium">Bild auswählen</span>
                <span className="mt-2 text-sm text-gray-500">
                  JPG, PNG oder WEBP · maximal 10 MB
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

            {file && (
              <p className="mt-3 text-sm text-gray-500">
                Neues Bild ausgewählt: {file.name}
              </p>
            )}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-semibold">Veröffentlichung</h2>

            <div className="mt-6 space-y-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(event) => setPublished(event.target.checked)}
                  className="h-5 w-5"
                />
                <span>News veröffentlichen</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) => setFeatured(event.target.checked)}
                  className="h-5 w-5"
                />
                <span>Auf der Startseite anzeigen</span>
              </label>
            </div>
          </section>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-green-50 p-4 text-green-700">
              {success}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/news"
              className="rounded-xl border bg-white px-6 py-3 text-center font-medium hover:bg-gray-50"
            >
              Abbrechen
            </Link>

            <button
              type="submit"
              disabled={saving || deleting}
              className="rounded-xl bg-black px-8 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Speichern ...' : 'Änderungen speichern'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
