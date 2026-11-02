'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signIn, signInWithGoogle } from '@/app/actions/auth'
import logo from '@/components/logo.svg'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <section className="relative flex flex-1 w-full flex-col items-center justify-center bg-[#F7F4EE] px-5 py-16 text-[#2A2B2B]">
      <Link href="/" className="absolute left-8 top-8 inline-flex h-5 w-[49px] items-center">
        <Image src={logo} alt="Liminal" className="h-5 w-auto" sizes="49px" />
      </Link>

      <div className="relative w-full max-w-[400px]">


        {/* notebook page */}
        <div
          className="relative rounded-[4px] bg-[#FFFDF8] px-9 pb-10 pt-12 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] sm:px-12"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent, transparent 27px, #e8e2d6 28px)',
          }}
        >
          {/* red margin line */}
          <span className="pointer-events-none absolute bottom-6 top-12 left-6 w-px bg-[#c98a8a]/60 sm:left-8" />

          <h1 className="text-center text-[30px] leading-tight text-[#2A2B2B]">
            Welcome back
          </h1>
          <p className="mt-1 text-center text-[14px] text-[#9E9892]">
            Pick up where you left off
          </p>

          <form action={handleSubmit} className="relative mt-9 flex w-full flex-col gap-6">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full border-b border-[#c9c2b8] bg-transparent pb-2 pl-2 text-[15px] text-[#2A2B2B] placeholder-[#9E9892] outline-none focus:border-[#812121]"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full border-b border-[#c9c2b8] bg-transparent pb-2 pl-2 text-[15px] text-[#2A2B2B] placeholder-[#9E9892] outline-none focus:border-[#812121]"
            />

            {error && (
              <p className="text-center text-[13px] text-[#812121]">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-[44px] w-full items-center justify-center rounded-[6px] bg-[#2A2B2B] text-[16px] text-white transition hover:bg-[#812121] disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="relative my-7 flex w-full items-center gap-3">
            <span className="h-px flex-1 border-t border-dashed border-[#c9c2b8]" />
            <span className="text-[12px] text-[#9E9892]">or</span>
            <span className="h-px flex-1 border-t border-dashed border-[#c9c2b8]" />
          </div>

          <form action={signInWithGoogle} className="relative w-full">
            <button
              type="submit"
              className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[6px] border border-[#c9c2b8] bg-white text-[14px] text-[#2A2B2B] transition hover:bg-[#f7f5f2]"
            >
              Continue with Google
            </button>
          </form>

          <p className="relative mt-8 text-center text-[13px] text-[#6b6660]">
            New here?{' '}
            <Link href="/signup" className="text-[#812121] underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
