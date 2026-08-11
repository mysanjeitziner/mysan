
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Bereits eingeloggt?
  // Dann direkt ins Admin-Dashboard.
  if (user) {
    redirect('/admin')
  }

  return <LoginForm />
}

