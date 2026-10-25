import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// The 'as any' forces TypeScript to ignore the SDK version mismatch
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-09-30.endive' as any,
})

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          description: item.size ? `Size: ${item.size}` : undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      // Changed to allowed_payment_method_types for the new SDK
      allowed_payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('=== STRIPE ERROR ===')
    console.error(error.message)
    console.error('====================')

    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 })
  }
}
