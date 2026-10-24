import type { CollectionConfig } from 'payload'

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'price', 'updatedAt'],
  },
  access: {
    read: () => true, // Public can view products
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Physical (Apparel)', value: 'physical' },
        { label: 'Digital (Editable File)', value: 'digital' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        position: 'sidebar',
        description: 'Price in USD',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },

    // --- PHYSICAL ONLY FIELDS ---
    {
      name: 'sizes',
      type: 'select',
      hasMany: true,
      options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      admin: {
        condition: (data) => data?.type === 'physical',
      },
    },
    {
      name: 'colors',
      type: 'text',
      hasMany: true,
      admin: {
        condition: (data) => data?.type === 'physical',
        description: 'E.g., Black, White, Navy',
      },
    },

    // --- DIGITAL ONLY FIELDS ---
    {
      name: 'digitalFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data?.type === 'digital',
        description: 'Upload the PSD, AI, or Canva template here.',
      },
    },
    {
      name: 'license',
      type: 'select',
      options: [
        { label: 'Personal Use Only', value: 'personal' },
        { label: 'Commercial Use Allowed', value: 'commercial' },
      ],
      admin: {
        condition: (data) => data?.type === 'digital',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && data.title && !data.slug) {
          data.slug = slugify(data.title)
        } else if (data && data.slug) {
          data.slug = slugify(data.slug)
        }
        return data
      },
    ],
  },
}
