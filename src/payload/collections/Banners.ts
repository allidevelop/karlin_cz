import type { CollectionConfig } from 'payload'

export const Banners: CollectionConfig = {
  slug: 'banners',
  access: {
    read: () => true,
  },
  labels: {
    singular: { cs: 'Banner', en: 'Banner', ru: 'Баннер' },
    plural: { cs: 'Bannery', en: 'Banners', ru: 'Баннеры' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'position', 'isActive', 'startDate', 'endDate'],
    group: { cs: 'Marketing', en: 'Marketing', ru: 'Маркетинг' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: { cs: 'Název banneru', en: 'Banner title', ru: 'Название баннера' },
    },
    {
      name: 'desktopImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      localized: true,
      label: { cs: 'Desktop obrázek (2x pro retina)', en: 'Desktop image (2x for retina)', ru: 'Десктоп изображение (2x для retina)' },
      admin: { description: 'Doporučeno: JPG/WebP, 1920×400px, max 500 KB' },
    },
    {
      name: 'mobileImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      localized: true,
      label: { cs: 'Mobilní obrázek (2x pro retina)', en: 'Mobile image (2x for retina)', ru: 'Мобильное изображение (2x для retina)' },
      admin: { description: 'Doporučeno: JPG/WebP, 768×400px, max 300 KB' },
    },
    {
      name: 'linkUrl',
      type: 'text',
      localized: true,
      label: { cs: 'Odkaz (URL)', en: 'Link (URL)', ru: 'Ссылка (URL)' },
    },
    {
      name: 'position',
      type: 'select',
      required: true,
      label: { cs: 'Pozice na stránce', en: 'Position on page', ru: 'Позиция на странице' },
      defaultValue: 'hero-below',
      options: [
        { label: { cs: 'Pod hero sekcí', en: 'Below hero section', ru: 'Под hero секцией' }, value: 'hero-below' },
        { label: { cs: 'Express Wash sekce', en: 'Express Wash section', ru: 'Секция Express Wash' }, value: 'express-wash' },
        { label: { cs: 'Nad patičkou', en: 'Above footer', ru: 'Над футером' }, value: 'footer-above' },
      ],
    },
    {
      name: 'displayMode',
      type: 'select',
      label: { cs: 'Režim zobrazení', en: 'Display mode', ru: 'Режим отображения' },
      defaultValue: 'always',
      options: [
        { label: { cs: 'Vždy zobrazit', en: 'Always show', ru: 'Показывать всегда' }, value: 'always' },
        { label: { cs: 'Rotace (carousel)', en: 'Rotation (carousel)', ru: 'Ротация (карусель)' }, value: 'rotation' },
        { label: { cs: 'A/B test', en: 'A/B test', ru: 'A/B тест' }, value: 'ab-test' },
      ],
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
