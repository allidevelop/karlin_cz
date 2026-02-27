import type { CollectionConfig } from 'payload'

export const VehicleCategories: CollectionConfig = {
  slug: 'vehicle-categories',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Název' },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea', label: 'Popis' },
    { name: 'examples', type: 'text', label: 'Příklady vozů' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'priceMultiplier', type: 'number', defaultValue: 1, label: 'Násobitel ceny' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
