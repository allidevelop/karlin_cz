import type { CollectionConfig } from 'payload'

export const Promotions: CollectionConfig = {
  slug: 'promotions',
  access: {
    read: () => true,
  },
  labels: {
    singular: { cs: 'Akce', en: 'Promotion', ru: 'Акция' },
    plural: { cs: 'Akce', en: 'Promotions', ru: 'Акции' },
  },
  admin: {
    useAsTitle: 'title',
    group: { cs: 'Marketing', en: 'Marketing', ru: 'Маркетинг' },
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Název akce' },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea', label: 'Popis' },
    { name: 'content', type: 'richText', label: 'Detailní popis' },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Doporučeno: JPG/WebP, 1200×800px, max 500 KB' } },
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
    {
      name: 'altegioServiceId',
      type: 'number',
      label: { cs: 'Altegio service ID (přímá rezervace)', en: 'Altegio service ID (direct booking)', ru: 'Altegio service ID (прямое бронирование)' },
      admin: {
        position: 'sidebar',
        description: 'ID služby v Altegio pro přímé rezervace bez výběru programu',
      },
    },
    {
      name: 'altegioPromoCode',
      type: 'text',
      label: 'Altegio promo kód',
      admin: {
        position: 'sidebar',
        description: 'Promo kód v systému Altegio',
      },
    },
    {
      name: 'promoType',
      type: 'select',
      label: 'Typ slevy',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Procenta', value: 'percentage' },
        { label: 'Pevná sleva (Kč)', value: 'fixed' },
        { label: 'Balíček', value: 'bundle' },
      ],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
