import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  access: {
    read: () => true,
  },
  labels: {
    singular: { cs: 'Článek', en: 'Blog post', ru: 'Статья' },
    plural: { cs: 'Blog', en: 'Blog', ru: 'Блог' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'isPublished', 'publishedAt'],
    group: { cs: 'Obsah', en: 'Content', ru: 'Контент' },
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Název článku' },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'excerpt', type: 'textarea', label: 'Výňatek' },
    { name: 'content', type: 'richText', required: true, label: 'Obsah' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media', label: 'Hlavní obrázek', admin: { description: 'Doporučeno: JPG/WebP, 1200×675px (16:9), max 500 KB' } },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Péče o auto', value: 'car-care' },
        { label: 'Tipy a triky', value: 'tips' },
        { label: 'Novinky', value: 'news' },
        { label: 'Technologie', value: 'technology' },
      ],
      label: 'Kategorie',
    },
    { name: 'author', type: 'text', label: 'Autor' },
    { name: 'readingTime', type: 'number', label: 'Doba čtení (min)' },
    { name: 'publishedAt', type: 'date', label: 'Datum publikace', admin: { position: 'sidebar' } },
    { name: 'isPublished', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' }, label: 'Publikováno' },
  ],
}
