'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Category = {
  id: string
  name: string
  slug: string
  sort_order: number
  active: boolean
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

export default function NeueReferenzPage() {
  const router = useRouter()
  const supabase = createClient()

  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [location, setLocation] = useState('')
  const [year, setYear] = useState(
    new Date().getFullYear().toString()
  )
  const [description, setDescription] = useState('')

  const [published, setPublished] = useState(false)
  const [featured, setFeatured] = useState(false)

  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /*
   * KATEGORIEN LADEN
   */

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          sort_order,
          active
        `)
        .eq('active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })

      if (error) {
        console.error(error)
        setError(
          'Die Kategorien konnten nicht geladen werden.'
        )
        setCategoriesLoading(false)
        return
      }

      setCategories(data || [])

      if (data && data.length > 0) {
        setCategoryId(data[0].id)
      }

      setCategoriesLoading(false)
    }

    loadCategories()
  }, [supabase])

  /*
   * BILDER AUSWÄHLEN
   */

  function handleFiles(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!event.target.files) return

    const selectedFiles = Array.from(event.target.files)

    setFiles(selectedFiles)

    const urls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    )

    setPreviews(urls)
  }

  /*
   * BILD ENTFERNEN
   */

  function removeImage(index: number) {
    setFiles((current) =>
      current.filter((_, i) => i !== index)
    )

    setPreviews((current) =>
      current.filter((_, i) => i !== index)
    )
  }

  /*
   * FORMULAR SPEICHERN
   */

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

      if (!categoryId) {
        throw new Error(
          'Bitte eine Kategorie auswählen.'
        )
      }

      const slug = createSlug(title)

      if (!slug) {
        throw new Error(
          'Aus dem Titel konnte kein gültiger Slug erstellt werden.'
        )
      }

      /*
       * 1. REFERENZ ERSTELLEN
       */

      const {
        data: reference,
        error: referenceError,
      } = await supabase
        .from('references')
        .insert({
          title: title.trim(),
          slug,
          category_id: categoryId,
          location: location.trim() || null,
          year: year ? Number(year) : null,
          description:
            description.trim() || null,
          published,
          featured,
        })
        .select()
        .single()

      if (referenceError) {
        throw referenceError
      }

      /*
       * 2. BILDER HOCHLADEN
       */

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        const extension =
          file.name
            .split('.')
            .pop()
            ?.toLowerCase() || 'jpg'

        const fileName =
          `${Date.now()}-${i}.${extension}`

        const filePath =
          `references/${reference.id}/${fileName}`

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

        /*
         * 3. ÖFFENTLICHE URL
         */

        const {
          data: publicUrlData,
        } = supabase.storage
          .from('images')
          .getPublicUrl(filePath)

        /*
         * 4. BILD IN DATENBANK
         */

        const {
          error: imageError,
        } = await supabase
          .from('reference_images')
          .insert({
            reference_id: reference.id,
            image_url:
              publicUrlData.publicUrl,
            sort_order: i,
          })

        if (imageError) {
          throw imageError
        }
      }

      /*
       * 5. ZURÜCK ZUR ÜBERSICHT
       */

      router.push('/admin/referenzen')
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

      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
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

          <h1 className="mt-3 text-4xl font-bold">
            Neue Referenz
          </h1>

          <p className="mt-2 text-gray-500">
            Neues Projekt für Mysan Jeitziner erfassen
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* PROJEKTDATEN */}

          <section className="rounded-2xl bg-white p-8 shadow">

            <h2 className="text-xl font-semibold">
              Projektdaten
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
                  placeholder="z. B. Neubau Einfamilienhaus Müller"
                />

              </div>

              {/* KATEGORIE / ORT / JAHR */}

              <div className="grid gap-5 md:grid-cols-3">

                {/* KATEGORIE */}

                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Kategorie *
                  </label>

                  {categoriesLoading ? (
                    <div className="rounded-lg border bg-gray-50 px-4 py-3 text-gray-500">
                      Kategorien werden geladen...
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
                      Keine aktiven Kategorien vorhanden.
                    </div>
                  ) : (
                    <select
                      value={categoryId}
                      onChange={(event) =>
                        setCategoryId(
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg border bg-white px-4 py-3"
                      required
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
                  )}

                </div>

                {/* ORT */}

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
                    placeholder="Brig"
                  />

                </div>

                {/* JAHR */}

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

              {/* BESCHREIBUNG */}

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
                  rows={7}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                  placeholder="Beschreibung des Projekts..."
                />

              </div>

            </div>

          </section>

          {/* BILDER */}

          <section className="rounded-2xl bg-white p-8 shadow">

            <h2 className="text-xl font-semibold">
              Bilder
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Du kannst mehrere Bilder gleichzeitig auswählen.
            </p>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition hover:bg-gray-50">

              <span className="text-lg font-medium">
                Bilder auswählen
              </span>

              <span className="mt-2 text-sm text-gray-500">
                JPG, PNG oder WEBP
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFiles}
                className="hidden"
              />

            </label>

            {previews.length > 0 && (

              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

                {previews.map(
                  (preview, index) => (

                    <div
                      key={preview}
                      className="group relative overflow-hidden rounded-xl"
                    >

                      <img
                        src={preview}
                        alt={`Bild ${index + 1}`}
                        className="aspect-square w-full object-cover"
                      />

                      {index === 0 && (
                        <div className="absolute left-2 top-2 rounded-full bg-black px-2 py-1 text-xs text-white">
                          Hauptbild
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(index)
                        }
                        className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-sm shadow hover:bg-red-50"
                      >
                        ×
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

          {/* VERÖFFENTLICHUNG */}

          <section className="rounded-2xl bg-white p-8 shadow">

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
              disabled={
                loading ||
                categoriesLoading ||
                categories.length === 0
              }
              className="rounded-lg bg-black px-8 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading
                ? 'Speichern...'
                : 'Referenz speichern'}
            </button>

          </div>

        </form>

      </div>
    </main>
  )
}