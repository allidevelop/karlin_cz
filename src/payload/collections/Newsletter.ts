import type { CollectionConfig } from 'payload'

export const Newsletter: CollectionConfig = {
  slug: 'newsletter',
  access: {
    create: () => true,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'subscribedAt', 'isActive'],
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, label: 'Email' },
    { name: 'subscribedAt', type: 'date', admin: { readOnly: true } },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
}
