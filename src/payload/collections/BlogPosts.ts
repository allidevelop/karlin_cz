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
    { name: 'title', type: 'text', required: true, localized: true, label: 'Název článku' },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'excerpt', type: 'textarea', localized: true, label: 'Výňatek' },
    { name: 'content', type: 'richText', required: true, label: 'Obsah' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media', label: 'Hlavní obrázek', admin: { description: 'Doporučeno: JPG/WebP, 1200×675px (16:9), max 500 KB' } },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galerie obrázků (zobrazí se v článku)',
      admin: { description: 'Obrázky se zobrazí mezi textem článku. Pořadí: 1. po úvodu, 2. uprostřed, 3. před závěrem' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true, admin: { description: 'JPG/WebP, max 800 KB' } },
        { name: 'caption', type: 'text', localized: true, label: 'Popisek' },
      ],
    },
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
