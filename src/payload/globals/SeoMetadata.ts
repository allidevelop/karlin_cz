import type { GlobalConfig } from 'payload'

/**
 * Mapping from CMS field name to the dot-path in messages JSON.
 * Used by mapFieldsToMessages() to overlay CMS values onto i18n defaults.
 */
export const SEO_FIELD_MAP: Record<string, string> = {
  // Hlavní stránka
  homeTitle: 'metadata.title',
  homeDescription: 'metadata.description',
  // Služby
  servicesTitle: 'metadata.servicesTitle',
  servicesDescription: 'metadata.servicesDescription',
  additionalServicesTitle: 'metadata.additionalServicesTitle',
  additionalServicesDescription: 'metadata.additionalServicesDescription',
  vehicleCategoriesTitle: 'metadata.vehicleCategoriesTitle',
  vehicleCategoriesDescription: 'metadata.vehicleCategoriesDescription',
  // Akce
  promotionsTitle: 'metadata.promotionsTitle',
  promotionsDescription: 'metadata.promotionsDescription',
  promoNotFound: 'metadata.promoNotFound',
  // Blog
  blogTitle: 'metadata.blogTitle',
  blogDescription: 'metadata.blogDescription',
  // Rezervace
  bookingTitle: 'metadata.bookingTitle',
  bookingDescription: 'metadata.bookingDescription',
  // Pro firmy
  forBusinessTitle: 'metadata.forBusinessTitle',
  forBusinessDescription: 'metadata.forBusinessDescription',
  // Právní
  termsTitle: 'metadata.termsTitle',
  termsDescription: 'metadata.termsDescription',
  privacyTitle: 'metadata.privacyTitle',
  privacyDescription: 'metadata.privacyDescription',
  // Ostatní — none currently, but tab kept for future additions
}

export const SeoMetadata: GlobalConfig = {
  slug: 'seo-metadata',
  label: { cs: 'SEO Metadata', en: 'SEO Metadata', ru: 'SEO Метаданные' },
  admin: {
    group: { cs: 'Překlady', en: 'Translations', ru: 'Переводы' },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hlavní stránka',
          fields: [
            { name: 'homeTitle', type: 'text', localized: true, label: 'Title' },
            { name: 'homeDescription', type: 'text', localized: true, label: 'Description' },
          ],
        },
        {
          label: 'Služby',
          fields: [
            { name: 'servicesTitle', type: 'text', localized: true, label: 'Služby — Title' },
            { name: 'servicesDescription', type: 'text', localized: true, label: 'Služby — Description' },
            { name: 'additionalServicesTitle', type: 'text', localized: true, label: 'Doplňkové služby — Title' },
            { name: 'additionalServicesDescription', type: 'text', localized: true, label: 'Doplňkové služby — Description' },
            { name: 'vehicleCategoriesTitle', type: 'text', localized: true, label: 'Kategorie vozidel — Title' },
            { name: 'vehicleCategoriesDescription', type: 'text', localized: true, label: 'Kategorie vozidel — Description' },
          ],
        },
        {
          label: 'Akce',
          fields: [
            { name: 'promotionsTitle', type: 'text', localized: true, label: 'Akce — Title' },
            { name: 'promotionsDescription', type: 'text', localized: true, label: 'Akce — Description' },
            { name: 'promoNotFound', type: 'text', localized: true, label: 'Akce nenalezena — text' },
          ],
        },
        {
          label: 'Blog',
          fields: [
            { name: 'blogTitle', type: 'text', localized: true, label: 'Blog — Title' },
            { name: 'blogDescription', type: 'text', localized: true, label: 'Blog — Description' },
          ],
        },
        {
          label: 'Rezervace',
          fields: [
            { name: 'bookingTitle', type: 'text', localized: true, label: 'Rezervace — Title' },
            { name: 'bookingDescription', type: 'text', localized: true, label: 'Rezervace — Description' },
          ],
        },
        {
          label: 'Pro firmy',
          fields: [
            { name: 'forBusinessTitle', type: 'text', localized: true, label: 'Pro firmy — Title' },
            { name: 'forBusinessDescription', type: 'text', localized: true, label: 'Pro firmy — Description' },
          ],
        },
        {
          label: 'Právní',
          fields: [
            { name: 'termsTitle', type: 'text', localized: true, label: 'Obchodní podmínky — Title' },
            { name: 'termsDescription', type: 'text', localized: true, label: 'Obchodní podmínky — Description' },
            { name: 'privacyTitle', type: 'text', localized: true, label: 'Zásady ochrany — Title' },
            { name: 'privacyDescription', type: 'text', localized: true, label: 'Zásady ochrany — Description' },
          ],
        },
        // Ostatní — tab will be added when new SEO fields are needed
      ],
    },
  ],
}
