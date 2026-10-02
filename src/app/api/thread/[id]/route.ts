import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const EDIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })

  const auth = await payload.auth({ headers: req.headers })
  if (!auth.user) {
    return NextResponse.json({ errors: [{ message: 'You must be logged in.' }] }, { status: 401 })
  }

  const thread = await payload
    .findByID({
      collection: 'threads',
      id,
      depth: 0,
    })
    .catch(() => null)

  if (!thread) {
    return NextResponse.json({ errors: [{ message: 'Thread not found.' }] }, { status: 404 })
  }

  const authorId = typeof thread.author === 'object' ? thread.author.id : thread.author
  const userId = auth.user.id
  const isAdmin = (auth.user as { role?: string }).role === 'admin'

  if (authorId !== userId && !isAdmin) {
    return NextResponse.json(
      { errors: [{ message: 'You can only delete your own threads.' }] },
      { status: 403 },
    )
  }

  // Delete all replies under this thread first
  const replies = await payload.find({
    collection: 'replies',
    where: { thread: { equals: id } },
    limit: 1000,
  })
  for (const reply of replies.docs) {
    await payload.delete({ collection: 'replies', id: reply.id })
  }

  // Then delete the thread
  await payload.delete({ collection: 'threads', id })

  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })

  const auth = await payload.auth({ headers: req.headers })
  if (!auth.user) {
    return NextResponse.json({ errors: [{ message: 'You must be logged in.' }] }, { status: 401 })
  }

  const thread = await payload
    .findByID({
      collection: 'threads',
      id,
      depth: 0,
    })
    .catch(() => null)

  if (!thread) {
    return NextResponse.json({ errors: [{ message: 'Thread not found.' }] }, { status: 404 })
  }

  const authorId = typeof thread.author === 'object' ? thread.author.id : thread.author
  const userId = auth.user.id
  const isAdmin = (auth.user as { role?: string }).role === 'admin'

  if (authorId !== userId && !isAdmin) {
    return NextResponse.json(
      { errors: [{ message: 'You can only edit your own threads.' }] },
      { status: 403 },
    )
  }

  const ageMs = Date.now() - new Date(thread.createdAt).getTime()
  if (!isAdmin && ageMs > EDIT_WINDOW_MS) {
    return NextResponse.json(
      { errors: [{ message: 'The 15-minute edit window has passed.' }] },
      { status: 403 },
    )
  }

  const data = await req.json().catch(() => null)
  if (!data || !data.body) {
    return NextResponse.json({ errors: [{ message: 'Missing body.' }] }, { status: 400 })
  }

  const updated = await payload.update({
    collection: 'threads',
    id,
    data: { body: data.body },
  })

  return NextResponse.json({ doc: updated })
}
