import type { CollectionConfig } from 'payload'

export const Promotions: CollectionConfig = {
  slug: 'promotions',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Název akce' },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea', label: 'Popis' },
    { name: 'content', type: 'richText', label: 'Detailní popis' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'originalPrice', type: 'number', label: 'Původní cena (Kč)' },
    { name: 'discountedPrice', type: 'number', label: 'Akční cena (Kč)' },
    { name: 'badge', type: 'text', label: 'Štítek (např. -20%)' },
    { name: 'validFrom', type: 'date', label: 'Platnost od' },
    { name: 'validTo', type: 'date', label: 'Platnost do' },
    { name: 'services', type: 'relationship', relationTo: 'services', hasMany: true, label: 'Související služby' },
    {
      name: 'terms',
      type: 'array',
      label: 'Podmínky',
      fields: [
        { name: 'term', type: 'text', required: true },
      ],
    },
    {
      name: 'includedItems',
      type: 'array',
      label: 'Co je zahrnuto',
      fields: [
        { name: 'item', type: 'text', required: true },
      ],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
