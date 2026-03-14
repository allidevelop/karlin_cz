import type { CollectionConfig } from 'payload'

export const VehicleCategories: CollectionConfig = {
  slug: 'vehicle-categories',
  access: {
    read: () => true,
  },
  labels: {
    singular: { cs: 'Kategorie vozidel', en: 'Vehicle category', ru: 'Категория авто' },
    plural: { cs: 'Kategorie vozidel', en: 'Vehicle categories', ru: 'Категории авто' },
  },
  admin: {
    useAsTitle: 'name',
    group: { cs: 'Služby', en: 'Services', ru: 'Услуги' },
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Název' },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea', label: 'Popis' },
    { name: 'examples', type: 'text', label: 'Příklady vozů' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Obrázek (desktop)', admin: { description: 'Doporučeno: PNG/WebP, 800×600px, max 500 KB, průhledné pozadí' } },
    { name: 'mobileImage', type: 'upload', relationTo: 'media', label: 'Obrázek (mobil)', admin: { description: 'Doporučeno: PNG/WebP, 400×300px, max 300 KB, průhledné pozadí' } },
    { name: 'priceMultiplier', type: 'number', defaultValue: 1, label: 'Násobitel ceny' },
    { name: 'altegioCategoryId', type: 'number', admin: { position: 'sidebar', description: 'ID kategorie v Altegio' } },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
