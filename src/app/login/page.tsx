'use client'

import { useState } from 'react'
import { signIn } from '@/app/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    const result = await signIn(formData)
    if (result?.error) setError(result.error)
  }

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      {error && <p>{error}</p>}
      <button type="submit">Log In</button>
      <a href="/signup">Don't have an account? Sign up</a>
    </form>
  )
}