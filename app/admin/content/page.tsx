import { createClient } from '@/lib/supabase/server'

import {
  deleteHeroImage,
  saveHeroImage,
  updateHeroSettings,
} from './actions'

const PAGES = [
  {
    key: 'home',
    title: 'Startseite',
  },
  {
    key: 'team',
    title: 'Team',
  },
  {
    key: 'referenzen',
    title: 'Referenzen',
  },
  {
    key: 'news',
    title: 'News',
  },
]

export default async function AdminContentPage() {

  const supabase = await createClient()

  /* =========================================================
     ADMIN CHECK
  ========================================================= */

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="p-10">
        <h1 className="text-2xl">
          Nicht angemeldet
        </h1>
      </main>
    )
  }

  if (
    user.app_metadata?.role !== 'admin'
  ) {
    return (
      <main className="p-10">
        <h1 className="text-2xl">
          Keine Berechtigung
        </h1>
      </main>
    )
  }

  /* =========================================================
     HERO MEDIEN
  ========================================================= */

  const {
    data: media,
  } = await supabase
    .from('page_media')
    .select('*')
    .eq(
      'media_type',
      'hero'
    )

  const mediaMap =
    new Map(
      (media || []).map(
        (item) => [
          item.page,
          item,
        ]
      )
    )

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-[#f5f7fa]
        px-6
        py-10
        md:px-10
      "
    >

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10">

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#1dabff]
            "
          >
            mySan Jeitziner
          </p>

          <h1
            className="
              mt-2
              text-4xl
              font-light
            "
          >
            Website Inhalte
          </h1>

          <p
            className="
              mt-3
              text-neutral-500
            "
          >
            Texte und Hero-Bilder der Website verwalten.
          </p>

        </div>

        {/* =================================================
            HERO BILDER
        ================================================= */}

        <div className="grid gap-8 lg:grid-cols-2">

          {PAGES.map((page) => {

            const item =
              mediaMap.get(
                page.key
              )

            return (

              <section
                key={page.key}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-neutral-200
                  bg-white
                  shadow-sm
                "
              >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                  className="
                    border-b
                    border-neutral-200
                    px-6
                    py-5
                  "
                >

                  <h2
                    className="
                      text-xl
                      font-medium
                    "
                  >
                    {page.title}
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-neutral-500
                    "
                  >
                    Hero-Bild
                  </p>

                </div>

                {/* =================================================
                    BILD
                ================================================= */}

                <div
                  className="
                    aspect-[16/8]
                    bg-[#f4f7fa]
                  "
                >

                  {item?.public_url ? (

                    <img
                      src={
                        item.public_url
                      }
                      alt={
                        item.alt_text ||
                        page.title
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                      style={{
                        opacity:
                          item.opacity ??
                          0.18,
                      }}
                    />

                  ) : (

                    <div
                      className="
                        flex
                        h-full
                        items-center
                        justify-center
                        text-sm
                        text-neutral-400
                      "
                    >
                      Kein Hero-Bild vorhanden
                    </div>

                  )}

                </div>

                {/* =================================================
                    CONTROLS
                ================================================= */}

                <div className="space-y-6 p-6">

                  {/* =================================================
                      UPLOAD
                  ================================================= */}

                  <form
                    action={async (
                      formData: FormData
                    ) => {
                      await saveHeroImage(
                        formData
                      )
                    }}
                    className="
                      space-y-3
                    "
                  >

                    <input
                      type="hidden"
                      name="page"
                      value={
                        page.key
                      }
                    />

                    <label
                      className="
                        block
                        text-sm
                        font-medium
                      "
                    >
                      Neues Bild
                    </label>

                    <input
                      type="file"
                      name="file"
                      accept="
                        image/jpeg,
                        image/png,
                        image/webp,
                        image/avif
                      "
                      required
                      className="
                        block
                        w-full
                        rounded-lg
                        border
                        border-neutral-300
                        bg-white
                        px-3
                        py-2
                        text-sm
                      "
                    />

                    <button
                      type="submit"
                      className="
                        inline-flex
                        rounded-full
                        bg-[#1dabff]
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:opacity-90
                      "
                    >
                      {item
                        ? 'Bild ersetzen'
                        : 'Bild hochladen'}
                    </button>

                  </form>

                  {/* =================================================
                      OPACITY
                  ================================================= */}

                  {item && (

                    <form
                      action={async (
                        formData: FormData
                      ) => {
                        await updateHeroSettings(
                          formData
                        )
                      }}
                      className="
                        space-y-4
                        border-t
                        border-neutral-200
                        pt-5
                      "
                    >

                      <input
                        type="hidden"
                        name="page"
                        value={
                          page.key
                        }
                      />

                      <div>

                        <label
                          htmlFor={`opacity-${page.key}`}
                          className="
                            block
                            text-sm
                            font-medium
                          "
                        >
                          Bildstärke
                        </label>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-neutral-500
                          "
                        >
                          0 = unsichtbar ·
                          1 = vollständig sichtbar
                        </p>

                      </div>

                      <input
                        id={`opacity-${page.key}`}
                        type="number"
                        name="opacity"
                        min="0"
                        max="1"
                        step="0.05"
                        defaultValue={
                          item.opacity ??
                          0.18
                        }
                        className="
                          w-full
                          rounded-lg
                          border
                          border-neutral-300
                          px-3
                          py-2
                        "
                      />

                      <select
                        name="visible"
                        defaultValue={
                          item.visible
                            ? 'true'
                            : 'false'
                        }
                        className="
                          w-full
                          rounded-lg
                          border
                          border-neutral-300
                          px-3
                          py-2
                        "
                      >

                        <option value="true">
                          Bild anzeigen
                        </option>

                        <option value="false">
                          Bild ausblenden
                        </option>

                      </select>

                      <button
                        type="submit"
                        className="
                          rounded-full
                          border
                          border-neutral-300
                          px-5
                          py-2.5
                          text-sm
                          font-semibold
                          transition
                          hover:bg-neutral-50
                        "
                      >
                        Einstellungen speichern
                      </button>

                    </form>

                  )}

                  {/* =================================================
                      DELETE
                  ================================================= */}

                  {item && (

                    <form
                      action={async (
                        formData: FormData
                      ) => {
                        await deleteHeroImage(
                          formData
                        )
                      }}
                      className="
                        border-t
                        border-neutral-200
                        pt-5
                      "
                    >

                      <input
                        type="hidden"
                        name="page"
                        value={
                          page.key
                        }
                      />

                      <button
                        type="submit"
                        className="
                          text-sm
                          font-medium
                          text-red-600
                          hover:text-red-700
                        "
                      >
                        Hero-Bild löschen
                      </button>

                    </form>

                  )}

                </div>

              </section>

            )
          })}

        </div>

      </div>

    </main>
  )
}