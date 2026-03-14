import type { CollectionConfig } from 'payload'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  access: {
    create: () => true,
  },
  labels: {
    singular: { cs: 'Zpráva', en: 'Message', ru: 'Сообщение' },
    plural: { cs: 'Zprávy', en: 'Messages', ru: 'Сообщения' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt'],
    group: { cs: 'Komunikace', en: 'Communication', ru: 'Коммуникации' },
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Jméno' },
    { name: 'email', type: 'email', required: true, label: 'Email' },
    { name: 'phone', type: 'text', label: 'Telefon' },
    { name: 'message', type: 'textarea', required: true, label: 'Zpráva' },
  ],
}
