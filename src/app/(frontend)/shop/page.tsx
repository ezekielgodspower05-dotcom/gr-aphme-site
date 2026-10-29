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
    <main style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      
      {/* SHOP HEADER */}
      <section style={{ padding: '6rem 1.5rem 4rem 1.5rem', textAlign: 'center', borderBottom: '1px solid #222' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
          The Collection
        </h1>
        <p style={{ opacity: 0.6, fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
          Original apparel and premium editable design files. Built for creators.
        </p>
      </section>

      {/* PRODUCT GRID */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        {products.docs.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.6 }}>No products yet. Check back soon.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '3rem',
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
                  className="product-card"
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '1 / 1',
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: '#111',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {image?.url ? (
                      <Image
                        src={image.url}
                        alt={image.alt || product.title}
                        fill
                        style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        className="product-image"
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#222' }} />
                    )}
                    
                    {/* Type Badge */}
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {product.type === 'physical' ? 'Apparel' : 'Digital'}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.15rem', margin: '0 0 0.25rem 0', fontWeight: 600 }}>
                        {product.title}
                      </h2>
                      <p style={{ opacity: 0.5, margin: 0, fontSize: '0.9rem' }}>
                        {product.type === 'physical' ? 'Physical Item' : 'Instant Download'}
                      </p>
                    </div>
                    <p style={{ fontSize: '1.1rem', margin: 0, fontWeight: 500 }}>
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* CSS for Hover Effects */}
      <style dangerouslySetInnerHTML={{__html: `
        .product-card {
          transition: transform 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-8px);
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
      `}} />
    </main>
  )
}