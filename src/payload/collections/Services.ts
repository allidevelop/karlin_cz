import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    read: () => true,
  },
  labels: {
    singular: { cs: 'Služba', en: 'Service', ru: 'Услуга' },
    plural: { cs: 'Služby', en: 'Services', ru: 'Услуги' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'updatedAt'],
    group: { cs: 'Služby', en: 'Services', ru: 'Услуги' },
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Název služby' },
    { name: 'badge', type: 'text', localized: true, label: 'Badge / Štítek' },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'subtitle', type: 'text', label: 'Podtitul' },
    { name: 'description', type: 'textarea', label: 'Krátký popis' },
    { name: 'content', type: 'richText', label: 'Detailní popis' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Hlavní obrázek', admin: { description: 'Doporučeno: JPG/WebP, 1920×1080px, max 500 KB' } },
    { name: 'beforeImage', type: 'upload', relationTo: 'media', label: 'Obrázek PŘED (slider)', admin: { description: 'Doporučeno: JPG/WebP, 1280×720px, max 500 KB' } },
    { name: 'afterImage', type: 'upload', relationTo: 'media', label: 'Obrázek PO (slider)', admin: { description: 'Doporučeno: JPG/WebP, 1280×720px, max 500 KB' } },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galerie',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true, admin: { description: 'Doporučeno: JPG/WebP, 1280×720px, max 500 KB' } },
      ],
    },
    { name: 'category', type: 'relationship', relationTo: 'service-categories', label: 'Kategorie' },
    { name: 'price', type: 'number', required: true, label: 'Cena od (Kč)' },
    { name: 'duration', type: 'text', label: 'Doba trvání' },
    {
      name: 'features',
      type: 'array',
      label: 'Více o programu',
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
        { name: 'altegioServiceId', type: 'number', label: 'Altegio service ID' },
      ],
    },
    { name: 'altegioId', type: 'number', admin: { position: 'sidebar', description: 'ID v Altegio systému' } },
    {
      name: 'addonCategory',
      type: 'select',
      label: 'Kategorie doplňku',
      options: [
        { label: 'Interiér', value: 'interior' },
        { label: 'Exteriér', value: 'exterior' },
        { label: 'Ochrana', value: 'protection' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Pouze pro doplňkové služby',
        condition: (data) => data?.isAddon,
      },
    },
    { name: 'isAddon', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' }, label: 'Doplňková služba' },
    { name: 'isActive', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' }, label: 'Aktivní' },
    { name: 'sortOrder', type: 'number', defaultValue: 0, admin: { position: 'sidebar' }, label: 'Pořadí' },
  ],
}
