import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  labels: {
    singular: { cs: 'Stránka', en: 'Page', ru: 'Страница' },
    plural: { cs: 'Stránky', en: 'Pages', ru: 'Страницы' },
  },
  admin: {
    useAsTitle: 'title',
    group: { cs: 'Obsah', en: 'Content', ru: 'Контент' },
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Název stránky' },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'content', type: 'richText', required: true, label: 'Obsah' },
    { name: 'isPublished', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
