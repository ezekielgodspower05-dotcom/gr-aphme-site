'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ReplyDeleteButton({ replyId }: { replyId: number | string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm('Delete this reply?')
    if (!confirmed) return

    setDeleting(true)
    const res = await fetch(`/api/replies/${replyId}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data?.errors?.[0]?.message || 'Could not delete reply.')
      setDeleting(false)
      return
    }

    router.refresh()
    setDeleting(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      style={{
        background: 'none',
        border: 'none',
        color: '#ff8080',
        opacity: 0.7,
        fontSize: '0.8rem',
        cursor: deleting ? 'wait' : 'pointer',
        padding: 0,
        textDecoration: 'underline',
      }}
    >
      {deleting ? 'Deleting…' : 'Delete'}
    </button>
  )
}
