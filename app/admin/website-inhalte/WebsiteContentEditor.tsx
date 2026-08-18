'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type SiteContent = {
  id: string
  page: string
  section: string
  content_key: string
  content: string
  sort_order: number
  visible: boolean
  created_at?: string
  updated_at?: string
}

type Props = {
  initialContents: SiteContent[]
}

const MYSAN_BLUE = '#1dabff'

const PAGE_NAMES: Record<string, string> = {
  home: 'Startseite',
  dienstleistungen: 'Dienstleistungen',
  referenzen: 'Referenzen',
  team: 'Team',
  kontakt: 'Kontakt',
  news: 'News',
  datenschutz: 'Datenschutz',
  impressum: 'Impressum',
  footer: 'Footer',
}

const SECTION_NAMES: Record<string, string> = {
  hero: 'Hero / Kopfbereich',
  intro: 'Einleitung',
  services: 'Dienstleistungen',
  references: 'Referenzen',
  news: 'News',
  contact: 'Kontakt',
  footer: 'Footer',
  general: 'Allgemein',
  team: 'Team',
  values: 'Werte',
}

const CONTENT_NAMES: Record<string, string> = {
  eyebrow: 'Kleine Überschrift',
  title: 'Hauptüberschrift',
  description: 'Beschreibung',
  text: 'Text',
  text_1: 'Text 1',
  text_2: 'Text 2',
  heading: 'Überschrift',
  subheading: 'Unterüberschrift',
  quote: 'Zitat',
  quote_author: 'Zitat – Autor',
  button: 'Button',
  button_text: 'Button-Text',
  intro: 'Einleitung',
  mathias: 'Mathias',
  passion: 'Leidenschaft',
  company: 'Unternehmen',
  evelyne: 'Evelyne',
  conclusion: 'Abschluss',
  personal_title: 'Persönlich – Titel',
  personal_text: 'Persönlich – Text',
  grounded_title: 'Bodenständig – Titel',
  grounded_text: 'Bodenständig – Text',
  reliable_title: 'Zuverlässig – Titel',
  reliable_text: 'Zuverlässig – Text',
}

export default function WebsiteContentEditor({
  initialContents,
}: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [contents, setContents] =
    useState<SiteContent[]>(
      initialContents.map((item) => ({
        ...item,

        // Falls ältere Datensätze noch keinen
        // Wert haben sollten, standardmässig anzeigen.
        visible:
          typeof item.visible === 'boolean'
            ? item.visible
            : true,
      }))
    )

  const [savingId, setSavingId] =
    useState<string | null>(null)

  const [message, setMessage] =
    useState('')

  const [errorMessage, setErrorMessage] =
    useState('')

  /* =========================================================
     TEXT ÄNDERN
  ========================================================= */

  function updateContent(
    id: string,
    value: string
  ) {
    setContents((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              content: value,
            }
          : item
      )
    )

    setMessage('')
    setErrorMessage('')
  }

  /* =========================================================
     VISIBLE ÄNDERN
  ========================================================= */

  function updateVisible(
    id: string,
    value: boolean
  ) {
    setContents((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              visible: value,
            }
          : item
      )
    )

    setMessage('')
    setErrorMessage('')
  }

  /* =========================================================
     EINEN EINTRAG SPEICHERN
  ========================================================= */

  async function saveContent(
    item: SiteContent
  ) {
    setSavingId(item.id)

    setMessage('')
    setErrorMessage('')

    const { error } = await supabase
      .from('site_content')
      .update({
        content: item.content,
        visible: item.visible,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id)

    if (error) {
      console.error(error)

      setErrorMessage(
        `Fehler beim Speichern: ${error.message}`
      )

      setSavingId(null)

      return
    }

    setMessage(
      `"${getContentName(
        item.content_key
      )}" wurde gespeichert.`
    )

    setSavingId(null)

    router.refresh()
  }

  /* =========================================================
     ALLE SPEICHERN
  ========================================================= */

  async function saveAll() {
    setSavingId('all')
    setMessage('')
    setErrorMessage('')

    try {

      for (const item of contents) {

        const { error } = await supabase
          .from('site_content')
          .update({
            content: item.content,
            visible: item.visible,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id)

        if (error) {
          throw error
        }
      }

      setMessage(
        'Alle Website-Inhalte wurden gespeichert.'
      )

      router.refresh()

    } catch (error) {

      console.error(error)

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Die Inhalte konnten nicht gespeichert werden.'
      )

    } finally {

      setSavingId(null)

    }
  }

  /* =========================================================
     NAMEN
  ========================================================= */

  function getPageName(page: string) {
    return PAGE_NAMES[page] || page
  }

  function getSectionName(section: string) {
    return (
      SECTION_NAMES[section] ||
      section
    )
  }

  function getContentName(key: string) {
    return (
      CONTENT_NAMES[key] ||
      key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        )
    )
  }

  /* =========================================================
     GRUPPIEREN
  ========================================================= */

  const grouped = contents.reduce<
    Record<string, SiteContent[]>
  >((groups, item) => {

    const key =
      `${item.page}-${item.section}`

    if (!groups[key]) {
      groups[key] = []
    }

    groups[key].push(item)

    return groups

  }, {})

  return (
    <div className="space-y-8">

      {/* =====================================================
          ERKLÄRUNG
      ===================================================== */}

      <section className="overflow-hidden bg-white shadow-sm">

        <div
          className="border-l-4 p-6 md:p-8"
          style={{
            borderColor: MYSAN_BLUE,
          }}
        >

          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

            <div>

              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: MYSAN_BLUE,
                }}
              >
                Inhaltsverwaltung
              </p>

              <h2 className="mt-2 text-2xl font-light md:text-3xl">
                Texte der Website bearbeiten
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">
                Hier kannst du die Texte deiner Website
                bearbeiten.
                Zusätzlich kannst du bei jedem Inhalt
                festlegen, ob er auf der Website
                angezeigt werden soll.
              </p>

            </div>

            <button
              type="button"
              onClick={saveAll}
              disabled={savingId !== null}
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                rounded-xl
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              style={{
                backgroundColor: MYSAN_BLUE,
              }}
            >
              {savingId === 'all'
                ? 'Speichern...'
                : 'Alle speichern'}
            </button>

          </div>

          {/* =================================================
              FORMATIERUNG
          ================================================= */}

          <div className="mt-8 border-t border-neutral-200 pt-6">

            <h3 className="text-sm font-semibold">
              Formatierung
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              Du kannst einfache Formatierungen direkt
              im Text verwenden.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">

              {/* FETT */}

              <div className="bg-[#F4F7FA] p-5">

                <div className="font-semibold">
                  Fett
                </div>

                <p className="mt-2 text-sm text-neutral-600">
                  Text zwischen zwei Sternchen setzen:
                </p>

                <div className="mt-3 rounded-lg bg-white p-3">

                  <code className="text-xs">
                    **Wichtiger Text**
                  </code>

                  <div className="mt-2 text-sm">
                    → <strong>Wichtiger Text</strong>
                  </div>

                </div>

              </div>

              {/* AUFZÄHLUNG */}

              <div className="bg-[#F4F7FA] p-5">

                <div className="font-semibold">
                  Aufzählung
                </div>

                <p className="mt-2 text-sm text-neutral-600">
                  Jede Zeile mit <code>-</code> beginnen:
                </p>

                <div className="mt-3 rounded-lg bg-white p-3">

                  <code className="text-xs">
                    - Reparaturen
                    <br />
                    - Neuinstallationen
                    <br />
                    - Umbauten
                  </code>

                  <div className="mt-2 text-sm">
                    → • Reparaturen
                    <br />
                    → • Neuinstallationen
                    <br />
                    → • Umbauten
                  </div>

                </div>

              </div>

              {/* ABSATZ */}

              <div className="bg-[#F4F7FA] p-5">

                <div className="font-semibold">
                  Absätze
                </div>

                <p className="mt-2 text-sm text-neutral-600">
                  Einfach eine Leerzeile zwischen
                  zwei Absätzen lassen.
                </p>

                <div className="mt-3 rounded-lg bg-white p-3 text-xs leading-5">
                  Erster Absatz.
                  <br />
                  <br />
                  Zweiter Absatz.
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              VISIBLE ERKLÄRUNG
          ================================================= */}

          <div className="mt-6 border-t border-neutral-200 pt-6">

            <h3 className="text-sm font-semibold">
              Sichtbarkeit
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
              Jeder Text kann einzeln aktiviert oder
              deaktiviert werden.
            </p>

            <div className="mt-3 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">

              <strong>Anzeigen:</strong>{' '}
              Der Inhalt wird auf der Website verwendet.

              <br />

              <strong>Ausgeblendet:</strong>{' '}
              Der Inhalt bleibt in Supabase gespeichert,
              wird aber auf der Website nicht angezeigt.

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          STATUS
      ===================================================== */}

      {message && (
        <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* =====================================================
          INHALTE
      ===================================================== */}

      {Object.entries(grouped).map(
        ([groupKey, items]) => {

          const first = items[0]

          return (
            <section
              key={groupKey}
              className="overflow-hidden bg-white shadow-sm"
            >

              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="border-b border-neutral-200 bg-white px-6 py-5 md:px-8">

                <p
                  className="text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{
                    color: MYSAN_BLUE,
                  }}
                >
                  {getPageName(first.page)}
                </p>

                <h2 className="mt-1 text-2xl font-light">
                  {getSectionName(first.section)}
                </h2>

              </div>

              {/* =================================================
                  FELDER
              ================================================= */}

              <div className="divide-y divide-neutral-200">

                {items.map((item) => (

                  <div
                    key={item.id}
                    className="p-6 md:p-8"
                  >

                    {/* =================================================
                        LABEL
                    ================================================= */}

                    <div className="mb-4">

                      <label className="block text-sm font-semibold">
                        {getContentName(
                          item.content_key
                        )}
                      </label>

                      <p className="mt-1 text-xs text-neutral-400">
                        Schlüssel: {item.content_key}
                      </p>

                    </div>

                    {/* =================================================
                        TEXTAREA
                    ================================================= */}

                    <textarea
                      value={item.content}
                      onChange={(event) =>
                        updateContent(
                          item.id,
                          event.target.value
                        )
                      }
                      rows={7}
                      spellCheck
                      className="
                        w-full
                        resize-y
                        rounded-xl
                        border
                        border-neutral-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        leading-7
                        text-neutral-800
                        outline-none
                        transition
                        placeholder:text-neutral-300
                        focus:border-[#1dabff]
                        focus:ring-2
                        focus:ring-[#1dabff]/20
                      "
                    />

                    {/* =================================================
                        SICHTBARKEIT + SPEICHERN
                    ================================================= */}

                    <div className="mt-5 flex flex-col gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 md:flex-row md:items-center md:justify-between">

                      {/* SCHALTER */}

                      <div className="flex items-center gap-4">

                        <button
                          type="button"
                          role="switch"
                          aria-checked={item.visible}
                          onClick={() =>
                            updateVisible(
                              item.id,
                              !item.visible
                            )
                          }
                          className={`
                            relative
                            inline-flex
                            h-7
                            w-12
                            shrink-0
                            cursor-pointer
                            rounded-full
                            transition
                            duration-200
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[#1dabff]/30
                            ${
                              item.visible
                                ? 'bg-[#1dabff]'
                                : 'bg-neutral-300'
                            }
                          `}
                        >

                          <span
                            className={`
                              pointer-events-none
                              inline-block
                              h-5
                              w-5
                              translate-y-1
                              rounded-full
                              bg-white
                              shadow
                              transition
                              duration-200
                              ${
                                item.visible
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }
                            `}
                          />

                        </button>

                        <div>

                          <p className="text-sm font-semibold text-neutral-800">

                            {item.visible
                              ? 'Anzeigen'
                              : 'Ausgeblendet'}

                          </p>

                          <p className="text-xs text-neutral-500">

                            {item.visible
                              ? 'Dieser Inhalt wird auf der Website angezeigt.'
                              : 'Dieser Inhalt wird auf der Website nicht angezeigt.'}

                          </p>

                        </div>

                      </div>

                      {/* SPEICHERN */}

                      <button
                        type="button"
                        onClick={() =>
                          saveContent(item)
                        }
                        disabled={
                          savingId !== null
                        }
                        className="
                          inline-flex
                          items-center
                          justify-center
                          rounded-xl
                          bg-black
                          px-5
                          py-2.5
                          text-sm
                          font-medium
                          text-white
                          transition
                          hover:bg-neutral-800
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >

                        {savingId === item.id
                          ? 'Speichern...'
                          : 'Text + Sichtbarkeit speichern'}

                      </button>

                    </div>

                    {/* HINWEIS */}

                    <div className="mt-3">

                      <p className="text-xs leading-5 text-neutral-400">

                        Zeilenumbrüche bleiben erhalten.
                        <br />

                        <strong>**Text**</strong>{' '}
                        wird fett dargestellt.

                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </section>
          )
        }
      )}

      {/* =====================================================
          KEINE INHALTE
      ===================================================== */}

      {contents.length === 0 && (

        <div className="bg-white p-12 text-center shadow-sm">

          <h2 className="text-xl font-semibold">
            Noch keine Website-Inhalte
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            In der Tabelle site_content wurden noch
            keine Inhalte angelegt.
          </p>

        </div>

      )}

    </div>
  )
}