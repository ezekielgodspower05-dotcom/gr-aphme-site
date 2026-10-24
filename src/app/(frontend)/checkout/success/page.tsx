'use client'
import { useCart } from '../../_components/CartContext'
import { useEffect, useState, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const hasCleared = useRef(false)

  useEffect(() => {
    // We will use this later to clear the cart or show order details
    if (sessionId && !hasCleared.current) {
      hasCleared.current = true // Set the lock
      clearCart()
      setLoading(false)
    }
  }, [sessionId, clearCart])

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading...</div>

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Payment Successful!</h1>

      <p style={{ opacity: 0.8, fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        Thank you for your order. We've received your payment and are getting your items ready.
      </p>

      {sessionId && (
        <p
          style={{
            opacity: 0.4,
            fontSize: '0.85rem',
            marginBottom: '3rem',
            fontFamily: 'monospace',
          }}
        >
          Order Ref: {sessionId}
        </p>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link
          href="/shop"
          style={{
            padding: '0.85rem 1.5rem',
            background: '#fff',
            color: '#000',
            textDecoration: 'none',
            fontWeight: 600,
            borderRadius: 6,
          }}
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          style={{
            padding: '0.85rem 1.5rem',
            border: '1px solid #444',
            color: 'inherit',
            textDecoration: 'none',
            fontWeight: 600,
            borderRadius: 6,
          }}
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem' }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
