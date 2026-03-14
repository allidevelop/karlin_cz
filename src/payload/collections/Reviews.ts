import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  access: {
    read: () => true,
  },
  labels: {
    singular: { cs: 'Recenze', en: 'Review', ru: 'Отзыв' },
    plural: { cs: 'Recenze', en: 'Reviews', ru: 'Отзывы' },
  },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'rating', 'source', 'isApproved'],
    group: { cs: 'Obsah', en: 'Content', ru: 'Контент' },
  },
  fields: [
    { name: 'authorName', type: 'text', required: true, label: 'Jméno autora' },
    { name: 'text', type: 'textarea', required: true, label: 'Text recenze' },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5, label: 'Hodnocení' },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Google', value: 'google' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Web', value: 'web' },
      ],
      defaultValue: 'google',
      label: 'Zdroj',
    },
    { name: 'date', type: 'date', label: 'Datum recenze' },
    { name: 'isApproved', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' }, label: 'Schváleno' },
  ],
}
