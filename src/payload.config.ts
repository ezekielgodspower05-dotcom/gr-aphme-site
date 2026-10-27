// force rebuild
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { buildConfig } from 'payload'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Threads } from './collections/Threads'
import { Replies } from './collections/Replies'
import { Products } from './collections/Products'
import { Orders } from './collections/orders'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (process.env.NODE_ENV === 'production') {
  console.log('[BLOB CONFIG] Token exists:', Boolean(process.env.BLOB_READ_WRITE_TOKEN))
  console.log('[BLOB CONFIG] Store ID exists:', Boolean(process.env.BLOB_STORE_ID))
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts, Categories, Threads, Replies, Products, Orders],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      collections: {
        media: true,
      },
    }),
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET,
      webhooks: {
        'checkout.session.completed': async ({ event, req }) => {
          const session = event.data.object as any

          // Create the order in Payload
          await req.payload.create({
            collection: 'orders' as any,
            data: {
              stripeSessionId: session.id,
              customerEmail: session.customer_details?.email || 'unknown',
              amountTotal: session.amount_total / 100, // Convert from cents
              currency: session.currency,
              status: 'paid',
              items:
                session.line_items?.data?.map((item: any) => ({
                  name: item.description,
                  quantity: item.quantity,
                  amount: item.amount_total / 100,
                })) || [],
              shippingDetails: session.shipping_details || {},
            } as any,
          })
        },
      },
    }),
  ],
})
