import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Collections
import { Services } from './collections/Services.ts'
import { ServiceCategories } from './collections/ServiceCategories.ts'
import { VehicleCategories } from './collections/VehicleCategories.ts'
import { BlogPosts } from './collections/BlogPosts.ts'
import { Promotions } from './collections/Promotions.ts'
import { Reviews } from './collections/Reviews.ts'
import { FAQ } from './collections/FAQ.ts'
import { Partners } from './collections/Partners.ts'
import { Media } from './collections/Media.ts'
import { Newsletter } from './collections/Newsletter.ts'
import { Pages } from './collections/Pages.ts'
import { Bookings } from './collections/Bookings.ts'
import { ContactMessages } from './collections/ContactMessages.ts'
import { Banners } from './collections/Banners.ts'
import { PopupBanners } from './collections/PopupBanners.ts'
import { PromoCodes } from './collections/PromoCodes.ts'

// Globals
import { ExpressWashSettings } from './globals/ExpressWashSettings.ts'
import { SiteSettings } from './globals/SiteSettings.ts'
import { HomePageContent } from './globals/HomePageContent.ts'
import { Translations } from './globals/Translations.ts'
import { TranslationsBooking } from './globals/TranslationsBooking.ts'
import { TranslationsCommon } from './globals/TranslationsCommon.ts'
import { TranslationsPages } from './globals/TranslationsPages.ts'
import { LegalContent } from './globals/LegalContent.ts'
import { SeoMetadata } from './globals/SeoMetadata.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Automycka Karlin',
    },
  },
  localization: {
    locales: [
      { label: 'Čeština', code: 'cs' },
      { label: 'English', code: 'en' },
      { label: 'Русский', code: 'ru' },
    ],
    defaultLocale: 'cs',
    fallback: true,
  },
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || 'postgresql://automycka:automycka_pass_2026@localhost:5432/automycka',
    },
  }),
  collections: [
    {
      slug: 'users',
      auth: true,
      labels: {
        singular: { cs: 'Uživatel', en: 'User', ru: 'Пользователь' },
        plural: { cs: 'Uživatelé', en: 'Users', ru: 'Пользователи' },
      },
      admin: {
        useAsTitle: 'email',
        group: { cs: 'Nastavení', en: 'Settings', ru: 'Настройки' },
      },
      fields: [],
    },
    Services,
    ServiceCategories,
    VehicleCategories,
    BlogPosts,
    Promotions,
    Reviews,
    FAQ,
    Partners,
    Media,
    Newsletter,
    Pages,
    Bookings,
    ContactMessages,
    Banners,
    PopupBanners,
    PromoCodes,
  ],
  globals: [
    ExpressWashSettings,
    SiteSettings,
    HomePageContent,
    Translations,
    TranslationsBooking,
    TranslationsCommon,
    TranslationsPages,
    LegalContent,
    SeoMetadata,
  ],
  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
})
