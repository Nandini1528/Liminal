import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncUser } from '@/lib/sync-user'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      try {
        await syncUser(data.user)
      } catch (e) {
        console.error('callback: failed to sync user to Prisma:', e)
        return NextResponse.redirect(`${origin}/login?error=setup_failed`)
      }
      return NextResponse.redirect(`${origin}/journal`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}