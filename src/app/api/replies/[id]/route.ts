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

  const reply = await payload
    .findByID({
      collection: 'replies',
      id,
      depth: 0,
    })
    .catch(() => null)

  if (!reply) {
    return NextResponse.json({ errors: [{ message: 'Reply not found.' }] }, { status: 404 })
  }

  const authorId = typeof reply.author === 'object' ? reply.author.id : reply.author
  const userId = auth.user.id
  const isAdmin = (auth.user as { role?: string }).role === 'admin'

  if (authorId !== userId && !isAdmin) {
    return NextResponse.json(
      { errors: [{ message: 'You can only delete your own replies.' }] },
      { status: 403 },
    )
  }

  await payload.delete({ collection: 'replies', id })

  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })

  const auth = await payload.auth({ headers: req.headers })
  if (!auth.user) {
    return NextResponse.json({ errors: [{ message: 'You must be logged in.' }] }, { status: 401 })
  }

  const reply = await payload
    .findByID({
      collection: 'replies',
      id,
      depth: 0,
    })
    .catch(() => null)

  if (!reply) {
    return NextResponse.json({ errors: [{ message: 'Reply not found.' }] }, { status: 404 })
  }

  const authorId = typeof reply.author === 'object' ? reply.author.id : reply.author
  const userId = auth.user.id
  const isAdmin = (auth.user as { role?: string }).role === 'admin'

  if (authorId !== userId && !isAdmin) {
    return NextResponse.json(
      { errors: [{ message: 'You can only edit your own replies.' }] },
      { status: 403 },
    )
  }

  const ageMs = Date.now() - new Date(reply.createdAt).getTime()
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
    collection: 'replies',
    id,
    data: { body: data.body },
  })

  return NextResponse.json({ doc: updated })
}
