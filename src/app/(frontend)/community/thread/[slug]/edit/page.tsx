import { notFound, redirect } from 'next/navigation'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { EditThreadForm } from './EditThreadForm'

type Params = Promise<{ slug: string }>

export default async function EditThreadPage({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const headersList = await nextHeaders()
  const { user: currentUser } = await payload.auth({ headers: headersList })

  if (!currentUser) redirect('/login')

  const result = await payload.find({
    collection: 'threads',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const thread = result.docs[0]
  if (!thread) notFound()

  const author = typeof thread.author === 'object' ? thread.author : null
  const isAdmin = (currentUser as { role?: string }).role === 'admin'
  const isAuthor = author?.id === currentUser.id

  if (!isAuthor && !isAdmin) redirect(`/community/thread/${slug}`)

  const ageMs = Date.now() - new Date(thread.createdAt).getTime()
  const EDIT_WINDOW_MS = 15 * 60 * 1000
  const canEdit = isAdmin || ageMs < EDIT_WINDOW_MS

  if (!canEdit) redirect(`/community/thread/${slug}`)

  const minutesLeft = Math.max(0, Math.floor((EDIT_WINDOW_MS - ageMs) / 60000))

  const existingText = extractPlainText(thread.body?.root ?? thread.body)

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Edit thread</h1>
      <p style={{ opacity: 0.6, marginBottom: '2rem', fontSize: '0.9rem' }}>
        You can edit this for {minutesLeft} more minute
        {minutesLeft === 1 ? '' : 's'}. The title and category can't be changed.
      </p>

      <EditThreadForm threadId={thread.id} threadSlug={thread.slug} initialBody={existingText} />
    </main>
  )
}

function extractPlainText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as {
    text?: string
    children?: unknown[]
    type?: string
  }

  // Plain text leaf
  if (typeof n.text === 'string') return n.text

  // Container with children — join them
  if (Array.isArray(n.children)) {
    const parts = n.children.map((child) => extractPlainText(child)).filter((s) => s.length > 0)

    // Paragraphs and headings should be separated by blank lines
    const blockTypes = ['paragraph', 'heading', 'listitem', 'quote']
    if (n.type && blockTypes.includes(n.type)) {
      return parts.join('')
    }
    return parts.join('\n\n')
  }

  return ''
}
