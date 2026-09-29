import React from 'react'
import Link from 'next/link'
import './styles.css'
import { Nav } from './_components/Nav'

export const metadata = {
  title: 'GR Aphme',
  description: 'Graphic apparel designs and editable design files.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            borderBottom: '1px solid #222',
            padding: '1.25rem 1.5rem',
          }}
        >
          <Nav
            style={{
              maxWidth: 960,
              margin: '0 auto',
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            <Link
              href="/"
              style={{
                fontWeight: 700,
                fontSize: '1.15rem',
                textDecoration: 'none',
                marginRight: 'auto',
              }}
            >
              GR Aphme
            </Link>
            <Link href="/blog" style={{ textDecoration: 'none' }}>
              Blog
            </Link>
            <Link href="/shop" style={{ textDecoration: 'none' }}>
              Shop
            </Link>
          </Nav>
        </header>

        <div>{children}</div>

        <footer
          style={{
            borderTop: '1px solid #222',
            padding: '2rem 1.5rem',
            marginTop: '4rem',
            opacity: 0.6,
            fontSize: '0.9rem',
            textAlign: 'center',
          }}
        >
          © {new Date().getFullYear()} GR Aphme. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
