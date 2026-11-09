'use client'

import { useEffect, useState } from 'react'

type SiteContent = {
  id: string
  page: string
  section: string | null
  content_key: string
  content: string | null
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
  const [contents, setContents] = useState<SiteContent[]>(
    initialContents.map((item) => ({
      ...item,
      section: item.section ?? '',
      content: item.content ?? '',
      visible: typeof item.visible === 'boolean' ? item.visible : true,
    }))
  )

  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // Inhalte aus Neon laden
  useEffect(() => {
    let cancelled = false

    async function loadContents() {
      try {
        const response = await fetch('/api/admin/site-content', {
          method: 'GET',
          cache: 'no-store',
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.error || 'Die Inhalte konnten nicht geladen werden.'
          )
        }

        if (!cancelled) {
          setContents(
            (result.contents ?? []).map((item: SiteContent) => ({
              ...item,
              section: item.section ?? '',
              content: item.content ?? '',
              visible:
                typeof item.visible === 'boolean' ? item.visible : true,
            }))
          )
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Die Inhalte konnten nicht geladen werden.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadContents()

    return () => {
      cancelled = true
    }
  }, [])

  function getPageName(page: string) {
    return PAGE_NAMES[page] || page
  }

  function getSectionName(section: string | null) {
    if (!section) return 'Allgemein'
    return SECTION_NAMES[section] || section
  }

  function getContentName(key: string) {
    return (
      CONTENT_NAMES[key] ||
      key.replace(/_/g, ' ').replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
    )
  }

  function updateContent(id: string, value: string) {
    setContents((current) =>
      current.map((item) =>
        item.id === id ? { ...item, content: value } : item
      )
    )
    setMessage('')
    setErrorMessage('')
  }

  function updateVisible(id: string, value: boolean) {
    setContents((current) =>
      current.map((item) =>
        item.id === id ? { ...item, visible: value } : item
      )
    )
    setMessage('')
    setErrorMessage('')
  }

  // Einen Eintrag über die Neon-API speichern
  async function saveContent(item: SiteContent) {
    setSavingId(item.id)
    setMessage('')
    setErrorMessage('')

    try {
      const response = await fetch('/api/admin/site-content', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: item.id,
          content: item.content,
          visible: item.visible,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Speichern fehlgeschlagen.')
      }

      const saved = result.content

      setContents((current) =>
        current.map((content) =>
          content.id === item.id
            ? {
                ...content,
                content: saved.content ?? '',
                visible:
                  typeof saved.visible === 'boolean'
                    ? saved.visible
                    : content.visible,
              }
            : content
        )
      )

      setMessage(
        `"${getContentName(item.content_key)}" wurde erfolgreich in Neon gespeichert.`
      )
    } catch (error) {
      console.error('NEON SAVE ERROR:', error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Die Inhalte konnten nicht gespeichert werden.'
      )
    } finally {
      setSavingId(null)
    }
  }

  // Alle Einträge nacheinander speichern
  async function saveAll() {
    setSavingId('all')
    setMessage('')
    setErrorMessage('')

    try {
      for (const item of contents) {
        const response = await fetch('/api/admin/site-content', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: item.id,
            content: item.content,
            visible: item.visible,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            `${getContentName(item.content_key)}: ${
              result.error || 'Speichern fehlgeschlagen.'
            }`
          )
        }

        const saved = result.content

        setContents((current) =>
          current.map((content) =>
            content.id === item.id
              ? {
                  ...content,
                  content: saved.content ?? '',
                  visible:
                    typeof saved.visible === 'boolean'
                      ? saved.visible
                      : content.visible,
                }
              : content
          )
        )
      }

      setMessage('Alle Website-Inhalte wurden erfolgreich in Neon gespeichert.')
    } catch (error) {
      console.error('NEON SAVE ALL ERROR:', error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Die Inhalte konnten nicht vollständig gespeichert werden.'
      )
    } finally {
      setSavingId(null)
    }
  }

  const grouped = contents.reduce<Record<string, SiteContent[]>>(
    (groups, item) => {
      const key = `${item.page}-${item.section ?? ''}`
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
      return groups
    },
    {}
  )

  return (
    <div className="space-y-8">
      <section className="overflow-hidden bg-white shadow-sm">
        <div
          className="border-l-4 p-6 md:p-8"
          style={{ borderColor: MYSAN_BLUE }}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: MYSAN_BLUE }}
              >
                Inhaltsverwaltung
              </p>

              <h2 className="mt-2 text-2xl font-light md:text-3xl">
                Texte der Website bearbeiten
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">
                Bearbeite hier die Website-Texte und lege fest, welche Inhalte
                angezeigt werden sollen.
              </p>
            </div>

            <button
              type="button"
              onClick={saveAll}
              disabled={savingId !== null || loading}
              className="inline-flex shrink-0 items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: MYSAN_BLUE }}
            >
              {savingId === 'all' ? 'Speichern...' : 'Alle speichern'}
            </button>
          </div>

          <div className="mt-8 border-t border-neutral-200 pt-6">
            <h3 className="text-sm font-semibold">Formatierung</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Einfache Formatierungen kannst du direkt im Text verwenden.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="bg-[#F4F7FA] p-5">
                <div className="font-semibold">Fett</div>
                <p className="mt-2 text-sm text-neutral-600">
                  Text zwischen zwei Sternchen setzen:
                </p>
                <div className="mt-3 rounded-lg bg-white p-3">
                  <code className="text-xs">**Wichtiger Text**</code>
                  <div className="mt-2 text-sm">
                    → <strong>Wichtiger Text</strong>
                  </div>
                </div>
              </div>

              <div className="bg-[#F4F7FA] p-5">
                <div className="font-semibold">Aufzählung</div>
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
                </div>
              </div>

              <div className="bg-[#F4F7FA] p-5">
                <div className="font-semibold">Absätze</div>
                <p className="mt-2 text-sm text-neutral-600">
                  Eine Leerzeile zwischen zwei Absätzen lassen.
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

          <div className="mt-6 border-t border-neutral-200 pt-6">
            <h3 className="text-sm font-semibold">Sichtbarkeit</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Jeder Text kann einzeln aktiviert oder deaktiviert werden.
            </p>
            <div className="mt-3 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
              <strong>Anzeigen:</strong> Der Inhalt wird auf der Website verwendet.
              <br />
              <strong>Ausgeblendet:</strong> Der Inhalt bleibt in Neon gespeichert,
              wird aber auf der Website nicht angezeigt.
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <div className="bg-white p-6 text-sm text-neutral-500 shadow-sm">
          Website-Inhalte werden geladen...
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-xl bg-green-50 p-4 text-sm text-green-700"
        >
          {message}
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="whitespace-pre-line rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {!loading &&
        Object.entries(grouped).map(([groupKey, items]) => {
          const first = items[0]

          return (
            <section
              key={groupKey}
              className="overflow-hidden bg-white shadow-sm"
            >
              <div className="border-b border-neutral-200 bg-white px-6 py-5 md:px-8">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{ color: MYSAN_BLUE }}
                >
                  {getPageName(first.page)}
                </p>
                <h2 className="mt-1 text-2xl font-light">
                  {getSectionName(first.section)}
                </h2>
              </div>

              <div className="divide-y divide-neutral-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6 md:p-8">
                    <div className="mb-4">
                      <label
                        htmlFor={`content-${item.id}`}
                        className="block text-sm font-semibold"
                      >
                        {getContentName(item.content_key)}
                      </label>
                      <p className="mt-1 text-xs text-neutral-400">
                        Schlüssel: {item.content_key}
                      </p>
                    </div>

                    <textarea
                      id={`content-${item.id}`}
                      value={item.content ?? ''}
                      onChange={(event) =>
                        updateContent(item.id, event.target.value)
                      }
                      rows={7}
                      spellCheck
                      className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm leading-7 text-neutral-800 outline-none transition placeholder:text-neutral-300 focus:border-[#1dabff] focus:ring-2 focus:ring-[#1dabff]/20"
                    />

                    <div className="mt-5 flex flex-col gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          role="switch"
                          aria-label={`Sichtbarkeit für ${getContentName(item.content_key)}`}
                          aria-checked={item.visible}
                          onClick={() =>
                            updateVisible(item.id, !item.visible)
                          }
                          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#1dabff]/30 ${
                            item.visible ? 'bg-[#1dabff]' : 'bg-neutral-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 translate-y-1 rounded-full bg-white shadow transition duration-200 ${
                              item.visible ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>

                        <div>
                          <p className="text-sm font-semibold text-neutral-800">
                            {item.visible ? 'Anzeigen' : 'Ausgeblendet'}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {item.visible
                              ? 'Dieser Inhalt wird auf der Website angezeigt.'
                              : 'Dieser Inhalt wird auf der Website nicht angezeigt.'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => saveContent(item)}
                        disabled={savingId !== null || loading}
                        className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {savingId === item.id
                          ? 'Speichern...'
                          : 'Text + Sichtbarkeit speichern'}
                      </button>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-neutral-400">
                      Zeilenumbrüche bleiben erhalten. <strong>**Text**</strong>{' '}
                      wird fett dargestellt.
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )
        })}

      {!loading && contents.length === 0 && (
        <div className="bg-white p-12 text-center shadow-sm">
          <h2 className="text-xl font-semibold">
            Noch keine Website-Inhalte
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            In der Neon-Tabelle site_content wurden noch keine Inhalte gefunden.
          </p>
        </div>
      )}
    </div>
  )
}
