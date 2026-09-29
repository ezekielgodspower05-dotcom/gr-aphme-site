'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Category = { id: number | string; name: string; slug: string }

export default function NewThreadPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [authed, setAuthed] = useState(false)

  // Check login + load categories
  useEffect(() => {
    Promise.all([
      fetch('/api/users/me').then((r) => r.json()),
      fetch('/api/categories?limit=100&sort=order').then((r) => r.json()),
    ])
      .then(([me, cats]) => {
        setAuthed(Boolean(me?.user))
        setCategories(cats?.docs ?? [])
        if (cats?.docs?.[0]) setCategoryId(cats.docs[0].id)
      })
      .catch(() => setError('Failed to load form'))
      .finally(() => setCheckingAuth(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Convert plain text body to Lexical rich text format
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

    const res = await fetch('/api/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        category: Number(categoryId),
        body: richTextBody,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data?.errors?.[0]?.message || 'Could not create thread.')
      setLoading(false)
      return
    }

    router.push(`/community/thread/${data.doc.slug}`)
    router.refresh()
  }

  if (checkingAuth) {
    return (
      <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1.5rem' }}>
        <p style={{ opacity: 0.6 }}>Loading…</p>
      </main>
    )
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 720, margin: '4rem auto', padding: '0 1.5rem' }}>
        <h1>Log in to start a thread</h1>
        <p style={{ opacity: 0.7 }}>
          You need an account to post. <Link href="/login">Log in</Link> or{' '}
          <Link href="/signup">sign up</Link>.
        </p>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 720, margin: '3rem auto', padding: '0 1.5rem' }}>
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
        ← Back to community
      </Link>

      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Start a new thread</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
        <label style={{ display: 'grid', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Category</span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            style={inputStyle}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'grid', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
            placeholder="What do you want to discuss?"
          />
        </label>

        <label style={{ display: 'grid', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Body</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={10}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            placeholder="Use blank lines to separate paragraphs."
          />
        </label>

        {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem', margin: 0 }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.25rem',
            background: '#fff',
            color: '#000',
            border: 'none',
            fontWeight: 600,
            borderRadius: 6,
            cursor: loading ? 'wait' : 'pointer',
            justifySelf: 'start',
          }}
        >
          {loading ? 'Posting…' : 'Post thread'}
        </button>
      </form>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '0.65rem 0.75rem',
  background: '#111',
  border: '1px solid #333',
  borderRadius: 6,
  color: 'inherit',
  fontSize: '1rem',
}
