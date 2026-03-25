import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
  labels: {
    singular: { cs: 'Soubor', en: 'File', ru: 'Файл' },
    plural: { cs: 'Média', en: 'Media', ru: 'Медиа' },
  },
  admin: {
    useAsTitle: 'alt',
    group: { cs: 'Nastavení', en: 'Settings', ru: 'Настройки' },
  },
  fields: [
    { name: 'alt', type: 'text', required: true, label: 'Alt text' },
  ],
}
