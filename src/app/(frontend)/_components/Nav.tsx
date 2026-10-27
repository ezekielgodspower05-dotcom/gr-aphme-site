'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from './CartContext'

type User = { id: string; email: string; username?: string } | null

export function Nav() {
  const router = useRouter()
  const { totalItems, openCart } = useCart()
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

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
    <nav style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Link
          href="/"
          style={{ fontWeight: 700, fontSize: '1.15rem', textDecoration: 'none', color: 'inherit' }}
        >
          GR Aphme
        </Link>

        {/* Desktop Links */}
        <div
          style={{ display: 'none', gap: '1.5rem', alignItems: 'center' }}
          className="desktop-nav"
        >
          <Link href="/blog" style={{ textDecoration: 'none', color: 'inherit' }}>
            Blog
          </Link>
          <Link href="/community" style={{ textDecoration: 'none', color: 'inherit' }}>
            Community
          </Link>
          <Link href="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>
            Shop
          </Link>

          {loading ? null : user ? (
            <>
              <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>
                {user.username || user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: 0,
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                Log in
              </Link>
              <Link href="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
                Sign up
              </Link>
            </>
          )}

          <button
            onClick={openCart}
            style={{
              background: 'none',
              border: '1px solid #444',
              color: 'inherit',
              padding: '0.4rem 0.75rem',
              borderRadius: 4,
              fontSize: '0.85rem',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            Cart
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: '#fff',
                  color: '#000',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button & Cart Icon */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="mobile-nav">
          <button
            onClick={openCart}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              position: 'relative',
              padding: 0,
            }}
          >
            🛒{' '}
            {totalItems > 0 && (
              <span
                style={{
                  background: '#fff',
                  color: '#000',
                  borderRadius: '50%',
                  padding: '0.1rem 0.4rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            paddingTop: '1rem',
            marginTop: '1rem',
            borderTop: '1px solid #222',
          }}
        >
          <Link
            href="/blog"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Blog
          </Link>
          <Link
            href="/community"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Community
          </Link>
          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Shop
          </Link>
          {loading ? null : user ? (
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: 0,
                textAlign: 'left',
              }}
            >
              Log out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}

      {/* Inline CSS for responsive design */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav { display: none !important; }
        }
      `,
        }}
      />
    </nav>
  )
}
