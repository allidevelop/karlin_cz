import type { GlobalConfig } from 'payload'

export const ExpressWashSettings: GlobalConfig = {
  slug: 'express-wash-settings',
  label: { cs: 'Express Wash – Info karty', en: 'Express Wash – Info cards', ru: 'Express Wash – Инфо карточки' },
  admin: {
    group: { cs: 'Nastavení', en: 'Settings', ru: 'Настройки' },
  },
  fields: [
    {
      name: 'showLoyaltyCta',
      label: 'Zobrazit tlačítko – Věrnostní program',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'showVoucherCta',
      label: 'Zobrazit tlačítko – Dárkový voucher',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'desktopBannerImage',
      label: 'Banner obrázek (desktop)',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Doporučeno: JPG/WebP, 1920×400px, max 500 KB' },
    },
    {
      name: 'mobileBannerImage',
      label: 'Banner obrázek (mobil)',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Doporučeno: JPG/WebP, 768×400px, max 300 KB' },
    },
  ],
}
