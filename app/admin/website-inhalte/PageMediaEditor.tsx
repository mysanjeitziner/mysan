'use client'

import { useRef, useState } from 'react'

type PageMedia = {
  id: string
  page: string
  media_type: string
  storage_path: string | null
  public_url: string | null
  alt_text: string | null
  opacity: number | null
  visible: boolean
  created_at: string
  updated_at: string
}

type Props = {
  page: string
  mediaType: string
  title: string
  description?: string
  initialMedia: PageMedia | null
}

export default function PageMediaEditor({
  page,
  mediaType,
  title,
  description,
  initialMedia,
}: Props) {
  const fileInputRef =
    useRef<HTMLInputElement>(null)

  const [media, setMedia] =
    useState<PageMedia | null>(
      initialMedia
    )

  const [uploading, setUploading] =
    useState(false)

  const [saving, setSaving] =
    useState(false)

  const [deleting, setDeleting] =
    useState(false)

  const [opacity, setOpacity] =
    useState<number>(
      Number(
        initialMedia?.opacity ?? 0.18
      )
    )

  const [altText, setAltText] =
    useState(
      initialMedia?.alt_text ?? ''
    )

  const [visible, setVisible] =
    useState(
      initialMedia?.visible ?? true
    )

  const [message, setMessage] =
    useState<string | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  /* =========================================================
     BILD AUSWÄHLEN
  ========================================================= */

  function selectFile() {
    if (uploading) {
      return
    }

    fileInputRef.current?.click()
  }

  /* =========================================================
     DATEI GEWÄHLT
  ========================================================= */

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    setError(null)
    setMessage(null)
    setUploading(true)

    try {
      /* -------------------------------------------------------
         DATEITYP
      ------------------------------------------------------- */

      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/avif',
      ]

      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          'Nur JPG, PNG, WebP und AVIF sind erlaubt.'
        )
      }

      /* -------------------------------------------------------
         DATEIGRÖSSE
      ------------------------------------------------------- */

      if (
        file.size >
        10 * 1024 * 1024
      ) {
        throw new Error(
          'Das Bild darf maximal 10 MB gross sein.'
        )
      }

      /* -------------------------------------------------------
         FORMDATA
      ------------------------------------------------------- */

      const formData =
        new FormData()

      formData.append(
        'file',
        file
      )

      formData.append(
        'page',
        page
      )

      formData.append(
        'mediaType',
        mediaType
      )

      formData.append(
        'altText',
        altText
      )

      formData.append(
        'opacity',
        String(opacity)
      )

      formData.append(
        'visible',
        String(visible)
      )

      /* -------------------------------------------------------
         UPLOAD
      ------------------------------------------------------- */

      const response =
        await fetch(
          '/api/admin/page-media',
          {
            method: 'POST',
            body: formData,
          }
        )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            'Das Bild konnte nicht hochgeladen werden.'
        )
      }

      /* -------------------------------------------------------
         STATE
      ------------------------------------------------------- */

      setMedia(result.media)

      setOpacity(
        Number(
          result.media.opacity ?? 0.18
        )
      )

      setAltText(
        result.media.alt_text || ''
      )

      setVisible(
        result.media.visible !== false
      )

      setMessage(
        'Bild erfolgreich gespeichert.'
      )

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unbekannter Fehler.'
      )

    } finally {
      setUploading(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  /* =========================================================
     EINSTELLUNGEN SPEICHERN
  ========================================================= */

  async function saveSettings() {
    if (!media) {
      return
    }

    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const response =
        await fetch(
          '/api/admin/page-media',
          {
            method: 'PATCH',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              id: media.id,
              alt_text: altText,
              opacity,
              visible,
            }),
          }
        )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            'Die Änderungen konnten nicht gespeichert werden.'
        )
      }

      setMedia(result.media)

      setMessage(
        'Änderungen gespeichert.'
      )

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unbekannter Fehler.'
      )

    } finally {
      setSaving(false)
    }
  }

  /* =========================================================
     LÖSCHEN
  ========================================================= */

  async function deleteMedia() {
    if (!media) {
      return
    }

    const confirmed =
      window.confirm(
        'Möchtest du dieses Bild wirklich löschen?'
      )

    if (!confirmed) {
      return
    }

    setDeleting(true)
    setError(null)
    setMessage(null)

    try {
      const response =
        await fetch(
          `/api/admin/page-media?id=${encodeURIComponent(
            media.id
          )}`,
          {
            method: 'DELETE',
          }
        )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            'Das Bild konnte nicht gelöscht werden.'
        )
      }

      setMedia(null)
      setAltText('')
      setOpacity(0.18)
      setVisible(true)

      setMessage(
        'Bild wurde gelöscht.'
      )

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unbekannter Fehler.'
      )

    } finally {
      setDeleting(false)
    }
  }

  /* =========================================================
     BILD URL
  ========================================================= */

  const imageUrl =
    media?.public_url || null

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* HEADER */}

      <div className="border-b border-gray-200 p-5">

        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

          <div>

            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>

            {description && (
              <p className="mt-1 text-sm leading-6 text-gray-500">
                {description}
              </p>
            )}

          </div>

          <span className="inline-flex w-fit rounded-full bg-[#1dabff]/10 px-3 py-1 text-xs font-medium text-[#1dabff]">
            {mediaType}
          </span>

        </div>

      </div>

      <div className="p-5">

        {/* VORSCHAU */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">

          {imageUrl ? (

            <div className="relative">

              <div className="flex min-h-[220px] items-center justify-center overflow-hidden bg-gray-100">

                <img
                  src={imageUrl}
                  alt={
                    altText ||
                    title
                  }
                  className="max-h-[420px] w-full object-cover"
                  style={{
                    opacity,
                  }}
                />

              </div>

              {!visible && (
                <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                  Ausgeblendet
                </div>
              )}

            </div>

          ) : (

            <div className="flex min-h-[220px] items-center justify-center p-8 text-center">

              <div>

                <div className="text-5xl">
                  🖼️
                </div>

                <p className="mt-3 text-sm font-semibold text-gray-700">
                  Noch kein Bild vorhanden
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Klicke unten auf „Bild auswählen“.
                </p>

              </div>

            </div>

          )}

        </div>

        {/* DATEI */}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="mt-5 flex flex-wrap gap-3">

          <button
            type="button"
            onClick={selectFile}
            disabled={uploading}
            className="
              inline-flex
              items-center
              justify-center
              rounded-full
              bg-[#1dabff]
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {uploading
              ? 'Bild wird hochgeladen ...'
              : media
                ? '🔄 Bild ersetzen'
                : '📁 Bild auswählen'}
          </button>

          {media && (
            <button
              type="button"
              onClick={deleteMedia}
              disabled={deleting}
              className="
                inline-flex
                items-center
                justify-center
                rounded-full
                border
                border-red-200
                px-5
                py-3
                text-sm
                font-semibold
                text-red-600
                transition
                hover:bg-red-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {deleting
                ? 'Wird gelöscht ...'
                : '🗑 Bild löschen'}
            </button>
          )}

        </div>

        {/* ALT TEXT */}

        <div className="mt-6">

          <label className="text-sm font-semibold text-gray-800">
            Alt-Text
          </label>

          <input
            type="text"
            value={altText}
            onChange={(event) =>
              setAltText(
                event.target.value
              )
            }
            placeholder="Beschreibung des Bildes"
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-[#1dabff]
              focus:ring-2
              focus:ring-[#1dabff]/20
            "
          />

        </div>

        {/* TRANSPARENZ */}

        <div className="mt-6">

          <div className="flex items-center justify-between">

            <label className="text-sm font-semibold text-gray-800">
              Transparenz
            </label>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              {Math.round(
                opacity * 100
              )}%
            </span>

          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(event) =>
              setOpacity(
                Number(
                  event.target.value
                )
              )
            }
            className="mt-3 w-full accent-[#1dabff]"
          />

          <div className="mt-1 flex justify-between text-xs text-gray-400">

            <span>
              Unsichtbar
            </span>

            <span>
              Voll sichtbar
            </span>

          </div>

        </div>

        {/* SICHTBARKEIT */}

        <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">

          <div>

            <p className="text-sm font-semibold text-gray-800">
              Bild anzeigen
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Das Bild kann ausgeblendet werden,
              ohne es zu löschen.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setVisible(!visible)
            }
            className={`
              relative
              h-7
              w-12
              rounded-full
              transition
              ${
                visible
                  ? 'bg-[#1dabff]'
                  : 'bg-gray-300'
              }
            `}
            aria-label="Sichtbarkeit ändern"
          >

            <span
              className={`
                absolute
                top-1
                h-5
                w-5
                rounded-full
                bg-white
                shadow
                transition
                ${
                  visible
                    ? 'left-6'
                    : 'left-1'
                }
              `}
            />

          </button>

        </div>

        {/* SPEICHERN */}

        {media && (

          <div className="mt-6">

            <button
              type="button"
              onClick={saveSettings}
              disabled={saving}
              className="
                inline-flex
                items-center
                justify-center
                rounded-full
                bg-gray-900
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-gray-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {saving
                ? 'Wird gespeichert ...'
                : 'Änderungen speichern'}
            </button>

          </div>

        )}

        {/* MELDUNGEN */}

        {message && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

      </div>

    </div>
  )
}