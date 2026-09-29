import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function CommunityPage() {
  const payload = await getPayload({ config })

  // All categories, sorted by order
  const categories = await payload.find({
    collection: 'categories',
    sort: 'order',
    limit: 100,
  })

  // Count threads per category
  const categoryCounts = await Promise.all(
    categories.docs.map(async (cat) => {
      const count = await payload.count({
        collection: 'threads',
        where: { category: { equals: cat.id } },
      })
      return { id: cat.id, count: count.totalDocs }
    }),
  )

  const countMap = new Map(categoryCounts.map((c) => [c.id, c.count]))

  // Recent threads across all categories
  const recentThreads = await payload.find({
    collection: 'threads',
    sort: '-createdAt',
    limit: 5,
    depth: 1,
  })

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Community</h1>
          <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>
            Share your work, get feedback, and talk shop.
          </p>
        </div>
        <Link
          href="/community/new"
          style={{
            padding: '0.7rem 1.25rem',
            background: '#fff',
            color: '#000',
            textDecoration: 'none',
            fontWeight: 600,
            borderRadius: 6,
          }}
        >
          + New thread
        </Link>
      </div>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Categories</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {categories.docs.map((cat) => {
            const count = countMap.get(cat.id) ?? 0
            return (
              <Link
                key={cat.id}
                href={`/community/${cat.slug}`}
                style={{
                  display: 'block',
                  padding: '1.25rem',
                  border: '1px solid #222',
                  borderRadius: 8,
                  textDecoration: 'none',
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{cat.name}</h3>
                {cat.description && (
                  <p
                    style={{
                      opacity: 0.65,
                      fontSize: '0.9rem',
                      margin: '0 0 0.75rem 0',
                      lineHeight: 1.5,
                    }}
                  >
                    {cat.description}
                  </p>
                )}
                <span style={{ opacity: 0.4, fontSize: '0.8rem' }}>
                  {count} thread{count === 1 ? '' : 's'}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent threads</h2>

        {recentThreads.docs.length === 0 && (
          <p style={{ opacity: 0.6 }}>No threads yet. Be the first to start one.</p>
        )}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {recentThreads.docs.map((thread) => {
            const author = typeof thread.author === 'object' ? thread.author : null
            const category = typeof thread.category === 'object' ? thread.category : null

            return (
              <li
                key={thread.id}
                style={{
                  paddingBottom: '1.25rem',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid #1a1a1a',
                }}
              >
                <Link
                  href={`/community/thread/${thread.slug}`}
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {thread.title}
                </Link>
                <p
                  style={{
                    opacity: 0.5,
                    fontSize: '0.85rem',
                    marginTop: '0.5rem',
                  }}
                >
                  {category && <>{category.name} · </>}
                  {author && <>by {author.username || author.email} · </>}
                  {new Date(thread.createdAt).toLocaleDateString()}
                </p>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
