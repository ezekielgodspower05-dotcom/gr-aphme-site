'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../_components/CartContext'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function CartPage() {
  const [loading, setLoading] = useState(false)
  const { items, updateQuantity, removeItem, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <main
        style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h1>
        <p style={{ opacity: 0.6, marginBottom: '2rem' }}>
          Looks like you haven't added anything yet.
        </p>
        <Link
          href="/shop"
          style={{
            display: 'inline-block',
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
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Your Cart</h1>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr auto',
              gap: '1.5rem',
              alignItems: 'center',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid #222',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 100,
                height: 100,
                borderRadius: 8,
                overflow: 'hidden',
                background: '#111',
              }}
            >
              {item.image && (
                <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} />
              )}
            </div>

            <div>
              <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>{item.title}</h2>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem', color: '#aaa' }}>
                {item.type === 'physical' ? 'Apparel' : 'Digital'}
                {item.size && ` · Size ${item.size}`}
                {item.color && ` · ${item.color}`}
              </p>

              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: '1px solid #333',
                    borderRadius: 4,
                    padding: '0.25rem',
                  }}
                >
                  <button onClick={() => updateQuantity(index, item.quantity - 1)} style={btnStyle}>
                    −
                  </button>
                  <span style={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(index, item.quantity + 1)} style={btnStyle}>
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff6b6b',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  Remove
                </button>
              </div>
            </div>

            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid #333' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '2rem',
          }}
        >
          <span>Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        <button
          onClick={async () => {
            setLoading(true)
            try {
              const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items }),
              })
              const data = await res.json()

              console.log('Checkout API Response:', data)

              if (data.url) {
                window.location.href = data.url
              } else {
                // This will show the actual Stripe error in an alert box
                alert('Error: ' + (data.error || 'Unknown error'))
                setLoading(false)
              }
            } catch (err) {
              alert('Network error')
              setLoading(false)
            }
          }}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: loading ? '#888' : '#fff',
            color: '#000',
            fontWeight: 700,
            fontSize: '1.1rem',
            borderRadius: 6,
            border: 'none',
            cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? 'Redirecting...' : 'Proceed to Checkout'}
        </button>
      </div>
    </main>
  )
}

const btnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'inherit',
  cursor: 'pointer',
  fontSize: '1rem',
  padding: '0 0.5rem',
}
