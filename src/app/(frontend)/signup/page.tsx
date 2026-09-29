'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data?.errors?.[0]?.message || 'Signup failed. Please try again.')
      setLoading(false)
      return
    }

    // Auto-login after signup
    const loginRes = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (loginRes.ok) {
      router.push('/community')
      router.refresh()
    } else {
      router.push('/login')
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: '4rem auto', padding: '0 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create an account</h1>
      <p style={{ opacity: 0.6, marginBottom: '2rem' }}>
        Join the community to post threads and replies.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            style={inputStyle}
          />
        </label>

        {error && (
          <p style={{ color: '#ff6b6b', fontSize: '0.9rem', margin: 0 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1rem',
            background: '#fff',
            color: '#000',
            border: 'none',
            fontWeight: 600,
            borderRadius: 6,
            cursor: loading ? 'wait' : 'pointer',
            marginTop: '0.5rem',
          }}
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', opacity: 0.7, fontSize: '0.9rem' }}>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '0.65rem 0.75rem',
  background: '#111',
  border: '1px solid #333',
  borderRadius: 6,
  color: 'inherit',
  fontSize: '1rem',
}