import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { AddToCartForm } from './AddToCartForm'

export const dynamic = 'force-dynamic'

type Params = Promise<{ slug: string }>

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2, // Need depth 2 for images inside arrays
  })

  const product = result.docs[0]
  if (!product) notFound()

  const mainImage =
    product.images && product.images.length > 0 && typeof product.images[0].image === 'object'
      ? product.images[0].image
      : null

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <Link
        href="/shop"
        style={{
          opacity: 0.6,
          textDecoration: 'none',
          fontSize: '0.9rem',
          display: 'inline-block',
          marginBottom: '2rem',
        }}
      >
        ← Back to shop
      </Link>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
        }}
      >
        {/* Left: Image Gallery */}
        <div>
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1',
              borderRadius: 8,
              overflow: 'hidden',
              background: '#111',
            }}
          >
            {mainImage?.url ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt || product.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#222' }} />
            )}
          </div>
          {/* If you have multiple images, you'd map through them here */}
        </div>

        {/* Right: Details & Add to Cart */}
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>{product.title}</h1>
          <p style={{ fontSize: '1.5rem', margin: '0 0 2rem 0', opacity: 0.9 }}>
            ${product.price.toFixed(2)}
          </p>

          <div style={{ marginBottom: '2rem', lineHeight: 1.7, opacity: 0.8 }}>
            <RichText data={product.description} />
          </div>

          <AddToCartForm product={product} />
        </div>
      </div>
    </main>
  )
}
