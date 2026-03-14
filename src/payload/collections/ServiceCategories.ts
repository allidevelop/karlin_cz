import type { CollectionConfig } from 'payload'

export const ServiceCategories: CollectionConfig = {
  slug: 'service-categories',
  access: {
    read: () => true,
  },
  labels: {
    singular: { cs: 'Kategorie služeb', en: 'Service category', ru: 'Категория услуг' },
    plural: { cs: 'Kategorie služeb', en: 'Service categories', ru: 'Категории услуг' },
  },
  admin: {
    useAsTitle: 'name',
    group: { cs: 'Služby', en: 'Services', ru: 'Услуги' },
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Název kategorie' },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Doporučeno: JPG/WebP, 800×600px, max 500 KB' } },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
