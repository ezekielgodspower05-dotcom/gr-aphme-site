import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function BlogListPage() {
  const payload = await getPayload({ config })

  const posts = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    limit: 20,
  })

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Blog</h1>

      {posts.docs.length === 0 && <p>No posts yet. Check back soon.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.docs.map((post) => (
          <li key={post.id} style={{ marginBottom: '2rem' }}>
            <Link
              href={`/blog/${post.slug}`}
              style={{ fontSize: '1.4rem', textDecoration: 'none' }}
            >
              {post.title}
            </Link>
            {post.excerpt && (
              <p style={{ opacity: 0.75, marginTop: '0.5rem' }}>{post.excerpt}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}