import type { CollectionConfig } from 'payload'

export const FAQ: CollectionConfig = {
  slug: 'faq',
  access: {
    read: () => true,
  },
  labels: {
    singular: { cs: 'Otázka', en: 'FAQ item', ru: 'Вопрос' },
    plural: { cs: 'FAQ', en: 'FAQ', ru: 'FAQ' },
  },
  admin: {
    useAsTitle: 'question',
    group: { cs: 'Obsah', en: 'Content', ru: 'Контент' },
  },
  fields: [
    { name: 'question', type: 'text', required: true, label: 'Otázka' },
    { name: 'answer', type: 'textarea', required: true, label: 'Odpověď' },
    {
      name: 'pages',
      type: 'select',
      hasMany: true,
      label: 'Zobrazit na stránkách',
      admin: {
        description: 'Prázdné = zobrazit všude',
      },
      options: [
        { label: 'Hlavní stránka', value: 'home' },
        { label: 'Služby', value: 'services' },
        { label: 'Rezervace', value: 'booking' },
        { label: 'Pro firmy', value: 'pro-firmy' },
        { label: 'Blog', value: 'blog' },
        { label: 'Akce', value: 'promotions' },
      ],
    },
    { name: 'sortOrder', type: 'number', defaultValue: 0, label: 'Pořadí' },
    { name: 'isActive', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
