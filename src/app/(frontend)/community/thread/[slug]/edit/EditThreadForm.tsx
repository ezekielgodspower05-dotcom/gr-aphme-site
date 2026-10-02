'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Props = {
  threadId: number | string
  threadSlug: string
  initialBody: string
}

function textToRichText(body: string) {
  return {
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
}

export function EditThreadForm({ threadId, threadSlug, initialBody }: Props) {
  const router = useRouter()
  const [body, setBody] = useState(initialBody)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch(`/api/threads/${threadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: textToRichText(body) }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data?.errors?.[0]?.message || 'Could not save changes.')
      setLoading(false)
      return
    }

    router.push(`/community/thread/${threadSlug}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
      <label style={{ display: 'grid', gap: '0.4rem' }}>
        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Body</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={12}
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
        />
      </label>

      {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem', margin: 0 }}>{error}</p>}

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
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
          }}
        >
          {loading ? 'Saving…' : 'Save changes'}
        </button>
        <Link
          href={`/community/thread/${threadSlug}`}
          style={{ opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
