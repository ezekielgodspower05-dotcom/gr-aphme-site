'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function ReplyForm({ threadId }: { threadId: number | string }) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/users/me')
      .then((r) => r.json())
      .then((data) => setAuthed(Boolean(data?.user)))
      .catch(() => setAuthed(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const richTextBody = {
      root: {
        type: 'root',
        children: body
          .split('\n\n')
          .filter(Boolean)
          .map((paragraph) => ({
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: paragraph,
                format: 0,
                style: '',
                mode: 'normal',
                detail: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          })),
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    }

    const res = await fetch('/api/replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        thread: Number(threadId),
        body: richTextBody,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data?.errors?.[0]?.message || 'Could not post reply.')
      setLoading(false)
      return
    }

    setBody('')
    setLoading(false)
    router.refresh()
  }

  if (authed === null) return null

  if (!authed) {
    return (
      <p style={{ opacity: 0.7, marginTop: '2rem' }}>
        <Link href="/login">Log in</Link> to reply.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
      <label style={{ display: 'grid', gap: '0.4rem' }}>
        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Your reply</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={6}
          style={{
            padding: '0.75rem',
            background: '#111',
            border: '1px solid #333',
            borderRadius: 6,
            color: 'inherit',
            fontSize: '1rem',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
          placeholder="Use blank lines to separate paragraphs."
        />
      </label>

      {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem', margin: 0 }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '0.7rem 1.25rem',
          background: '#fff',
          color: '#000',
          border: 'none',
          fontWeight: 600,
          borderRadius: 6,
          cursor: loading ? 'wait' : 'pointer',
          justifySelf: 'start',
        }}
      >
        {loading ? 'Posting…' : 'Post reply'}
      </button>
    </form>
  )
}
