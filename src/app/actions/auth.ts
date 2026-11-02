'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { syncUser } from '@/lib/sync-user'

export async function signUp(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) return { error: error.message }

  // Supabase returns a user with no identities if the email is already registered
  if (data.user && data.user.identities?.length === 0) {
    return { error: 'An account with this email already exists. Try logging in.' }
  }

  if (!data.user || !data.session) {
    return { error: 'Signup worked but no session was created. Check that "Confirm email" is off in Supabase.' }
  }

  try {
    await syncUser(data.user)
  } catch (e) {
    console.error('signUp: failed to sync user to Prisma:', e)
    return { error: "Your account was created, but we couldn't finish setting it up. Please log in." }
  }

  redirect('/journal') // keep outside try/catch
}

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    return { error: error?.message ?? 'Could not log you in.' }
  }

  try {
    await syncUser(data.user) // repairs a missing Prisma row so journal saves never hit a foreign key error
  } catch (e) {
    console.error('signIn: failed to sync user to Prisma:', e)
    return { error: 'Something went wrong on our side. Please try again.' }
  }

  redirect('/journal')
}

export async function signInWithGoogle() {
  const h = await headers()
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL || h.get('origin') || 'http://localhost:3000'

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      // Always show Google's account picker instead of auto-using the first account
      queryParams: { prompt: 'select_account' },
    },
  })

  if (error || !data.url) {
    redirect('/login?error=google_auth_failed')
  }

  redirect(data.url)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}