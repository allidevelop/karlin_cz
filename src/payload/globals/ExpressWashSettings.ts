import type { GlobalConfig } from 'payload'

export const ExpressWashSettings: GlobalConfig = {
  slug: 'express-wash-settings',
  label: 'Express Wash – Info karty',
  admin: {
    group: 'Nastavení',
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
  ],
}
