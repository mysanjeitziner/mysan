'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = {
  id: string
  title: string
}

export default function DeleteReferenceButton({
  id,
  title,
}: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  /*
   * Supabase wird weiterhin ausschliesslich
   * für den Storage der Bilder verwendet.
   */

  async function getAllStorageFiles(
    folder: string
  ): Promise<string[]> {
    const supabase = createClient()
    const result: string[] = []

    const { data, error } = await supabase.storage
      .from('images')
      .list(folder, {
        limit: 1000,
      })

    if (error) {
      throw new Error(
        `Bilder konnten nicht geladen werden: ${error.message}`
      )
    }

    if (!data) {
      return result
    }

    for (const item of data) {
      const path = `${folder}/${item.name}`

      /*
       * Dateien besitzen normalerweise eine ID.
       * Ordner werden rekursiv durchsucht.
       */

      if (item.id) {
        result.push(path)
      } else {
        const nestedFiles =
          await getAllStorageFiles(path)

        result.push(...nestedFiles)
      }
    }

    return result
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Möchtest du die Referenz "${title}" wirklich löschen?\n\nDie Referenz und alle zugehörigen Bilder werden endgültig gelöscht.`
    )

    if (!confirmed) return

    setDeleting(true)

    try {
      /*
       * 1. Bilder im Supabase Storage finden
       */

      const folder = `references/${id}`
      const storageFiles =
        await getAllStorageFiles(folder)

      /*
       * 2. Bilder aus Supabase Storage löschen
       */

      if (storageFiles.length > 0) {
        const supabase = createClient()

        for (
          let i = 0;
          i < storageFiles.length;
          i += 100
        ) {
          const batch = storageFiles.slice(i, i + 100)

          const { error } = await supabase.storage
            .from('images')
            .remove(batch)

          if (error) {
            throw new Error(
              `Bilder konnten nicht gelöscht werden: ${error.message}`
            )
          }
        }
      }

      /*
       * 3. Referenz über die serverseitige API löschen.
       * Die API verwendet Neon und prüft die Admin-Berechtigung.
       */

      const response = await fetch(
        `/api/admin/referenzen/${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          result?.error ||
            result?.message ||
            'Die Referenz konnte nicht aus der Datenbank gelöscht werden.'
        )
      }

      /*
       * 4. Admin-Übersicht aktualisieren
       */

      router.refresh()
    } catch (error) {
      console.error(
        'Fehler beim Löschen der Referenz:',
        error
      )

      alert(
        error instanceof Error
          ? error.message
          : 'Die Referenz konnte nicht gelöscht werden.'
      )

      setDeleting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="
        rounded-lg
        border
        border-red-200
        px-4
        py-2
        text-sm
        font-medium
        text-red-600
        transition
        hover:bg-red-50
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {deleting ? 'Löschen...' : 'Löschen'}
    </button>
  )
}
