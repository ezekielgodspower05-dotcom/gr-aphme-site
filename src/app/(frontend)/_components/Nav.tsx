'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type User = { id: string; email: string; username?: string } | null

export function Nav() {
  const router = useRouter()
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users/me')
      .then((r) => r.json())
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    await fetch('/api/users/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <nav
      style={{
        maxWidth: 960,
        margin: '0 auto',
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
      }}
    >
      <Link
        href="/"
        style={{
          fontWeight: 700,
          fontSize: '1.15rem',
          textDecoration: 'none',
          marginRight: 'auto',
        }}
      >
        GR Aphme
      </Link>
      <Link href="/blog" style={{ textDecoration: 'none' }}>
        Blog
      </Link>
      <Link href="/community" style={{ textDecoration: 'none' }}>
        Community
      </Link>
      <Link href="/shop" style={{ textDecoration: 'none' }}>
        Shop
      </Link>

      {loading ? null : user ? (
        <>
          <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>{user.username || user.email}</span>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              textDecoration: 'none',
              font: 'inherit',
              padding: 0,
            }}
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            Log in
          </Link>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            Sign up
          </Link>
        </>
      )}
    </nav>
  )
}
