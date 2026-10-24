'use client'

import { useState } from 'react'
import { useCart } from '../../_components/CartContext'

type Props = {
  product: any
}

export function AddToCartForm({ product }: Props) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')

  const isPhysical = product.type === 'physical'

  const mainImage =
    product.images && product.images.length > 0 && typeof product.images[0].image === 'object'
      ? product.images[0].image
      : null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (isPhysical && !selectedSize) {
      alert('Please select a size.')
      return
    }

    addItem({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      price: Number(product.price),
      type: product.type,
      image: mainImage?.url || undefined,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem', marginTop: '2rem' }}>
      {isPhysical && (
        <>
          {/* Sizes */}
          <div>
            <label
              style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.8 }}
            >
              Size
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.sizes?.map((size: string) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: selectedSize === size ? '#fff' : 'transparent',
                    color: selectedSize === size ? '#000' : 'inherit',
                    border: '1px solid #444',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  opacity: 0.8,
                }}
              >
                Color
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: selectedColor === color ? '#fff' : 'transparent',
                      color: selectedColor === color ? '#000' : 'inherit',
                      border: '1px solid #444',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <button
        type="submit"
        style={{
          padding: '1rem',
          background: '#fff',
          color: '#000',
          fontWeight: 600,
          borderRadius: 6,
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          marginTop: '1rem',
        }}
      >
        {isPhysical ? 'Add to Cart' : 'Purchase Editable File'}
      </button>
    </form>
  )
}
