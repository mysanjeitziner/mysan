'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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
  const supabase = createClient()

  const id = params.id as string

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
   * SLUG
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
   * DATEN LADEN
   */

  useEffect(() => {
    async function loadData() {
      setLoading(true)

      const [
        referenceResult,
        categoriesResult,
        imagesResult,
      ] = await Promise.all([
        supabase
          .from('references')
          .select(`
            id,
            title,
            slug,
            category_id,
            location,
            year,
            description,
            published,
            featured
          `)
          .eq('id', id)
          .single(),

        supabase
          .from('categories')
          .select(`
            id,
            name,
            slug,
            sort_order,
            active
          `)
          .order('sort_order', {
            ascending: true,
          })
          .order('name', {
            ascending: true,
          }),

        supabase
          .from('reference_images')
          .select(`
            id,
            image_url,
            sort_order
          `)
          .eq('reference_id', id)
          .order('sort_order', {
            ascending: true,
          }),
      ])

      if (referenceResult.error) {
        console.error(referenceResult.error)
        setError(
          'Die Referenz konnte nicht geladen werden.'
        )
        setLoading(false)
        return
      }

      if (categoriesResult.error) {
        console.error(categoriesResult.error)
        setError(
          'Die Kategorien konnten nicht geladen werden.'
        )
        setLoading(false)
        return
      }

      if (imagesResult.error) {
        console.error(imagesResult.error)
        setError(
          'Die Bilder konnten nicht geladen werden.'
        )
        setLoading(false)
        return
      }

      const data = referenceResult.data

      setReference(data)
      setCategories(categoriesResult.data || [])
      setImages(imagesResult.data || [])

      setTitle(data.title || '')
      setCategoryId(data.category_id || '')
      setLocation(data.location || '')
      setYear(
        data.year
          ? String(data.year)
          : ''
      )
      setDescription(data.description || '')
      setPublished(data.published)
      setFeatured(data.featured)

      setLoading(false)
    }

    if (id) {
      loadData()
    }
  }, [id, supabase])

  /*
   * NEUE BILDER AUSWÄHLEN
   */

  function handleFiles(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!event.target.files) return

    const selectedFiles = Array.from(
      event.target.files
    )

    setNewFiles(selectedFiles)

    const previews = selectedFiles.map(
      (file) => URL.createObjectURL(file)
    )

    setNewPreviews(previews)

    setError('')
    setSuccess('')
  }

  /*
   * NEUES BILD ENTFERNEN
   */

  function removeNewImage(index: number) {
    setNewFiles((current) =>
      current.filter(
        (_, i) => i !== index
      )
    )

    setNewPreviews((current) =>
      current.filter(
        (_, i) => i !== index
      )
    )
  }

  /*
   * BESTEHENDES BILD LÖSCHEN
   */

  async function deleteImage(
    image: ReferenceImage
  ) {
    const confirmed = window.confirm(
      'Möchtest du dieses Bild wirklich löschen?'
    )

    if (!confirmed) return

    try {
      setError('')
      setSuccess('')

      /*
       * STORAGE PFAD ERMITTELN
       */

      const url = image.image_url

      const marker = '/storage/v1/object/public/images/'

      const markerIndex = url.indexOf(marker)

      if (markerIndex !== -1) {
        const path = decodeURIComponent(
          url.substring(
            markerIndex + marker.length
          )
        )

        const {
          error: storageError,
        } = await supabase.storage
          .from('images')
          .remove([path])

        if (storageError) {
          console.error(storageError)
        }
      }

      /*
       * DATENBANK-EINTRAG LÖSCHEN
       */

      const {
        error: databaseError,
      } = await supabase
        .from('reference_images')
        .delete()
        .eq('id', image.id)

      if (databaseError) {
        throw databaseError
      }

      /*
       * LISTE AKTUALISIEREN
       */

      setImages((current) =>
        current.filter(
          (item) => item.id !== image.id
        )
      )

      setSuccess('Bild wurde gelöscht.')

    } catch (err) {
      console.error(err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(
          'Das Bild konnte nicht gelöscht werden.'
        )
      }
    }
  }

  /*
   * BILDER NACH OBEN / UNTEN
   */

  async function moveImage(
    index: number,
    direction: 'up' | 'down'
  ) {
    const newImages = [...images]

    const targetIndex =
      direction === 'up'
        ? index - 1
        : index + 1

    if (
      targetIndex < 0 ||
      targetIndex >= newImages.length
    ) {
      return
    }

    const current =
      newImages[index]

    const target =
      newImages[targetIndex]

    newImages[index] = target
    newImages[targetIndex] = current

    const updatedImages =
      newImages.map(
        (image, imageIndex) => ({
          ...image,
          sort_order: imageIndex,
        })
      )

    setImages(updatedImages)

    try {
      await Promise.all(
        updatedImages.map((image) =>
          supabase
            .from('reference_images')
            .update({
              sort_order:
                image.sort_order,
            })
            .eq('id', image.id)
        )
      )
    } catch (err) {
      console.error(err)
      setError(
        'Die Reihenfolge konnte nicht gespeichert werden.'
      )
    }
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

      if (!categoryId) {
        throw new Error(
          'Bitte eine Kategorie auswählen.'
        )
      }

      const slug = createSlug(title)

      /*
       * REFERENZ AKTUALISIEREN
       */

      const {
        error: referenceError,
      } = await supabase
        .from('references')
        .update({
          title: title.trim(),
          slug,
          category_id: categoryId,
          location:
            location.trim() || null,
          year: year
            ? Number(year)
            : null,
          description:
            description.trim() || null,
          published,
          featured,
        })
        .eq('id', id)

      if (referenceError) {
        throw referenceError
      }

      /*
       * NEUE BILDER HOCHLADEN
       */

      if (newFiles.length > 0) {
        const startOrder =
          images.length

        for (
          let i = 0;
          i < newFiles.length;
          i++
        ) {
          const file = newFiles[i]

          const extension =
            file.name
              .split('.')
              .pop()
              ?.toLowerCase() || 'jpg'

          const fileName =
            `${Date.now()}-${i}.${extension}`

          const filePath =
            `references/${id}/${fileName}`

          const {
            error: uploadError,
          } = await supabase.storage
            .from('images')
            .upload(
              filePath,
              file,
              {
                cacheControl: '3600',
                upsert: false,
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

          const {
            data: insertedImage,
            error: imageError,
          } = await supabase
            .from('reference_images')
            .insert({
              reference_id: id,
              image_url:
                publicUrlData.publicUrl,
              sort_order:
                startOrder + i,
            })
            .select()
            .single()

          if (imageError) {
            throw imageError
          }

          setImages((current) => [
            ...current,
            insertedImage,
          ])
        }

        setNewFiles([])
        setNewPreviews([])
      }

      setSuccess(
        'Die Referenz wurde erfolgreich gespeichert.'
      )

      router.refresh()

    } catch (err) {
      console.error(err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(
          'Die Referenz konnte nicht gespeichert werden.'
        )
      }
    } finally {
      setSaving(false)
    }
  }

  /*
   * REFERENZ + ALLE BILDER LÖSCHEN
   */

  async function handleDelete() {
    const confirmed = window.confirm(
      `Möchtest du "${title}" wirklich löschen?\n\nDie Referenz und ALLE zugehörigen Bilder werden endgültig gelöscht.`
    )

    if (!confirmed) return

    setDeleting(true)
    setError('')

    try {
      /*
       * 1. ALLE STORAGE-DATEIEN LADEN
       */

      const {
        data: storageFiles,
        error: listError,
      } = await supabase.storage
        .from('images')
        .list(`references/${id}`, {
          limit: 100,
        })

      if (listError) {
        console.error(listError)
      }

      /*
       * 2. STORAGE-DATEIEN LÖSCHEN
       */

      if (
        storageFiles &&
        storageFiles.length > 0
      ) {
        const paths =
          storageFiles.map(
            (file) =>
              `references/${id}/${file.name}`
          )

        const {
          error: storageDeleteError,
        } = await supabase.storage
          .from('images')
          .remove(paths)

        if (storageDeleteError) {
          throw storageDeleteError
        }
      }

      /*
       * 3. BILDER AUS DATENBANK LÖSCHEN
       */

      const {
        error: imagesDeleteError,
      } = await supabase
        .from('reference_images')
        .delete()
        .eq('reference_id', id)

      if (imagesDeleteError) {
        throw imagesDeleteError
      }

      /*
       * 4. REFERENZ LÖSCHEN
       */

      const {
        error: referenceDeleteError,
      } = await supabase
        .from('references')
        .delete()
        .eq('id', id)

      if (referenceDeleteError) {
        throw referenceDeleteError
      }

      /*
       * 5. ZURÜCK
       */

      router.push('/admin/referenzen')
      router.refresh()

    } catch (err) {
      console.error(err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(
          'Die Referenz konnte nicht gelöscht werden.'
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
      <main className="min-h-screen p-6 md:p-8">
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

  return (
    <main className="min-h-screen p-6 md:p-8">

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
              disabled={deleting}
              className="rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {deleting
                ? 'Löschen...'
                : 'Referenz löschen'}
            </button>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

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
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
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
                    onChange={(event) =>
                      setCategoryId(
                        event.target.value
                      )
                    }
                    required
                    className="w-full rounded-lg border bg-white px-4 py-3"
                  >

                    <option value="">
                      Kategorie auswählen
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Ort
                  </label>

                  <input
                    value={location}
                    onChange={(event) =>
                      setLocation(
                        event.target.value
                      )
                    }
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
                    onChange={(event) =>
                      setYear(event.target.value)
                    }
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
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={8}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                />

              </div>

            </div>

          </section>

          {/* BILDER */}

          <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  Bilder
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {images.length} bestehende Bilder
                </p>

              </div>

            </div>

            {/* BESTEHENDE BILDER */}

            {images.length > 0 && (

              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">

                {images.map(
                  (image, index) => (

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
                          disabled={index === 0}
                          onClick={() =>
                            moveImage(
                              index,
                              'up'
                            )
                          }
                          className="rounded-lg bg-white px-3 py-2 text-sm shadow disabled:opacity-30"
                        >
                          ←
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteImage(image)
                          }
                          className="rounded-lg bg-white px-3 py-2 text-sm text-red-600 shadow hover:bg-red-50"
                        >
                          Löschen
                        </button>

                        <button
                          type="button"
                          disabled={
                            index ===
                            images.length - 1
                          }
                          onClick={() =>
                            moveImage(
                              index,
                              'down'
                            )
                          }
                          className="rounded-lg bg-white px-3 py-2 text-sm shadow disabled:opacity-30"
                        >
                          →
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

            {/* NEUE BILDER */}

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

                  {newPreviews.map(
                    (preview, index) => (

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
                          onClick={() =>
                            removeNewImage(index)
                          }
                          className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 shadow"
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

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
                  onChange={(event) =>
                    setPublished(
                      event.target.checked
                    )
                  }
                  className="h-5 w-5"
                />

                <span>
                  Referenz veröffentlichen
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

          {/* MELDUNGEN */}

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