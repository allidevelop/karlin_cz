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
      label: 'Banner obrázek (desktop) — nahrajte jiný pro každý jazyk',
      type: 'upload',
      relationTo: 'media',
      localized: true,
      admin: { description: 'Doporučeno: JPG/WebP, 1920×400px, max 500 KB. Nahrajte jiný obrázek pro CZ/EN/RU.' },
    },
    {
      name: 'mobileBannerImage',
      label: 'Banner obrázek (mobil) — nahrajte jiný pro každý jazyk',
      type: 'upload',
      relationTo: 'media',
      localized: true,
      admin: { description: 'Doporučeno: JPG/WebP, 768×400px, max 300 KB. Nahrajte jiný obrázek pro CZ/EN/RU.' },
    },
    {
      name: 'bannerLink',
      label: 'Odkaz banneru (kam vede klik)',
      type: 'text',
      localized: true,
      admin: { description: 'URL kam vede klik na banner. Např: /rezervace/vozidlo' },
    },
  ],
}
