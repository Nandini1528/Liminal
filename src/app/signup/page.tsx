'use client'

import { useState } from 'react'
import { signUp } from '@/app/actions/auth'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    const result = await signUp(formData)
    if (result?.error) setError(result.error)
  }

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password (min 6 chars)" required />
      {error && <p>{error}</p>}
      <button type="submit">Sign Up</button>
      <a href="/login">Already have an account? Log in</a>
    </form>
  )
}