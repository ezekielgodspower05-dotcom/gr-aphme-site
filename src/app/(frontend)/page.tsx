import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  return (
    <main style={{ background: '#000', color: '#fff' }}>
      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at center, #111 0%, #000 100%)',
            }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 1, padding: '0 1.5rem', maxWidth: 900 }}>
          <h1
            style={{
              fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            Wearable art. <br />
            <span style={{ opacity: 0.6 }}>Editable by you.</span>
          </h1>
          <p
            style={{
              fontSize: '1.25rem',
              opacity: 0.8,
              maxWidth: 600,
              margin: '0 auto 3rem auto',
              lineHeight: 1.6,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            Discover original graphic apparel and premium editable design files. Built for creators,
            by creators.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/shop"
              style={{
                padding: '1.2rem 3rem',
                background: '#fff',
                color: '#000',
                fontWeight: 800,
                borderRadius: 40,
                textDecoration: 'none',
                fontSize: '1.1rem',
              }}
            >
              Shop the Collection
            </Link>
            <Link
              href="/community"
              style={{
                padding: '1.2rem 3rem',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                fontWeight: 800,
                borderRadius: 40,
                textDecoration: 'none',
                fontSize: '1.1rem',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.05)',
              }}
            >
              Join the Community
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND CAMPAIGN SECTION */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem 6rem 1.5rem',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            aspectRatio: '16 / 9',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#111',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          }}
        >
          <img
            src="/campaign.jpg"
            alt="Campaign"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />

          {/* Soft Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
            }}
          />

          {/* Centered Text & Button */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              textAlign: 'center',
              padding: '0 1.5rem',
            }}
          >
            <Link
              href="/shop"
              style={{
                display: 'inline-block',
                padding: '0.8rem 2.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 400,
                borderRadius: 30,
                textDecoration: 'none',
                fontSize: '0.95rem',
                letterSpacing: '0.05em',
              }}
            >
              Explore the Drop
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
