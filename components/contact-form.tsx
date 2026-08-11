'use client'

import { FormEvent, useState } from 'react'

const MYSAN_BLUE = '#1dabff'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)
    setSuccess(false)
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)

    const data = {
      name: formData.get('name'),
      vorname: formData.get('vorname'),
      plz: formData.get('plz'),
      ort: formData.get('ort'),
      email: formData.get('email'),
      nachricht: formData.get('nachricht'),
    }

    try {
      const response = await fetch('/api/kontakt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.error || 'Die Nachricht konnte nicht gesendet werden.'
        )
      }

      setSuccess(true)
      form.reset()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Die Nachricht konnte nicht gesendet werden.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      <div className="grid gap-5 md:grid-cols-2">

        {/* NAME */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium"
          >
            Name <span style={{ color: MYSAN_BLUE }}>*</span>
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            className="
              w-full
              border
              border-neutral-200
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-[#1dabff]
              focus:ring-1
              focus:ring-[#1dabff]
            "
          />
        </div>

        {/* VORNAME */}
        <div>
          <label
            htmlFor="vorname"
            className="mb-2 block text-sm font-medium"
          >
            Vorname
          </label>

          <input
            id="vorname"
            name="vorname"
            type="text"
            className="
              w-full
              border
              border-neutral-200
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-[#1dabff]
              focus:ring-1
              focus:ring-[#1dabff]
            "
          />
        </div>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {/* PLZ */}
        <div>
          <label
            htmlFor="plz"
            className="mb-2 block text-sm font-medium"
          >
            PLZ <span style={{ color: MYSAN_BLUE }}>*</span>
          </label>

          <input
            id="plz"
            name="plz"
            type="text"
            inputMode="numeric"
            required
            className="
              w-full
              border
              border-neutral-200
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-[#1dabff]
              focus:ring-1
              focus:ring-[#1dabff]
            "
          />
        </div>

        {/* ORT */}
        <div>
          <label
            htmlFor="ort"
            className="mb-2 block text-sm font-medium"
          >
            Ort <span style={{ color: MYSAN_BLUE }}>*</span>
          </label>

          <input
            id="ort"
            name="ort"
            type="text"
            required
            className="
              w-full
              border
              border-neutral-200
              bg-white
              px-4
              py-3
              text-sm
              outline-none
              transition
              focus:border-[#1dabff]
              focus:ring-1
              focus:ring-[#1dabff]
            "
          />
        </div>

      </div>

      {/* EMAIL */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium"
        >
          E-Mail Adresse <span style={{ color: MYSAN_BLUE }}>*</span>
        </label>

        <input
          id="email"
          name="email"
          type="email"
          required
          className="
            w-full
            border
            border-neutral-200
            bg-white
            px-4
            py-3
            text-sm
            outline-none
            transition
            focus:border-[#1dabff]
            focus:ring-1
            focus:ring-[#1dabff]
          "
        />
      </div>

      {/* NACHRICHT */}
      <div>
        <label
          htmlFor="nachricht"
          className="mb-2 block text-sm font-medium"
        >
          Nachricht <span style={{ color: MYSAN_BLUE }}>*</span>
        </label>

        <textarea
          id="nachricht"
          name="nachricht"
          required
          rows={7}
          className="
            w-full
            resize-y
            border
            border-neutral-200
            bg-white
            px-4
            py-3
            text-sm
            outline-none
            transition
            focus:border-[#1dabff]
            focus:ring-1
            focus:ring-[#1dabff]
          "
        />
      </div>

      {/* FEHLER */}
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ERFOLG */}
      {success && (
        <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Vielen Dank für Ihre Nachricht. Wir melden uns
          schnellstmöglich bei Ihnen.
        </div>
      )}

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="
          inline-flex
          h-11
          items-center
          justify-center
          rounded-full
          px-7
          text-sm
          font-semibold
          text-white
          transition
          hover:-translate-y-0.5
          hover:opacity-90
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
        style={{
          backgroundColor: MYSAN_BLUE,
        }}
      >
        {loading ? 'Wird gesendet...' : 'Nachricht senden'}

        {!loading && (
          <span className="ml-3 text-lg">
            →
          </span>
        )}
      </button>

    </form>
  )
}