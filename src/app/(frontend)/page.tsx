import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  return (
    <main style={{ background: '#000', color: '#fff' }}>
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
                background: 'rgba(255, 255, 255, 0.1)', // Very faint white background
                backdropFilter: 'blur(12px)', // Blurs the image behind the button
                border: '1px solid rgba(255, 255, 255, 0.2)', // Subtle border
                color: 'rgba(255, 255, 255, 0.9)', // Soft white text, not pure white
                fontWeight: 400, // Removed the boldness
                borderRadius: 30,
                textDecoration: 'none',
                fontSize: '0.95rem',
                letterSpacing: '0.05em', // Adds a modern, spaced-out look
                transition: 'background 0.3s ease',
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
