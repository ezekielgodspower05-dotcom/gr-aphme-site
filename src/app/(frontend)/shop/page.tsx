import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    sort: '-createdAt',
    limit: 100,
    depth: 1, // Needed to get the image object
  })

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Shop</h1>
      <p style={{ opacity: 0.6, marginBottom: '3rem' }}>
        Original apparel and editable design files.
      </p>

      {products.docs.length === 0 ? (
        <p style={{ opacity: 0.6 }}>No products yet. Check back soon.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '2rem',
          }}
        >
          {products.docs.map((product) => {
            const image =
              product.images &&
              product.images.length > 0 &&
              typeof product.images[0].image === 'object'
                ? product.images[0].image
                : null

            return (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: '#111',
                    marginBottom: '1rem',
                  }}
                >
                  {image?.url ? (
                    <Image
                      src={image.url}
                      alt={image.alt || product.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#222' }} />
                  )}
                </div>
                <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.4rem 0', fontWeight: 600 }}>
                  {product.title}
                </h2>
                <p style={{ opacity: 0.7, margin: 0 }}>
                  ${product.price.toFixed(2)} ·{' '}
                  {product.type === 'physical' ? 'Apparel' : 'Digital'}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
