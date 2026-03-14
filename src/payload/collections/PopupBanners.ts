import type { CollectionConfig } from 'payload'

export const PopupBanners: CollectionConfig = {
  slug: 'popup-banners',
  access: {
    read: () => true,
  },
  labels: {
    singular: { cs: 'Popup banner', en: 'Popup banner', ru: 'Всплывающий баннер' },
    plural: { cs: 'Popup bannery', en: 'Popup banners', ru: 'Всплывающие баннеры' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'isActive', 'delaySeconds', 'clickCount', 'startDate', 'endDate'],
    group: { cs: 'Marketing', en: 'Marketing', ru: 'Маркетинг' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: { cs: 'Název', en: 'Title', ru: 'Название' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      localized: true,
      label: { cs: 'Obrázek (desktop)', en: 'Image (desktop)', ru: 'Изображение (десктоп)' },
      admin: { description: 'Doporučeno: JPG/PNG/WebP, 600×800px, max 500 KB' },
    },
    {
      name: 'mobileImage',
      type: 'upload',
      relationTo: 'media',
      localized: true,
      label: { cs: 'Mobilní obrázek', en: 'Mobile image', ru: 'Мобильное изображение' },
      admin: { description: 'Doporučeno: JPG/PNG/WebP, 400×600px, max 300 KB' },
    },
    {
      name: 'buttonText',
      type: 'text',
      localized: true,
      label: { cs: 'Text tlačítka', en: 'Button text', ru: 'Текст кнопки' },
    },
    {
      name: 'buttonLink',
      type: 'text',
      localized: true,
      label: { cs: 'Odkaz tlačítka (URL)', en: 'Button link (URL)', ru: 'Ссылка кнопки (URL)' },
    },
    {
      name: 'delaySeconds',
      type: 'number',
      defaultValue: 5,
      label: { cs: 'Zpoždění zobrazení (sekundy)', en: 'Display delay (seconds)', ru: 'Задержка показа (секунды)' },
    },
    {
      name: 'showOnce',
      type: 'checkbox',
      defaultValue: true,
      label: { cs: 'Zobrazit pouze jednou', en: 'Show only once', ru: 'Показать только один раз' },
    },
    {
      name: 'priority',
      type: 'number',
      defaultValue: 0,
      label: { cs: 'Priorita (vyšší = dříve)', en: 'Priority (higher = first)', ru: 'Приоритет (больше = раньше)' },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
      label: { cs: 'Aktivní', en: 'Active', ru: 'Активен' },
    },
    {
      name: 'startDate',
      type: 'date',
      label: { cs: 'Zobrazovat od', en: 'Show from', ru: 'Показывать с' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'endDate',
      type: 'date',
      label: { cs: 'Zobrazovat do', en: 'Show until', ru: 'Показывать до' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'clickCount',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', readOnly: true },
      label: { cs: 'Počet kliků', en: 'Click count', ru: 'Количество кликов' },
    },
  ],
}
