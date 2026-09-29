import type { CollectionConfig } from 'payload'

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
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
        description: 'Auto-generated from the name.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Shown on the community page for each section.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && data.name && !data.slug) {
          data.slug = slugify(data.name)
        } else if (data && data.slug) {
          data.slug = slugify(data.slug)
        }
        return data
      },
    ],
  },
}