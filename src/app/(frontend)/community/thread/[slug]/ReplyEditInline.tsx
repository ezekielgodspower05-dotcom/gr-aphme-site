'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Props = {
  replyId: number | string
  initialBody: string
  initialRichText: unknown
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

export function ReplyEditInline({ replyId, initialBody, initialRichText }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [body, setBody] = useState(initialBody)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setError(null)
    setLoading(true)

    const res = await fetch(`/api/replies/${replyId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: textToRichText(body) }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data?.errors?.[0]?.message || 'Could not save.')
      setLoading(false)
      return
    }

    setEditing(false)
    setLoading(false)
    router.refresh()
  }

  if (!editing) {
    return (
      <div>
        <div style={{ lineHeight: 1.7, marginBottom: '0.5rem' }}>
          <RichText data={initialRichText as any} />
        </div>
        <button
          onClick={() => setEditing(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#8ab4f8',
            opacity: 0.8,
            fontSize: '0.8rem',
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
          }}
        >
          Edit
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={5}
        style={{
          padding: '0.75rem',
          background: '#111',
          border: '1px solid #333',
          borderRadius: 6,
          color: 'inherit',
          fontSize: '1rem',
          fontFamily: 'inherit',
          resize: 'vertical',
          width: '100%',
        }}
      />
      {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            background: '#fff',
            color: '#000',
            border: 'none',
            fontWeight: 600,
            borderRadius: 4,
            fontSize: '0.85rem',
            cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? 'Saving…' : 'Save'}
        </button>
        <button
          onClick={() => {
            setEditing(false)
            setBody(initialBody)
            setError(null)
          }}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            background: 'none',
            color: 'inherit',
            border: '1px solid #444',
            borderRadius: 4,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
