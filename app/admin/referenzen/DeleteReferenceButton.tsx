
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
  const supabase = createClient()

  const [deleting, setDeleting] = useState(false)

  /*
   * =========================================================
   * ALLE DATEIEN IN EINEM STORAGE-ORDNER REKURSIV SUCHEN
   * =========================================================
   */

  async function getAllStorageFiles(
    folder: string
  ): Promise<string[]> {
    const result: string[] = []

    const { data, error } = await supabase.storage
      .from('images')
      .list(folder, {
        limit: 1000,
      })

    if (error) {
      throw error
    }

    if (!data) {
      return result
    }

    for (const item of data) {
      const path = `${folder}/${item.name}`

      /*
       * Supabase liefert Dateien und Ordner ähnlich.
       * Eine Datei besitzt normalerweise eine id.
       * Ordner besitzen diese nicht.
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

  /*
   * =========================================================
   * REFERENZ LÖSCHEN
   * =========================================================
   */

  async function handleDelete() {
    const confirmed = window.confirm(
      `Möchtest du die Referenz "${title}" wirklich löschen?\n\nDie Referenz und alle zugehörigen Bilder werden endgültig gelöscht.`
    )

    if (!confirmed) return

    setDeleting(true)

    try {
      /*
       * -----------------------------------------------------
       * 1. ALLE STORAGE-DATEIEN FINDEN
       * -----------------------------------------------------
       */

      const folder = `references/${id}`

      const storageFiles =
        await getAllStorageFiles(folder)

      /*
       * -----------------------------------------------------
       * 2. STORAGE-DATEIEN LÖSCHEN
       * -----------------------------------------------------
       */

      if (storageFiles.length > 0) {
        /*
         * Supabase empfiehlt kleinere Pakete.
         * Deshalb löschen wir in Blöcken.
         */

        for (
          let i = 0;
          i < storageFiles.length;
          i += 100
        ) {
          const batch =
            storageFiles.slice(i, i + 100)

          const { error: storageError } =
            await supabase.storage
              .from('images')
              .remove(batch)

          if (storageError) {
            throw storageError
          }
        }
      }

      /*
       * -----------------------------------------------------
       * 3. EINTRÄGE AUS reference_images LÖSCHEN
       * -----------------------------------------------------
       */

      const { error: imagesError } =
        await supabase
          .from('reference_images')
          .delete()
          .eq('reference_id', id)

      if (imagesError) {
        throw imagesError
      }

      /*
       * -----------------------------------------------------
       * 4. REFERENZ AUS references LÖSCHEN
       * -----------------------------------------------------
       */

      const { error: referenceError } =
        await supabase
          .from('references')
          .delete()
          .eq('id', id)

      if (referenceError) {
        throw referenceError
      }

      /*
       * -----------------------------------------------------
       * 5. SEITE AKTUALISIEREN
       * -----------------------------------------------------
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
      {deleting
        ? 'Löschen...'
        : 'Löschen'}
    </button>
  )
}

