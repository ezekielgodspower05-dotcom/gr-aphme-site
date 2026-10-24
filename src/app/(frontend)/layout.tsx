import React from 'react'
import './styles.css'
import { Nav } from './_components/Nav'
import { CartProvider } from './_components/CartContext'
import { CartDrawer } from './_components/CartDrawer'

export const metadata = {
  title: 'GR Aphme',
  description: 'Graphic apparel designs and editable design files.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <header
            style={{
              borderBottom: '1px solid #222',
              padding: '1.25rem 1.5rem',
            }}
          >
            <Nav />
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

          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
