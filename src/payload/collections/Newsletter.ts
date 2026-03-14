import type { CollectionConfig } from 'payload'

export const Newsletter: CollectionConfig = {
  slug: 'newsletter',
  access: {
    create: () => true,
  },
  labels: {
    singular: { cs: 'Odběratel', en: 'Subscriber', ru: 'Подписчик' },
    plural: { cs: 'Newsletter', en: 'Newsletter', ru: 'Рассылка' },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'subscribedAt', 'isActive'],
    group: { cs: 'Komunikace', en: 'Communication', ru: 'Коммуникации' },
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, label: 'Email' },
    { name: 'subscribedAt', type: 'date', admin: { readOnly: true } },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
}
