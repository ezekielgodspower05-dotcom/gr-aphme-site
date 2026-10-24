'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from './CartContext'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Dark backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 100,
        }}
      />

      {/* Drawer panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: 420,
          background: '#0a0a0a',
          borderLeft: '1px solid #222',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #222',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.15rem' }}>
            Cart {totalItems > 0 && `(${totalItems})`}
          </h2>
          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              fontSize: '1.25rem',
              cursor: 'pointer',
              opacity: 0.7,
            }}
            aria-label="Close cart"
          >
            ✕
          </button>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {items.length === 0 ? (
            <p style={{ opacity: 0.6, marginTop: '2rem', textAlign: 'center' }}>
              Your cart is empty.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {items.map((item, index) => (
                <li
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr auto',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    marginBottom: '1rem',
                    borderBottom: '1px solid #1a1a1a',
                    alignItems: 'start',
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 6,
                      overflow: 'hidden',
                      background: '#222',
                      position: 'relative',
                    }}
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>

                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600 }}>{item.title}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.6 }}>
                      {item.type === 'physical' ? 'Apparel' : 'Digital'}
                      {item.size && ` · Size ${item.size}`}
                      {item.color && ` · ${item.color}`}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '0.5rem',
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        style={qtyBtn}
                      >
                        −
                      </button>
                      <span style={{ fontSize: '0.9rem', minWidth: 20, textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        style={qtyBtn}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ff8080',
                          opacity: 0.8,
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          marginLeft: '0.5rem',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid #222',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                fontSize: '1.1rem',
              }}
            >
              <span>Subtotal</span>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>
            <Link
              href="/cart"
              onClick={closeCart}
              style={{
                display: 'block',
                padding: '0.85rem',
                background: '#fff',
                color: '#000',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: 600,
                borderRadius: 6,
              }}
            >
              View Cart & Checkout
            </Link>
          </footer>
        )}
      </aside>
    </>
  )
}

const qtyBtn: React.CSSProperties = {
  width: 26,
  height: 26,
  background: 'none',
  border: '1px solid #444',
  color: 'inherit',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: '0.9rem',
}
