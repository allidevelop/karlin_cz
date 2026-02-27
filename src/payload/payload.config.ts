import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Collections
import { Services } from './collections/Services'
import { ServiceCategories } from './collections/ServiceCategories'
import { VehicleCategories } from './collections/VehicleCategories'
import { BlogPosts } from './collections/BlogPosts'
import { Promotions } from './collections/Promotions'
import { Reviews } from './collections/Reviews'
import { FAQ } from './collections/FAQ'
import { Partners } from './collections/Partners'
import { Media } from './collections/Media'
import { Newsletter } from './collections/Newsletter'
import { Pages } from './collections/Pages'
import { Bookings } from './collections/Bookings'

// Globals
import { ExpressWashSettings } from './globals/ExpressWashSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Automycka Karlin',
    },
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
      admin: { useAsTitle: 'email' },
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
  ],
  globals: [ExpressWashSettings],
  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
})
