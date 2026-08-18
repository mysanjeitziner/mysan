'use client'

import { useRef, useState } from 'react'

type PageMedia = {
  id: string
  page: string
  media_type: string
  storage_path: string | null
  public_url: string | null
  alt_text: string | null
  opacity: number
  visible: boolean
}

type Props = {
  initialMedia: PageMedia | null
  page: string
  mediaType?: string
  title?: string
}

export default function PageMediaEditor({
  initialMedia,
  page,
  mediaType = 'hero',
  title = 'Bild',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [media, setMedia] = useState<PageMedia | null>(
    initialMedia
  )

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(
      initialMedia?.public_url || null
    )

  const [altText, setAltText] =
    useState(initialMedia?.alt_text || '')

  const [opacity, setOpacity] =
    useState(
      initialMedia?.opacity !== undefined
        ? Math.round(initialMedia.opacity * 100)
        : 18
    )

  const [visible, setVisible] =
    useState(initialMedia?.visible ?? true)

  const [loading, setLoading] =
    useState(false)

  const [message, setMessage] =
    useState<string | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  function selectFile(file: File | null) {
    if (!file) return

    setError(null)
    setMessage(null)

    if (!file.type.startsWith('image/')) {
      setError(
        'Bitte wähle eine Bilddatei aus.'
      )
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        'Das Bild darf maximal 10 MB gross sein.'
      )
      return
    }

    setSelectedFile(file)

    const url = URL.createObjectURL(file)

    setPreviewUrl(url)
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] || null

    selectFile(file)
  }

  async function uploadImage() {
    if (!selectedFile) {
      setError(
        'Bitte zuerst ein Bild auswählen.'
      )
      return
    }

    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const formData = new FormData()

      formData.append(
        'file',
        selectedFile
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
        String(opacity / 100)
      )

      formData.append(
        'visible',
        String(visible)
      )

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
            'Upload fehlgeschlagen.'
        )
      }

      setMedia(result.media)

      setPreviewUrl(
        result.media.public_url
      )

      setSelectedFile(null)

      if (inputRef.current) {
        inputRef.current.value = ''
      }

      setMessage(
        'Bild wurde erfolgreich gespeichert.'
      )

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Upload fehlgeschlagen.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    if (!media) {
      setError(
        'Es ist noch kein Bild gespeichert.'
      )
      return
    }

    setLoading(true)
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
              opacity:
                opacity / 100,
              visible,
            }),
          }
        )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            'Speichern fehlgeschlagen.'
        )
      }

      setMedia(result.media)

      setMessage(
        'Bild-Einstellungen gespeichert.'
      )

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Speichern fehlgeschlagen.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function deleteImage() {
    if (!media) return

    const confirmed =
      window.confirm(
        'Möchtest du dieses Bild wirklich löschen?'
      )

    if (!confirmed) return

    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const response =
        await fetch(
          '/api/admin/page-media',
          {
            method: 'DELETE',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              id: media.id,
            }),
          }
        )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.error ||
            'Löschen fehlgeschlagen.'
        )
      }

      setMedia(null)
      setSelectedFile(null)
      setPreviewUrl(null)
      setAltText('')
      setOpacity(18)
      setVisible(true)

      if (inputRef.current) {
        inputRef.current.value = ''
      }

      setMessage(
        'Bild wurde gelöscht.'
      )

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Löschen fehlgeschlagen.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">

        <div>

          <h2 className="text-xl font-semibold text-gray-900">
            {title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Seite: <strong>{page}</strong>
            {' · '}
            Typ: <strong>{mediaType}</strong>
          </p>

        </div>

        {media && (
          <span
            className={`
              inline-flex
              w-fit
              rounded-full
              px-3
              py-1
              text-xs
              font-medium
              ${
                visible
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }
            `}
          >
            {visible
              ? 'Sichtbar'
              : 'Ausgeblendet'}
          </span>
        )}

      </div>


      {/* =====================================================
          VORSCHAU
      ===================================================== */}

      <div className="mt-6">

        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100">

          {previewUrl ? (

            <div
              className="relative"
              style={{
                backgroundColor:
                  '#f3f4f6',
              }}
            >

              <img
                src={previewUrl}
                alt={
                  altText ||
                  title
                }
                className="
                  block
                  h-auto
                  max-h-[450px]
                  w-full
                  object-cover
                "
                style={{
                  opacity:
                    opacity / 100,
                }}
              />

              {opacity < 100 && (
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-white
                  "
                  style={{
                    opacity:
                      1 -
                      opacity / 100,
                  }}
                />
              )}

            </div>

          ) : (

            <div className="flex h-64 items-center justify-center text-sm text-gray-400">

              Noch kein Bild vorhanden

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          DATEI AUSWÄHLEN
      ===================================================== */}

      <div className="mt-6">

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          disabled={loading}
          className="
            inline-flex
            items-center
            rounded-lg
            bg-[#1dabff]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#1599e5]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {media
            ? 'Neues Bild auswählen'
            : 'Bild auswählen'}
        </button>

        {selectedFile && (
          <div className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">

            <strong>
              Ausgewählt:
            </strong>{' '}

            {selectedFile.name}

            <span className="ml-2 text-blue-600">
              (
              {(
                selectedFile.size /
                1024 /
                1024
              ).toFixed(2)}
              {' MB'})
            </span>

          </div>
        )}

      </div>


      {/* =====================================================
          ALT TEXT
      ===================================================== */}

      <div className="mt-6">

        <label className="block text-sm font-semibold text-gray-700">
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
            rounded-lg
            border
            border-gray-300
            px-4
            py-3
            text-sm
            outline-none
            focus:border-[#1dabff]
            focus:ring-2
            focus:ring-[#1dabff]/20
          "
        />

      </div>


      {/* =====================================================
          TRANSPARENZ
      ===================================================== */}

      <div className="mt-6">

        <div className="flex items-center justify-between">

          <label className="text-sm font-semibold text-gray-700">
            Bildtransparenz
          </label>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
            {opacity} %
          </span>

        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={opacity}
          onChange={(event) =>
            setOpacity(
              Number(
                event.target.value
              )
            )
          }
          className="
            mt-3
            w-full
            accent-[#1dabff]
          "
        />

        <div className="mt-1 flex justify-between text-xs text-gray-400">

          <span>
            Unsichtbar
          </span>

          <span>
            100 % sichtbar
          </span>

        </div>

      </div>


      {/* =====================================================
          SICHTBARKEIT
      ===================================================== */}

      <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 p-4">

        <div>

          <p className="text-sm font-semibold text-gray-800">
            Bild auf Website anzeigen
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Das Bild kann ausgeblendet werden,
            ohne es zu löschen.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            setVisible(
              !visible
            )
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


      {/* =====================================================
          AKTIONEN
      ===================================================== */}

      <div className="mt-6 flex flex-wrap gap-3">

        {selectedFile && (
          <button
            type="button"
            onClick={uploadImage}
            disabled={loading}
            className="
              rounded-lg
              bg-[#1dabff]
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#1599e5]
              disabled:opacity-50
            "
          >
            {loading
              ? 'Wird gespeichert...'
              : media
                ? 'Bild ersetzen'
                : 'Hochladen & speichern'}
          </button>
        )}

        {media && (
          <>
            <button
              type="button"
              onClick={saveSettings}
              disabled={loading}
              className="
                rounded-lg
                border
                border-gray-300
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:opacity-50
              "
            >
              Einstellungen speichern
            </button>

            <button
              type="button"
              onClick={deleteImage}
              disabled={loading}
              className="
                rounded-lg
                border
                border-red-200
                bg-red-50
                px-5
                py-3
                text-sm
                font-semibold
                text-red-700
                transition
                hover:bg-red-100
                disabled:opacity-50
              "
            >
              Bild löschen
            </button>
          </>
        )}

      </div>


      {/* =====================================================
          MELDUNGEN
      ===================================================== */}

      {message && (
        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

    </div>
  )
}