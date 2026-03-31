import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { cs: 'Nastavení webu', en: 'Site settings', ru: 'Настройки сайта' },
  admin: {
    group: { cs: 'Nastavení', en: 'Settings', ru: 'Настройки' },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Kontaktní údaje',
          fields: [
            { name: 'phone', type: 'text', label: 'Telefon', defaultValue: '+420 775 009 033' },
            { name: 'email', type: 'email', label: 'Email', defaultValue: 'info@automycka-karlin.eu' },
            {
              name: 'address',
              type: 'group',
              label: 'Adresa',
              fields: [
                { name: 'street', type: 'text', label: 'Ulice', defaultValue: 'Sokolovská 694/98' },
                { name: 'city', type: 'text', label: 'Město', defaultValue: 'Praha 8 - Karlín' },
                { name: 'zip', type: 'text', label: 'PSČ', defaultValue: '186 00' },
                { name: 'full', type: 'text', label: 'Celá adresa (pro zobrazení)', localized: true, defaultValue: 'Sokolovská 694/98, Karlín, 186 00 Praha' },
              ],
            },
            { name: 'googleMapsUrl', type: 'text', label: 'Google Maps URL', defaultValue: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2559.123456!2d14.4486!3d50.0924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDA1JzMyLjYiTiAxNMKwMjYnNTUuMCJF!5e0!3m2!1scs!2scz!4v1234567890' },
            { name: 'googleMapsLink', type: 'text', label: 'Odkaz na Google Maps (navigace)', defaultValue: 'https://maps.app.goo.gl/3gRDhNv4v2ZNZQYD9' },
          ],
        },
        {
          label: 'Provozní doba',
          fields: [
            {
              name: 'operatingHours',
              type: 'array',
              label: 'Provozní doba',
              fields: [
                { name: 'days', type: 'text', required: true, label: 'Dny', localized: true },
                { name: 'hours', type: 'text', required: true, label: 'Hodiny' },
              ],
              defaultValue: [
                { days: 'Pondělí – Neděle', hours: '7:00 – 20:00' },
              ],
            },
            { name: 'operatingHoursSummary', type: 'text', label: 'Shrnutí provozní doby (zkráceně)', localized: true, defaultValue: 'Po - Ne: 7:00 - 20:00' },
          ],
        },
        {
          label: 'Sociální sítě',
          fields: [
            { name: 'instagram', type: 'text', label: 'Instagram URL' },
            { name: 'facebook', type: 'text', label: 'Facebook URL' },
            { name: 'tiktok', type: 'text', label: 'TikTok URL' },
          ],
        },
        {
          label: 'E-mail notifikace',
          fields: [
            { name: 'contactFormEmailEnabled', type: 'checkbox', label: 'Odesílat e-mail při nové zprávě z kontaktního formuláře', defaultValue: true },
            { name: 'newsletterEmailEnabled', type: 'checkbox', label: 'Odesílat e-mail při nové přihlášce k newsletteru', defaultValue: true },
            { name: 'notificationEmail', type: 'email', label: 'E-mail pro notifikace', defaultValue: 'info@automycka-karlin.eu' },
          ],
        },
        {
          label: 'Právní informace',
          fields: [
            { name: 'companyName', type: 'text', label: 'Název společnosti', defaultValue: 'Automyčka Karlín' },
            { name: 'ico', type: 'text', label: 'IČO' },
            { name: 'dic', type: 'text', label: 'DIČ' },
          ],
        },
      ],
    },
  ],
}
