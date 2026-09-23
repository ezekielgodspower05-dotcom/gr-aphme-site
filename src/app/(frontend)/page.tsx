import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function BlogListPage() {
  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    limit: 20,
    depth: 1, // needed so heroImage comes back as a full object, not just an ID
  })

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Blog</h1>
      <p style={{ opacity: 0.6, marginBottom: '3rem' }}>
        Notes from the studio — process, ideas, and what's coming next.
      </p>

      {posts.docs.length === 0 && (
        <p style={{ opacity: 0.6 }}>No posts yet. Check back soon.</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {posts.docs.map((post) => {
          const hero = typeof post.heroImage === 'object' ? post.heroImage : null

          return (
            <li
              key={post.id}
              style={{
                marginBottom: '3rem',
                paddingBottom: '3rem',
                borderBottom: '1px solid #1a1a1a',
              }}
            >
              <Link
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                {hero?.url && (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16 / 9',
                      marginBottom: '1.25rem',
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
                    />
                  </div>
                )}

                <h2
                  style={{
                    fontSize: '1.6rem',
                    margin: '0 0 0.75rem 0',
                    lineHeight: 1.3,
                  }}
                >
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p
                    style={{
                      opacity: 0.7,
                      lineHeight: 1.6,
                      margin: 0,
                      fontSize: '1.05rem',
                    }}
                  >
                    {post.excerpt}
                  </p>
                )}

                {post.publishedAt && (
                  <p
                    style={{
                      opacity: 0.4,
                      fontSize: '0.85rem',
                      marginTop: '1rem',
                    }}
                  >
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}