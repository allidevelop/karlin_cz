import type { CollectionConfig } from 'payload'

export const FAQ: CollectionConfig = {
  slug: 'faq',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'question',
  },
  fields: [
    { name: 'question', type: 'text', required: true, label: 'Otázka' },
    { name: 'answer', type: 'textarea', required: true, label: 'Odpověď' },
    { name: 'sortOrder', type: 'number', defaultValue: 0, label: 'Pořadí' },
    { name: 'isActive', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
