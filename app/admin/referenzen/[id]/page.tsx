
'use client'

import {
  type FormEvent,
  type ChangeEvent,
  useEffect,
  useState,
} from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type Category = {
  id: string
  name: string
  slug: string
  sort_order: number
  active: boolean
}

type ReferenceImage = {
  id: string
  image_url: string
  sort_order: number
}

type Reference = {
  id: string
  title: string
  slug: string
  category_id: string | null
  location: string | null
  year: number | null
  description: string | null
  published: boolean
  featured: boolean
}

export default function ReferenzBearbeitenPage() {
  const params = useParams()
  const router = useRouter()

  const id = String(params.id ?? '')

  const [reference, setReference] = useState<Reference | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<ReferenceImage[]>([])

  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [location, setLocation] = useState('')
  const [year, setYear] = useState('')
  const [description, setDescription] = useState('')
  const [published, setPublished] = useState(false)
  const [featured, setFeatured] = useState(false)

  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  /*
   * SLUG ERSTELLEN
   */

  function createSlug(text: string) {
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  /*
   * DATEN AUS NEON LADEN
   * Die API prüft die Supabase-Anmeldung.
   */

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `/api/admin/referenzen/${encodeURIComponent(id)}`,
          {
            cache: 'no-store',
          }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.error ||
              'Die Referenz konnte nicht geladen werden.'
          )
        }

        if (cancelled) return

        const data = result.reference as Reference

        setReference(data)
        setCategories(result.categories || [])
        setImages(result.images || [])

        setTitle(data.title || '')
        setCategoryId(data.category_id || '')
        setLocation(data.location || '')
        setYear(data.year != null ? String(data.year) : '')
        setDescription(data.description || '')
        setPublished(Boolean(data.published))
        setFeatured(Boolean(data.featured))
      } catch (err) {
        if (cancelled) return

        console.error('Referenz laden:', err)

        setError(
          err instanceof Error
            ? err.message
            : 'Die Referenz konnte nicht geladen werden.'
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (id) {
      void loadData()
    } else {
      setError('Die Referenz-ID fehlt.')
      setLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [id])

  /*
   * NEUE BILDER AUSWÄHLEN
   */

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? [])

    if (selectedFiles.length === 0) return

    setNewFiles((current) => [...current, ...selectedFiles])

    setNewPreviews((current) => [
      ...current,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ])

    // Ermöglicht, dieselbe Datei erneut auszuwählen.
    event.target.value = ''

    setError('')
    setSuccess('')
  }

  /*
   * VORSCHAU ENTFERNEN
   */

  function removeNewImage(index: number) {
    const preview = newPreviews[index]

    if (preview) {
      URL.revokeObjectURL(preview)
    }

    setNewFiles((current) =>
      current.filter((_, i) => i !== index)
    )

    setNewPreviews((current) =>
      current.filter((_, i) => i !== index)
    )
  }

  /*
   * BESTEHENDES BILD LÖSCHEN
   * Die API entfernt es aus Neon und Cloudinary.
   */

  async function deleteImage(image: ReferenceImage) {
    const confirmed = window.confirm(
      'Möchtest du dieses Bild wirklich löschen?'
    )

    if (!confirmed) return

    setError('')
    setSuccess('')

    try {
      const response = await fetch(
        `/api/admin/referenzen/${encodeURIComponent(id)}/bilder`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageId: image.id,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.error || 'Das Bild konnte nicht gelöscht werden.'
        )
      }

      setImages((current) =>
        current.filter((item) => item.id !== image.id)
      )

      setSuccess('Bild wurde gelöscht.')
    } catch (err) {
      console.error('Bild löschen:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Das Bild konnte nicht gelöscht werden.'
      )
    }
  }

  /*
   * BILDERREIHENFOLGE ÄNDERN
   */

  async function moveImage(
    index: number,
    direction: 'up' | 'down'
  ) {
    const newImages = [...images]

    const targetIndex =
      direction === 'up' ? index - 1 : index + 1

    if (
      targetIndex < 0 ||
      targetIndex >= newImages.length
    ) {
      return
    }

    const current = newImages[index]
    newImages[index] = newImages[targetIndex]
    newImages[targetIndex] = current

    const updatedImages = newImages.map((image, imageIndex) => ({
      ...image,
      sort_order: imageIndex,
    }))

    const previousImages = images

    setImages(updatedImages)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(
        `/api/admin/referenzen/${encodeURIComponent(id)}/bilder`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            images: updatedImages.map((image) => ({
              id: image.id,
              sort_order: image.sort_order,
            })),
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            'Die Bildreihenfolge konnte nicht gespeichert werden.'
        )
      }
    } catch (err) {
      console.error('Bildreihenfolge speichern:', err)

      setImages(previousImages)

      setError(
        err instanceof Error
          ? err.message
          : 'Die Bildreihenfolge konnte nicht gespeichert werden.'
      )
    }
  }

  /*
   * REFERENZ UND NEUE BILDER SPEICHERN
   */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (saving || deleting) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (!title.trim()) {
        throw new Error('Bitte einen Titel eingeben.')
      }

      if (!categoryId) {
        throw new Error('Bitte eine Kategorie auswählen.')
      }

      if (year && !Number.isInteger(Number(year))) {
        throw new Error('Bitte ein gültiges Jahr eingeben.')
      }

      const slug = createSlug(title)

      if (!slug) {
        throw new Error(
          'Aus dem Titel konnte kein gültiger Slug erstellt werden.'
        )
      }

      /*
       * 1. REFERENZ IN NEON SPEICHERN
       */

      const response = await fetch(
        `/api/admin/referenzen/${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title.trim(),
            slug,
            category_id: categoryId,
            location: location.trim() || null,
            year: year ? Number(year) : null,
            description: description.trim() || null,
            published,
            featured,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            'Die Referenz konnte nicht gespeichert werden.'
        )
      }

      /*
       * 2. NEUE BILDER AN CLOUDINARY SENDEN
       *
       * Die API lädt die Dateien hoch und speichert
       * die Cloudinary-URLs anschliessend in Neon.
       */

      if (newFiles.length > 0) {
        const formData = new FormData()

        newFiles.forEach((file, index) => {
          formData.append('images', file)
          formData.append(
            `sort_order_${index}`,
            String(images.length + index)
          )
        })

        const imageResponse = await fetch(
          `/api/admin/referenzen/${encodeURIComponent(id)}/bilder`,
          {
            method: 'POST',
            body: formData,
          }
        )

        const imageResult = await imageResponse.json()

        if (!imageResponse.ok) {
          throw new Error(
            imageResult.error ||
              'Die neuen Bilder konnten nicht gespeichert werden.'
          )
        }

        if (Array.isArray(imageResult.images)) {
          setImages((current) => [
            ...current,
            ...imageResult.images,
          ])
        }
      }

      // Vorschauen freigeben und Auswahl zurücksetzen.
      newPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview)
      })

      setNewFiles([])
      setNewPreviews([])

      setReference((current) =>
        current
          ? {
              ...current,
              title: title.trim(),
              slug,
              category_id: categoryId,
              location: location.trim() || null,
              year: year ? Number(year) : null,
              description: description.trim() || null,
              published,
              featured,
            }
          : current
      )

      setSuccess('Die Referenz wurde erfolgreich gespeichert.')

      router.refresh()
    } catch (err) {
      console.error('Referenz speichern:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Die Referenz konnte nicht gespeichert werden.'
      )
    } finally {
      setSaving(false)
    }
  }

  /*
   * REFERENZ LÖSCHEN
   *
   * Zuerst alle Bilder über die Bilder-API löschen.
   * Danach die Referenz selbst aus Neon entfernen.
   */

  async function handleDelete() {
    const confirmed = window.confirm(
      `Möchtest du "${title}" wirklich löschen?\n\nDie Referenz und alle zugehörigen Bilder werden endgültig gelöscht.`
    )

    if (!confirmed) return

    setDeleting(true)
    setError('')
    setSuccess('')

    try {
      // Alle bestehenden Bilder aus Neon und Cloudinary entfernen.
      for (const image of images) {
        const imageResponse = await fetch(
          `/api/admin/referenzen/${encodeURIComponent(id)}/bilder`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageId: image.id,
            }),
          }
        )

        const imageResult = await imageResponse.json()

        if (!imageResponse.ok) {
          throw new Error(
            imageResult.error ||
              'Ein Referenzbild konnte nicht gelöscht werden. Die Referenz wurde deshalb nicht gelöscht.'
          )
        }
      }

      /*
       * REFERENZ IN NEON LÖSCHEN
       */

      const response = await fetch(
        `/api/admin/referenzen/${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.error || 'Die Referenz konnte nicht gelöscht werden.'
        )
      }

      newPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview)
      })

      router.push('/admin/referenzen')
      router.refresh()
    } catch (err) {
      console.error('Referenz löschen:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Die Referenz konnte nicht gelöscht werden.'
      )

      setDeleting(false)
    }
  }

  /*
   * LADEN
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F4F7FA] p-6 md:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            Referenz wird geladen...
          </div>
        </div>
      </main>
    )
  }

  /*
   * NICHT GEFUNDEN
   */

  if (!reference) {
    return (
      <main className="min-h-screen bg-[#F4F7FA] p-6 md:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl bg-red-50 p-6 text-red-700">
            {error || 'Referenz nicht gefunden.'}
          </div>

          <Link
            href="/admin/referenzen"
            className="mt-4 inline-block text-sm font-medium hover:underline"
          >
            ← Zurück zu Referenzen
          </Link>
        </div>
      </main>
    )
  }

  /*
   * EDITOR
   */

  return (
    <main className="min-h-screen bg-[#F4F7FA] p-6 md:p-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-8">
          <Link
            href="/admin/referenzen"
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Zurück zu Referenzen
          </Link>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Referenz bearbeiten
              </h1>

              <p className="mt-2 text-gray-500">
                {reference.title}
              </p>
            </div>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {deleting ? 'Löschen...' : 'Referenz löschen'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* PROJEKTDATEN */}

          <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-semibold">
              Projektdaten
            </h2>

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

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Kategorie *
                  </label>

                  <select
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    required
                    className="w-full rounded-lg border bg-white px-4 py-3"
                  >
                    <option value="">
                      Kategorie auswählen
                    </option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Ort
                  </label>

                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Jahr
                  </label>

                  <input
                    type="number"
                    value={year}
                    onChange={(event) => setYear(event.target.value)}
                    className="w-full rounded-lg border px-4 py-3"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Beschreibung
                </label>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={8}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Der Beschreibungstext wird in Neon gespeichert.
                </p>
              </div>
            </div>
          </section>

          {/* BILDER */}

          <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <div>
              <h2 className="text-xl font-semibold">
                Bilder
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {images.length} bestehende Bilder
              </p>
            </div>

            {/* BESTEHENDE BILDER */}

            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-xl bg-gray-100"
                  >
                    <img
                      src={image.image_url}
                      alt={`${title} – Bild ${index + 1}`}
                      className="aspect-[4/3] w-full object-cover"
                    />

                    {index === 0 && (
                      <div className="absolute left-2 top-2 rounded-full bg-black px-3 py-1 text-xs text-white">
                        Hauptbild
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-2">
                      <button
                        type="button"
                        disabled={index === 0 || saving}
                        onClick={() => moveImage(index, 'up')}
                        className="rounded-lg bg-white px-3 py-2 text-sm shadow disabled:opacity-30"
                        aria-label="Bild nach oben verschieben"
                      >
                        ←
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => deleteImage(image)}
                        className="rounded-lg bg-white px-3 py-2 text-sm text-red-600 shadow hover:bg-red-50 disabled:opacity-50"
                      >
                        Löschen
                      </button>

                      <button
                        type="button"
                        disabled={
                          index === images.length - 1 || saving
                        }
                        onClick={() => moveImage(index, 'down')}
                        className="rounded-lg bg-white px-3 py-2 text-sm shadow disabled:opacity-30"
                        aria-label="Bild nach unten verschieben"
                      >
                        →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* NEUE BILDER AUSWÄHLEN */}

            <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center hover:bg-gray-50">
              <span className="text-lg font-medium">
                Weitere Bilder hinzufügen
              </span>

              <span className="mt-2 text-sm text-gray-500">
                Mehrere Bilder gleichzeitig möglich
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFiles}
                className="hidden"
              />
            </label>

            {/* VORSCHAU NEUER BILDER */}

            {newPreviews.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-medium">
                  Neue Bilder
                </h3>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {newPreviews.map((preview, index) => (
                    <div
                      key={preview}
                      className="relative overflow-hidden rounded-xl"
                    >
                      <img
                        src={preview}
                        alt={`Neues Bild ${index + 1}`}
                        className="aspect-square w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 shadow"
                        aria-label="Ausgewähltes Bild entfernen"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
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
                  onChange={(event) => setPublished(event.target.checked)}
                  className="h-5 w-5"
                />

                <span>Referenz veröffentlichen</span>
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

          {/* MELDUNGEN */}

          {error && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 p-4 text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-xl bg-green-50 p-4 text-green-700"
            >
              {success}
            </div>
          )}

          {/* BUTTONS */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/referenzen"
              className="rounded-xl border bg-white px-6 py-3 text-center font-medium hover:bg-gray-50"
            >
              Abbrechen
            </Link>

            <button
              type="submit"
              disabled={saving || deleting}
              className="rounded-xl bg-black px-8 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Speichern...' : 'Änderungen speichern'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
