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

  async function handleDelete() {
    const confirmed = window.confirm(
      `Möchtest du die Referenz "${title}" wirklich löschen?\n\nDie Referenz und alle zugehörigen Bilder werden endgültig gelöscht.`
    )

    if (!confirmed) return

    setDeleting(true)

    try {
      /*
       * 1. ALLE BILDER DER REFERENZ AUS STORAGE LADEN
       */

      const {
        data: files,
        error: listError,
      } = await supabase.storage
        .from('images')
        .list(`references/${id}`, {
          limit: 100,
        })

      if (listError) {
        throw listError
      }

      /*
       * 2. BILDER AUS STORAGE LÖSCHEN
       */

      if (files && files.length > 0) {
        const paths = files.map(
          (file) =>
            `references/${id}/${file.name}`
        )

        const {
          error: storageError,
        } = await supabase.storage
          .from('images')
          .remove(paths)

        if (storageError) {
          throw storageError
        }
      }

      /*
       * 3. BILDER AUS DER DATENBANK LÖSCHEN
       */

      const {
        error: imagesError,
      } = await supabase
        .from('reference_images')
        .delete()
        .eq('reference_id', id)

      if (imagesError) {
        throw imagesError
      }

      /*
       * 4. REFERENZ LÖSCHEN
       */

      const {
        error: referenceError,
      } = await supabase
        .from('references')
        .delete()
        .eq('id', id)

      if (referenceError) {
        throw referenceError
      }

      /*
       * 5. LISTE AKTUALISIEREN
       */

      router.refresh()

    } catch (error) {
      console.error(error)

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
      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? 'Löschen...' : 'Löschen'}
    </button>
  )
}