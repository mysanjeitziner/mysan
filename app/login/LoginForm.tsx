'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

const MYSAN_BLUE = '#1dabff'

export default function LoginForm() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const result = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      })

      if (result.error) {
        console.error('BETTER AUTH LOGIN ERROR:', result.error)
        setError('E-Mail oder Passwort ist falsch.')
        return
      }

      const sessionResult = await authClient.getSession()

      if (sessionResult.error || !sessionResult.data?.session) {
        console.error(
          'BETTER AUTH SESSION CHECK ERROR:',
          sessionResult.error
        )
        setError(
          'Die Anmeldung wurde nicht bestätigt. Bitte versuche es erneut.'
        )
        return
      }

      router.replace('/admin')
      router.refresh()
    } catch (err) {
      console.error('BETTER AUTH LOGIN UNEXPECTED ERROR:', err)
      setError(
        'Beim Anmelden ist ein Fehler aufgetreten. Bitte versuche es erneut.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F7FA] px-6">
      <div
        className="fixed left-0 top-0 h-full w-2"
        style={{ backgroundColor: MYSAN_BLUE }}
      />

      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <img
            src="/logo.jpg"
            alt="mySan Jeitziner GmbH"
            className="h-auto max-h-20 w-auto max-w-[220px] object-contain"
          />
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm md:p-10">
          <div className="mb-8">
            <div
              className="mb-4 h-1 w-12"
              style={{ backgroundColor: MYSAN_BLUE }}
            />

            <p
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: MYSAN_BLUE }}
            >
              mySan Jeitziner GmbH
            </p>

            <h1 className="mt-2 text-3xl font-light tracking-tight">
              Admin-Bereich
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Bitte melden Sie sich an.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                E-Mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="info@mysan.ch"
                className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1dabff] focus:ring-2 focus:ring-[#1dabff]/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Passwort
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1dabff] focus:ring-2 focus:ring-[#1dabff]/20"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: MYSAN_BLUE }}
            >
              {loading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-neutral-400 transition hover:text-[#1dabff]"
          >
            ← Zur Website
          </a>
        </div>
      </div>
    </main>
  )
}
