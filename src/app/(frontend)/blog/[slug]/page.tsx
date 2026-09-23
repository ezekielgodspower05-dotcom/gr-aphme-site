import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Params = Promise<{ slug: string }>

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const post = result.docs[0]
  if (!post) notFound()

  const hero = typeof post.heroImage === 'object' ? post.heroImage : null

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <Link
        href="/blog"
        style={{
          opacity: 0.6,
          textDecoration: 'none',
          fontSize: '0.9rem',
          display: 'inline-block',
          marginBottom: '2rem',
        }}
      >
        ← Back to blog
      </Link>

      <h1 style={{ fontSize: '2.5rem', lineHeight: 1.2, margin: '0 0 1rem 0' }}>
        {post.title}
      </h1>

      {post.publishedAt && (
        <p style={{ opacity: 0.5, marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          {new Date(post.publishedAt).toLocaleDateString()}
        </p>
      )}

      {hero?.url && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            marginBottom: '2.5rem',
            overflow: 'hidden',
            borderRadius: 8,
            background: '#111',
          }}
        >
          <Image
            src={hero.url}
            alt={hero.alt || post.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      )}

      <div style={{ lineHeight: 1.75, fontSize: '1.05rem' }}>
        <RichText data={post.content} />
      </div>
    </main>
  )
}