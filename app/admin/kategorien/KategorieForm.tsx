'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

type Category = {
  id: string
  name: string
  slug: string
  sort_order: number
  active: boolean
  created_at: string
  updated_at: string
}

type Props = {
  category?: Category
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

async function requestApi(
  method: 'POST' | 'PATCH' | 'DELETE',
  body: Record<string, unknown>
) {
  const response = await fetch('/api/admin/kategorien', {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      result.error || 'Die Anfrage konnte nicht ausgeführt werden.'
    )
  }

  return result
}

export default function KategorieForm({ category }: Props) {
  const router = useRouter()
  const isNew = !category

  const [name, setName] = useState(category?.name || '')
  const [sortOrder, setSortOrder] = useState(
    category?.sort_order?.toString() || '0'
  )
  const [active, setActive] = useState(category?.active ?? true)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const cleanName = name.trim()

      if (!cleanName) {
        throw new Error('Bitte einen Kategorienamen eingeben.')
      }

      const slug = createSlug(cleanName)

      if (!slug) {
        throw new Error(
          'Aus dem Namen konnte kein gültiger Slug erstellt werden.'
        )
      }

      const order = Number(sortOrder)

      if (!Number.isFinite(order)) {
        throw new Error('Die Reihenfolge muss eine Zahl sein.')
      }

      if (isNew) {
        await requestApi('POST', {
          name: cleanName,
          slug,
          sort_order: order,
          active,
        })

        setName('')
        setSortOrder('0')
        setActive(true)
      } else {
        await requestApi('PATCH', {
          id: category.id,
          name: cleanName,
          slug,
          sort_order: order,
          active,
        })

        setEditing(false)
      }

      router.refresh()
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Die Kategorie konnte nicht gespeichert werden.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function toggleActive() {
    if (!category) return

    setLoading(true)
    setError('')

    try {
      await requestApi('PATCH', {
        id: category.id,
        active: !category.active,
      })

      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Der Status konnte nicht geändert werden.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function deleteCategory() {
    if (!category) return

    const confirmed = window.confirm(
      `Möchtest du die Kategorie "${category.name}" wirklich löschen?`
    )

    if (!confirmed) return

    setLoading(true)
    setError('')

    try {
      await requestApi('DELETE', {
        id: category.id,
      })

      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Die Kategorie konnte nicht gelöscht werden.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Neue Kategorie
  if (isNew) {
    return (
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Name
          </label>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="z. B. Wärmepumpen"
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Reihenfolge
          </label>

          <input
            type="number"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />

          <p className="mt-1 text-xs text-gray-500">
            Kleinere Zahlen erscheinen zuerst.
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            className="h-5 w-5"
          />

          <span className="text-sm">Kategorie aktiv</span>
        </label>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Speichern...' : 'Kategorie erstellen'}
        </button>
      </form>
    )
  }

  // Vorhandene Kategorie anzeigen
  if (!editing) {
    return (
      <div className="border-b p-6 last:border-b-0">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="truncate font-semibold">
                {category.name}
              </h3>

              {category.active ? (
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                  Aktiv
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                  Inaktiv
                </span>
              )}
            </div>

            <div className="mt-1 text-sm text-gray-500">
              Reihenfolge: {category.sort_order}
            </div>

            <div className="mt-1 text-xs text-gray-400">
              /{category.slug}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={loading}
              className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Bearbeiten
            </button>

            <button
              type="button"
              onClick={toggleActive}
              disabled={loading}
              className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {loading
                ? 'Bitte warten...'
                : category.active
                  ? 'Deaktivieren'
                  : 'Aktivieren'}
            </button>

            <button
              type="button"
              onClick={deleteCategory}
              disabled={loading}
              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Löschen
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    )
  }

  // Kategorie bearbeiten
  return (
    <div className="border-b bg-gray-50 p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Name
          </label>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Reihenfolge
          </label>

          <input
            type="number"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            className="h-5 w-5"
          />

          <span className="text-sm">Kategorie aktiv</span>
        </label>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Speichern...' : 'Änderungen speichern'}
          </button>

          <button
            type="button"
            onClick={() => {
              setEditing(false)
              setError('')
              setName(category.name)
              setSortOrder(category.sort_order.toString())
              setActive(category.active)
            }}
            disabled={loading}
            className="rounded-lg border bg-white px-5 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  )
}