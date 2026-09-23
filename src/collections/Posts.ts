import type { CollectionConfig } from 'payload'

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove punctuation
    .replace(/[\s_]+/g, '-')    // spaces/underscores -> hyphens
    .replace(/-+/g, '-')        // collapse multiple hyphens
    .replace(/^-|-$/g, '')      // trim leading/trailing hyphens

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        // Auto-generate slug from title if slug is empty
        if (!data.slug && data.title) {
          data.slug = slugify(data.title)
        } else if (data.slug) {
          // Normalize any manually entered slug too
          data.slug = slugify(data.slug)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Auto-generated from the title. You can override it, but use only letters, numbers, and hyphens.',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Slug is required.'
        if (/\s/.test(value)) return 'Slug cannot contain spaces — use hyphens instead.'
        if (!/^[a-z0-9-]+$/.test(value))
          return 'Slug can only contain lowercase letters, numbers, and hyphens.'
        return true
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary shown on the blog list page.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}