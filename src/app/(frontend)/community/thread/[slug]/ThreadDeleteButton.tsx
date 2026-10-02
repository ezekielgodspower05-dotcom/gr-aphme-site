'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  threadId: number | string
  categorySlug: string
}

export function ThreadDeleteButton({ threadId, categorySlug }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm(
      'Delete this thread? This cannot be undone. All replies will also be removed.',
    )
    if (!confirmed) return

    setDeleting(true)
    const res = await fetch(`/api/threads/${threadId}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data?.errors?.[0]?.message || 'Could not delete thread.')
      setDeleting(false)
      return
    }

    router.push(`/community/${categorySlug}`)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      style={{
        background: 'none',
        border: '1px solid #5a2222',
        color: '#ff8080',
        padding: '0.35rem 0.75rem',
        borderRadius: 4,
        fontSize: '0.85rem',
        cursor: deleting ? 'wait' : 'pointer',
      }}
    >
      {deleting ? 'Deleting…' : 'Delete'}
    </button>
  )
}
