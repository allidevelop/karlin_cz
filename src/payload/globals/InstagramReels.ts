import type { GlobalConfig } from 'payload'

export const InstagramReels: GlobalConfig = {
  slug: 'instagram-reels',
  label: { cs: 'Instagram Reels', en: 'Instagram Reels', ru: 'Instagram Reels' },
  admin: {
    group: { cs: 'Obsah', en: 'Content', ru: 'Контент' },
  },
  fields: [
    { name: 'sectionTitle', type: 'text', localized: true, label: 'Nadpis sekce', defaultValue: 'Sledujte nás na Instagramu' },
    { name: 'sectionSubtitle', type: 'text', localized: true, label: 'Podnadpis', defaultValue: '@automycka.karlin' },
    { name: 'instagramUrl', type: 'text', label: 'Instagram profil URL', defaultValue: 'https://www.instagram.com/automycka.karlin/' },
    { name: 'isEnabled', type: 'checkbox', label: 'Zobrazit sekci na hlavní stránce', defaultValue: false },
    {
      name: 'reels',
      type: 'array',
      label: 'Reels (nejnovější první)',
      admin: { description: 'Nahrajte videa z Instagramu. MP4, max 50 MB. První bude označen jako NEW.' },
      fields: [
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Video soubor',
          admin: { description: 'MP4 video, ideálně 1080×1920 (9:16), max 50 MB' },
        },
        { name: 'instagramLink', type: 'text', label: 'Odkaz na Instagram post (volitelné)', admin: { description: 'Klik na video otevře tento odkaz' } },
        { name: 'caption', type: 'text', localized: true, label: 'Popisek (volitelné)' },
      ],
    },
  ],
}
