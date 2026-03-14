import type { CollectionConfig } from 'payload'

export const PromoCodes: CollectionConfig = {
  slug: 'promo-codes',
  labels: {
    singular: { cs: 'Promo kód', en: 'Promo code', ru: 'Промокод' },
    plural: { cs: 'Promo kódy', en: 'Promo codes', ru: 'Промокоды' },
  },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'discountType', 'discountValue', 'isActive', 'usedCount', 'maxUses'],
    group: { cs: 'Marketing', en: 'Marketing', ru: 'Маркетинг' },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.code && typeof data.code === 'string') {
          data.code = data.code.trim().toUpperCase()
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'code', type: 'text', required: true, unique: true, label: 'Kód promokódu', admin: { description: 'Kód bude automaticky převeden na velká písmena' } },
    {
      name: 'discountType',
      type: 'select',
      required: true,
      label: 'Typ slevy',
      defaultValue: 'percentage',
      options: [
        { label: 'Procenta (%)', value: 'percentage' },
        { label: 'Pevná částka (Kč)', value: 'fixed' },
      ],
    },
    { name: 'discountValue', type: 'number', required: true, label: 'Hodnota slevy', min: 0 },
    { name: 'startDate', type: 'date', label: 'Platnost od' },
    { name: 'endDate', type: 'date', label: 'Platnost do' },
    { name: 'maxUses', type: 'number', label: 'Maximální počet použití', min: 0, defaultValue: 0, admin: { description: '0 = neomezeno' } },
    { name: 'usedCount', type: 'number', label: 'Počet použití', defaultValue: 0, admin: { readOnly: true } },
    { name: 'isActive', type: 'checkbox', label: 'Aktivní', defaultValue: true },
  ],
}
