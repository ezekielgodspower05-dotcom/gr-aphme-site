import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Anyone can create a new account (signup)
    create: () => true,
    // Users can read/update themselves; admins can do everything
    read: ({ req }) => {
      if (req.user) return true
      return false
    },
    update: ({ req, id }) => {
      if (!req.user) return false
      if (req.user.id === id) return true
      // Admins can update anyone
      return Boolean((req.user as { role?: string }).role === 'admin')
    },
  },
  fields: [
    {
      name: 'username',
  type: 'text',
  required: false,   // ← allow existing users without one
  unique: true,
  index: true,
}
  ],
}