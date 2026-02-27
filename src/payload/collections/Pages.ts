import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Název stránky' },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'content', type: 'richText', required: true, label: 'Obsah' },
    { name: 'isPublished', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
