import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ReplyForm } from './ReplyForm'
import { ThreadDeleteButton } from './ThreadDeleteButton'
import { ReplyDeleteButton } from './ReplyDeleteButton'

type Params = Promise<{ category: string }>

export default async function CategoryPage({ params }: { params: Params }) {
  const { category } = await params
  const payload = await getPayload({ config })

  const categoryResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: category } },
    limit: 1,
  })

  const cat = categoryResult.docs[0]
  if (!cat) notFound()

  const threads = await payload.find({
    collection: 'threads',
    where: { category: { equals: cat.id } },
    sort: '-pinned -createdAt',
    limit: 100,
    depth: 1,
  })

  // Count replies per thread
  const replyCounts = await Promise.all(
    threads.docs.map(async (t) => {
      const count = await payload.count({
        collection: 'replies',
        where: { thread: { equals: t.id } },
      })
      return { id: t.id, count: count.totalDocs }
    }),
  )
  const countMap = new Map(replyCounts.map((c) => [c.id, c.count]))

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <Link
        href="/community"
        style={{
          opacity: 0.6,
          textDecoration: 'none',
          fontSize: '0.9rem',
          display: 'inline-block',
          marginBottom: '2rem',
        }}
      >
        ← Community
      </Link>

      <h1 style={{ fontSize: '2.25rem', margin: '0 0 0.75rem 0' }}>{cat.name}</h1>
      {cat.description && (
        <p style={{ opacity: 0.7, marginBottom: '2.5rem', lineHeight: 1.6 }}>{cat.description}</p>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #222',
        }}
      >
        <span style={{ opacity: 0.6, fontSize: '0.95rem' }}>
          {threads.docs.length} thread{threads.docs.length === 1 ? '' : 's'}
        </span>
        <Link
          href="/community/new"
          style={{
            padding: '0.55rem 1rem',
            background: '#fff',
            color: '#000',
            textDecoration: 'none',
            fontWeight: 600,
            borderRadius: 6,
            fontSize: '0.9rem',
          }}
        >
          + New thread
        </Link>
      </div>

      {threads.docs.length === 0 ? (
        <p style={{ opacity: 0.6 }}>No threads in this category yet. Start one!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {threads.docs.map((thread) => {
            const author = typeof thread.author === 'object' ? thread.author : null
            const replies = countMap.get(thread.id) ?? 0

            return (
              <li
                key={thread.id}
                style={{
                  paddingBottom: '1.25rem',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid #1a1a1a',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.6rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {thread.pinned && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.5rem',
                        border: '1px solid #444',
                        borderRadius: 4,
                        opacity: 0.7,
                      }}
                    >
                      PINNED
                    </span>
                  )}
                  {thread.locked && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.5rem',
                        border: '1px solid #444',
                        borderRadius: 4,
                        opacity: 0.7,
                      }}
                    >
                      LOCKED
                    </span>
                  )}
                </div>

                <Link
                  href={`/community/thread/${thread.slug}`}
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-block',
                    marginTop: thread.pinned || thread.locked ? '0.5rem' : 0,
                  }}
                >
                  {thread.title}
                </Link>

                <p
                  style={{
                    opacity: 0.5,
                    fontSize: '0.85rem',
                    marginTop: '0.4rem',
                  }}
                >
                  by {author?.username || author?.email || 'unknown'} ·{' '}
                  {new Date(thread.createdAt).toLocaleDateString()} · {replies} repl
                  {replies === 1 ? 'y' : 'ies'}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
