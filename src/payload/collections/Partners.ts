import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  access: {
    read: () => true,
  },
  labels: {
    singular: { cs: 'Partner', en: 'Partner', ru: 'Партнёр' },
    plural: { cs: 'Partneři', en: 'Partners', ru: 'Партнёры' },
  },
  admin: {
    useAsTitle: 'name',
    group: { cs: 'Obsah', en: 'Content', ru: 'Контент' },
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Název partnera' },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo', admin: { description: 'Doporučeno: PNG/SVG, 200×80px, max 100 KB, bez pozadí' } },
    { name: 'website', type: 'text', label: 'Web' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
    { name: 'isActive', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
