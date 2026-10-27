import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'stripeSessionId',
    defaultColumns: ['stripeSessionId', 'customerEmail', 'total', 'status', 'createdAt'],
  },
  access: {
    // Only admins can see orders
    read: ({ req }) => Boolean(req.user),
    create: () => false, // Only the webhook creates orders
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'stripeSessionId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'amountTotal',
      type: 'number',
      required: true,
    },
    {
      name: 'currency',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['paid', 'pending', 'failed'],
      defaultValue: 'paid',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'quantity',
          type: 'number',
        },
        {
          name: 'amount',
          type: 'number',
        },
      ],
    },
    {
      name: 'shippingDetails',
      type: 'json',
    },
  ],
}
