import Link from 'next/link'

export function EditThreadLink({
  slug,
  threadCreatedAt,
}: {
  slug: string
  threadCreatedAt: string
}) {
  const ageMs = Date.now() - new Date(threadCreatedAt).getTime()
  const EDIT_WINDOW_MS = 15 * 60 * 1000

  if (ageMs > EDIT_WINDOW_MS) return null

  return (
    <Link
      href={`/community/thread/${slug}/edit`}
      style={{
        border: '1px solid #444',
        color: 'inherit',
        padding: '0.35rem 0.75rem',
        borderRadius: 4,
        fontSize: '0.85rem',
        textDecoration: 'none',
      }}
    >
      Edit
    </Link>
  )
}
