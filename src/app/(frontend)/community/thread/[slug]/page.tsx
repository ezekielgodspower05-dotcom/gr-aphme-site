import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ReplyForm } from './ReplyForm'

type Params = Promise<{ slug: string }>

export default async function ThreadPage({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const threadResult = await payload.find({
    collection: 'threads',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  const thread = threadResult.docs[0]
  if (!thread) notFound()

  const replies = await payload.find({
    collection: 'replies',
    where: { thread: { equals: thread.id } },
    sort: 'createdAt',
    limit: 200,
    depth: 2,
  })

  const author = typeof thread.author === 'object' ? thread.author : null
  const category =
    typeof thread.category === 'object' ? thread.category : null

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <Link
        href={category?.slug ? `/community/${category.slug}` : '/community'}
        style={{
          opacity: 0.6,
          textDecoration: 'none',
          fontSize: '0.9rem',
          display: 'inline-block',
          marginBottom: '2rem',
        }}
      >
        ← {category?.name || 'Community'}
      </Link>

      <h1 style={{ fontSize: '2rem', lineHeight: 1.25, margin: '0 0 1rem 0' }}>
        {thread.title}
      </h1>

      <p style={{ opacity: 0.5, fontSize: '0.9rem', marginBottom: '2.5rem' }}>
        by {author?.username || author?.email || 'unknown'} ·{' '}
        {new Date(thread.createdAt).toLocaleDateString()}
      </p>

      <article
        style={{
          lineHeight: 1.75,
          fontSize: '1.05rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid #222',
          marginBottom: '2.5rem',
        }}
      >
        <RichText data={thread.body} />
      </article>

      <section>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
          {replies.docs.length} repl{replies.docs.length === 1 ? 'y' : 'ies'}
        </h2>

        {replies.docs.length === 0 && (
          <p style={{ opacity: 0.6 }}>No replies yet. Be the first.</p>
        )}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {replies.docs.map((reply) => {
            const rAuthor =
              typeof reply.author === 'object' ? reply.author : null
            return (
              <li
                key={reply.id}
                style={{
                  paddingBottom: '1.5rem',
                  marginBottom: '1.5rem',
                  borderBottom: '1px solid #1a1a1a',
                }}
              >
                <p
                  style={{
                    opacity: 0.6,
                    fontSize: '0.85rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  {rAuthor?.username || rAuthor?.email || 'unknown'} ·{' '}
                  {new Date(reply.createdAt).toLocaleDateString()}
                </p>
                <div style={{ lineHeight: 1.7 }}>
                  <RichText data={reply.body} />
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {thread.locked ? (
        <p style={{ opacity: 0.6, fontStyle: 'italic' }}>
          This thread is locked. No new replies.
        </p>
      ) : (
        <ReplyForm threadId={thread.id} />
      )}
    </main>
  )
}