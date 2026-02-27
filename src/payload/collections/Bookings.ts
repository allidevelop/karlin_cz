import type { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  access: {
    create: () => true,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'service', 'date', 'status'],
  },
  fields: [
    { name: 'vehicleCategory', type: 'relationship', relationTo: 'vehicle-categories', label: 'Kategorie vozidla' },
    { name: 'service', type: 'relationship', relationTo: 'services', label: 'Služba' },
    { name: 'addons', type: 'relationship', relationTo: 'services', hasMany: true, label: 'Doplňkové služby' },
    { name: 'firstName', type: 'text', required: true, label: 'Jméno' },
    { name: 'lastName', type: 'text', required: true, label: 'Příjmení' },
    { name: 'email', type: 'email', required: true, label: 'Email' },
    { name: 'phone', type: 'text', required: true, label: 'Telefon' },
    { name: 'date', type: 'date', required: true, label: 'Datum' },
    { name: 'time', type: 'text', required: true, label: 'Čas' },
    { name: 'note', type: 'textarea', label: 'Poznámka' },
    { name: 'totalPrice', type: 'number', label: 'Celková cena (Kč)' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Nová', value: 'new' },
        { label: 'Potvrzená', value: 'confirmed' },
        { label: 'Dokončená', value: 'completed' },
        { label: 'Zrušená', value: 'cancelled' },
      ],
      defaultValue: 'new',
      label: 'Stav',
      admin: { position: 'sidebar' },
    },
    { name: 'altegioRecordId', type: 'number', admin: { position: 'sidebar', description: 'ID záznamu v Altegio' } },
  ],
}
