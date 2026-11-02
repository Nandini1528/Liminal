import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/journal', '/entries', '/collection']
const AUTH_PAGES = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error && error.name !== 'AuthSessionMissingError') {
    console.error('Supabase middleware authentication error:', error.message)
  }

  const path = request.nextUrl.pathname
  const redirectTo = (to: string) => {
    const res = NextResponse.redirect(new URL(to, request.url))
    response.cookies.getAll().forEach((c) => res.cookies.set(c)) // keep refreshed session cookies
    return res
  }

  if (!user && PROTECTED.some((p) => path.startsWith(p))) return redirectTo('/login')
  if (user && AUTH_PAGES.includes(path)) return redirectTo('/journal')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}