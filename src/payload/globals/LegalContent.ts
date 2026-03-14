import type { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const LegalContent: GlobalConfig = {
  slug: 'legal-content',
  label: { cs: 'Právní dokumenty', en: 'Legal Documents', ru: 'Юридические документы' },
  admin: {
    group: { cs: 'Překlady', en: 'Translations', ru: 'Переводы' },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Obchodní podmínky',
          fields: [
            {
              name: 'termsTitle',
              type: 'text',
              localized: true,
              label: 'Nadpis',
              defaultValue: 'Obchodní podmínky',
            },
            {
              name: 'termsEffectiveDate',
              type: 'text',
              localized: true,
              label: 'Datum účinnosti',
              defaultValue: 'Tyto obchodní podmínky jsou platné a účinné od 1. 1. 2026.',
            },
            {
              name: 'termsContent',
              type: 'richText',
              localized: true,
              label: 'Obsah obchodních podmínek',
              editor: lexicalEditor(),
            },
          ],
        },
        {
          label: 'Zásady ochrany osobních údajů',
          fields: [
            {
              name: 'privacyTitle',
              type: 'text',
              localized: true,
              label: 'Nadpis',
              defaultValue: 'Zásady ochrany osobních údajů',
            },
            {
              name: 'privacyEffectiveDate',
              type: 'text',
              localized: true,
              label: 'Datum účinnosti',
              defaultValue: 'Tyto zásady ochrany osobních údajů jsou platné a účinné od 1. 1. 2026.',
            },
            {
              name: 'privacyContent',
              type: 'richText',
              localized: true,
              label: 'Obsah zásad ochrany osobních údajů',
              editor: lexicalEditor(),
            },
          ],
        },
      ],
    },
  ],
}
