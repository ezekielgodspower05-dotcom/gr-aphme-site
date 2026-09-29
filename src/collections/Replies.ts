import type { CollectionConfig } from 'payload'

export const Replies: CollectionConfig = {
  slug: 'replies',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['thread', 'author', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'thread',
      type: 'relationship',
      relationTo: 'threads',
      required: true,
      index: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (data && !data.author && req.user) {
          data.author = req.user.id
        }
        return data
      },
    ],
  },
}