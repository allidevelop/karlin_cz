import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'updatedAt'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Název služby' },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'subtitle', type: 'text', label: 'Podtitul' },
    { name: 'description', type: 'textarea', label: 'Krátký popis' },
    { name: 'content', type: 'richText', label: 'Detailní popis' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Hlavní obrázek' },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galerie',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    { name: 'category', type: 'relationship', relationTo: 'service-categories', label: 'Kategorie' },
    { name: 'price', type: 'number', required: true, label: 'Cena od (Kč)' },
    { name: 'duration', type: 'text', label: 'Doba trvání' },
    {
      name: 'features',
      type: 'array',
      label: 'Co je v programu',
      fields: [
        { name: 'feature', type: 'text', required: true },
      ],
    },
    {
      name: 'pricingByVehicle',
      type: 'array',
      label: 'Ceny podle vozidla',
      fields: [
        { name: 'vehicleCategory', type: 'relationship', relationTo: 'vehicle-categories', required: true },
        { name: 'price', type: 'number', required: true, label: 'Cena (Kč)' },
      ],
    },
    { name: 'altegioId', type: 'number', admin: { position: 'sidebar', description: 'ID v Altegio systému' } },
    { name: 'isActive', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' }, label: 'Aktivní' },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar' }, label: 'Pořadí' },
  ],
}
