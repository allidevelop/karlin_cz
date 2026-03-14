import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'
import fs from 'fs'

/**
 * One-time migration endpoint to populate CMS services with images, features,
 * descriptions, and addon categories from hardcoded data.
 *
 * GET /api/booking/populate-services?secret=...
 *
 * This uploads static images to Payload Media and links them to service/vehicle records.
 */

const SYNC_SECRET = process.env.SYNC_SECRET || process.env.PAYLOAD_SECRET || ''

function checkAuth(req: NextRequest): boolean {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret')
  if (secret && secret === SYNC_SECRET) return true
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ') && authHeader.slice(7) === SYNC_SECRET) return true
  return false
}

// Service slug -> image filename mapping
const SERVICE_IMAGE_MAP: Record<string, string> = {
  'to-go': 'service-togo.jpg',
  'to-glow': 'service-toglow.jpg',
  'to-wow': 'service-towow.jpg',
  'exterior-komplet': 'service-exterior.jpg',
  'interior-komplet': 'service-interior.jpg',
  'premium-detailing': 'service-premium.jpg',
  'premium-detailing-komplet': 'service-premium.jpg',
  'komplexni-myti': 'service-togo.jpg',
}

// Vehicle category slug -> image filenames (desktop + mobile)
const VEHICLE_IMAGE_MAP: Record<string, { desktop: string; mobile: string }> = {
  'hatchback-sedan': { desktop: 'vehicle-hatchback.png', mobile: 'vehicle-hatchback-mobile.png' },
  'suv': { desktop: 'vehicle-suv-1.png', mobile: 'vehicle-suv-mobile.png' },
  'g-class-v-class-pickup': { desktop: 'vehicle-gclass-1.png', mobile: 'vehicle-gclass-mobile.png' },
  'motocykly': { desktop: 'vehicle-moto-1.png', mobile: 'vehicle-moto-mobile.png' },
}

// Program features (only for programs missing them in CMS)
const PROGRAM_FEATURES: Record<string, string[]> = {
  'to-go': [
    'Ruční mytí karoserie',
    'Základní čištění disků',
    'Ošetření pneumatik',
    'Rychlé vysávání interiéru',
    'Sušení karoserie',
  ],
  'to-glow': [
    'Kompletní ruční mytí karoserie',
    'Čištění disků a podběhů',
    'Ošetření pneumatik a plastů',
    'Kompletní vysávání interiéru',
    'Čištění palubní desky',
    'Čištění sedadel',
    'Mytí oken zevnitř i zvenku',
    'Vůně interiéru',
  ],
  'to-wow': [
    'Předmytí a ruční mytí',
    'Dekontaminace laku',
    'Jednovrstvé leštění',
    'Aplikace vosku / sealantu',
    'Čištění disků a motorového prostoru',
    'Kompletní čištění interiéru',
    'Čištění a ošetření kůže / textilu',
    'Mytí oken zevnitř i zvenku',
    'Vůně interiéru',
  ],
  'exterior-komplet': [
    'Předmytí a ruční mytí karoserie',
    'Čištění disků a podběhů',
    'Ošetření pneumatik',
    'Mytí oken a zrcátek',
    'Ošetření plastových prvků',
    'Sušení mikrovláknem',
  ],
  'interior-komplet': [
    'Kompletní vysávání interiéru',
    'Čištění palubní desky a panelů',
    'Čištění a ošetření sedadel',
    'Čištění podlahových koberců',
    'Čištění oken zevnitř',
    'Ošetření plastů a gumy',
    'Vůně interiéru',
  ],
  'premium-detailing': [
    'Kompletní předmytí a ruční mytí',
    'Dekontaminace laku (clay bar)',
    'Vícevrstvé strojní leštění',
    'Keramický coating / prémiový vosk',
    'Čištění motorového prostoru',
    'Kompletní renovace interiéru',
    'Hloubkové čištění sedadel a koberců',
    'Ošetření kůže speciálními přípravky',
    'Mytí oken s hydrofobní úpravou',
    'Prémiová vůně interiéru',
  ],
  'premium-detailing-komplet': [
    'Kompletní předmytí a ruční mytí',
    'Dekontaminace laku (clay bar)',
    'Vícevrstvé strojní leštění',
    'Keramický coating / prémiový vosk',
    'Čištění motorového prostoru',
    'Kompletní renovace interiéru',
    'Hloubkové čištění sedadel a koberců',
    'Ošetření kůže speciálními přípravky',
    'Mytí oken s hydrofobní úpravou',
    'Prémiová vůně interiéru',
  ],
  'komplexni-myti': [
    'Kompletní ruční mytí motocyklu',
    'Čištění a ošetření plastů',
    'Ošetření pneumatik',
    'Sušení mikrovláknem',
  ],
}

// Addon descriptions and categories by altegioId
const ADDON_META: Record<number, { description: string; image: string; category: 'interior' | 'exterior' | 'protection' }> = {
  12923787: { description: 'Odstranění nečistot a skvrn, osvěžení a dezinfekce pásů.', image: 'service-interior.jpg', category: 'interior' },
  12923789: { description: 'Ochrana kožených povrchů proti vysychání a popraskání.', image: 'service-premium.jpg', category: 'interior' },
  12923791: { description: 'Profesionální odstranění vodního kamene ze skel.', image: 'service-exterior.jpg', category: 'exterior' },
  12923792: { description: 'Šetrné mytí motorového prostoru.', image: 'service-exterior.jpg', category: 'exterior' },
  12923795: { description: 'Odstranění kontaminace z povrchu laku.', image: 'service-exterior.jpg', category: 'exterior' },
  12923797: { description: 'Hydrofobní úprava čelního skla pro lepší viditelnost.', image: 'service-exterior.jpg', category: 'exterior' },
  12923800: { description: 'Hydrofobní úprava všech skel vozidla.', image: 'service-exterior.jpg', category: 'exterior' },
  12923801: { description: 'Profesionální dezinfekce interiéru ozonem.', image: 'service-interior.jpg', category: 'interior' },
  12923803: { description: 'Čištění a impregnace vinylové střechy kabrioletu.', image: 'service-premium.jpg', category: 'protection' },
  12923804: { description: 'Ochrana laku tekutým nano voskem na 3 měsíce.', image: 'service-premium.jpg', category: 'protection' },
  12923805: { description: 'Prémiová ochrana laku tuhým voskem Carnauba na 6 měsíců.', image: 'service-premium.jpg', category: 'protection' },
  12923812: { description: 'Syntetický nano vosk Fusso s ochranou na 12 měsíců.', image: 'service-premium.jpg', category: 'protection' },
  12923817: { description: 'Keramická ochrana sedaček s programem TO WOW zdarma.', image: 'service-premium.jpg', category: 'protection' },
  13073029: { description: 'Profesionální strojní leštění karoserie.', image: 'service-exterior.jpg', category: 'exterior' },
}

async function uploadImageIfNeeded(
  payload: Awaited<ReturnType<typeof getPayload>>,
  filename: string,
  alt: string,
  uploadedCache: Map<string, number>,
): Promise<number | null> {
  // Check cache first
  if (uploadedCache.has(filename)) {
    return uploadedCache.get(filename)!
  }

  // Check if already exists in media
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    const id = existing.docs[0].id as number
    uploadedCache.set(filename, id)
    return id
  }

  // Upload from public/images
  const filePath = path.join(process.cwd(), 'public', 'images', filename)
  if (!fs.existsSync(filePath)) {
    return null
  }

  const buffer = fs.readFileSync(filePath)
  const ext = path.extname(filename).slice(1).toLowerCase()
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    webp: 'image/webp',
  }
  const mimeType = mimeMap[ext] || 'image/jpeg'

  const created = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      mimetype: mimeType,
      name: filename,
      size: buffer.length,
    },
  })

  const id = created.id as number
  uploadedCache.set(filename, id)
  return id
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    const uploadedCache = new Map<string, number>()
    const stats = {
      serviceImagesLinked: 0,
      vehicleImagesLinked: 0,
      featuresPopulated: 0,
      addonDescriptions: 0,
      addonCategories: 0,
      imagesUploaded: 0,
    }

    // 1. Upload service images and link to service records
    const services = await payload.find({ collection: 'services', limit: 100 })

    for (const service of services.docs) {
      const slug = service.slug as string
      const updateData: Record<string, unknown> = {}

      // Link image if not already set
      const imageFilename = SERVICE_IMAGE_MAP[slug]
      if (imageFilename && !service.image) {
        const mediaId = await uploadImageIfNeeded(payload, imageFilename, service.name ?? slug, uploadedCache)
        if (mediaId) {
          updateData.image = mediaId
          stats.serviceImagesLinked++
        }
      }

      // Populate features if empty
      const existingFeatures = service.features as { feature: string }[] | undefined
      const featureList = PROGRAM_FEATURES[slug]
      if (featureList && (!existingFeatures || existingFeatures.length === 0)) {
        updateData.features = featureList.map(f => ({ feature: f }))
        stats.featuresPopulated++
      }

      // Populate addon description and category
      const altegioId = service.altegioId as number | undefined
      if (service.isAddon && altegioId && ADDON_META[altegioId]) {
        const meta = ADDON_META[altegioId]

        if (!service.description) {
          updateData.description = meta.description
          stats.addonDescriptions++
        }

        if (!(service as Record<string, unknown>).addonCategory) {
          updateData.addonCategory = meta.category
          stats.addonCategories++
        }

        // Link addon image if not set
        if (!service.image) {
          const mediaId = await uploadImageIfNeeded(payload, meta.image, service.name ?? slug, uploadedCache)
          if (mediaId) {
            updateData.image = mediaId
            stats.serviceImagesLinked++
          }
        }
      }

      if (Object.keys(updateData).length > 0) {
        await payload.update({
          collection: 'services',
          id: service.id,
          data: updateData,
        })
      }
    }

    // 2. Upload vehicle category images
    const vehicles = await payload.find({ collection: 'vehicle-categories', limit: 100 })

    for (const vehicle of vehicles.docs) {
      const slug = vehicle.slug as string
      const imageMap = VEHICLE_IMAGE_MAP[slug]
      if (!imageMap) continue

      const updateData: Record<string, unknown> = {}

      // Desktop image
      if (!vehicle.image) {
        const mediaId = await uploadImageIfNeeded(payload, imageMap.desktop, `${vehicle.name} - desktop`, uploadedCache)
        if (mediaId) {
          updateData.image = mediaId
          stats.vehicleImagesLinked++
        }
      }

      // Mobile image
      if (!(vehicle as Record<string, unknown>).mobileImage) {
        const mediaId = await uploadImageIfNeeded(payload, imageMap.mobile, `${vehicle.name} - mobile`, uploadedCache)
        if (mediaId) {
          updateData.mobileImage = mediaId
          stats.vehicleImagesLinked++
        }
      }

      if (Object.keys(updateData).length > 0) {
        await payload.update({
          collection: 'vehicle-categories',
          id: vehicle.id,
          data: updateData,
        })
      }
    }

    stats.imagesUploaded = uploadedCache.size

    return NextResponse.json({
      success: true,
      stats,
      message: 'Population complete. Images uploaded and linked, features/descriptions/categories populated.',
    })
  } catch (error) {
    console.error('[Populate Services]', error)
    return NextResponse.json(
      { error: 'Population failed', details: String(error) },
      { status: 500 }
    )
  }
}
