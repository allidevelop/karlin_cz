import { NextRequest, NextResponse } from 'next/server'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'
import { altegioClient } from '@/lib/altegio/client'
import path from 'path'
import fs from 'fs/promises'

/**
 * Sync services from Altegio into Payload CMS.
 * GET /api/booking/sync-services?secret=...
 *
 * Fetches all services from Altegio API and creates/updates them in Payload:
 * - Programs (TO GO, TO GLOW, etc.) with per-vehicle pricing + altegioServiceId
 * - Addons (DOPLŇKOVÉ SLUŽBY) as standalone services with altegioId
 * - Vehicle categories get altegioCategoryId
 *
 * IMPORTANT: Only updates Altegio-sourced fields (price, altegioId, pricingByVehicle,
 * duration, isActive). Does NOT overwrite manually-set CMS fields (features, description,
 * subtitle, image, addonCategory, content, gallery).
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

// Altegio category IDs
const ALTEGIO_VEHICLE_CATEGORIES: Record<string, { altegioCategoryId: number; payloadSlug: string }> = {
  'hatchback-sedan': { altegioCategoryId: 11897500, payloadSlug: 'hatchback-sedan' },
  'suv': { altegioCategoryId: 11897504, payloadSlug: 'suv' },
  'g-class': { altegioCategoryId: 11897508, payloadSlug: 'g-class-v-class-pickup' },
  'motocykly': { altegioCategoryId: 12810110, payloadSlug: 'motocykly' },
}

const ADDON_CATEGORY_ID = 12923782

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[čč]/g, 'c').replace(/[řř]/g, 'r').replace(/[šš]/g, 's')
    .replace(/[žž]/g, 'z').replace(/[ýý]/g, 'y').replace(/[áá]/g, 'a')
    .replace(/[íí]/g, 'i').replace(/[éé]/g, 'e').replace(/[úůú]/g, 'u')
    .replace(/[ďď]/g, 'd').replace(/[ťť]/g, 't').replace(/[ňň]/g, 'n')
    .replace(/[ěě]/g, 'e').replace(/[óó]/g, 'o')
    .replace(/[„""]/g, '')
    .replace(/[–—]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function durationToText(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0 && m > 0) return `${h} hod ${m} min`
  if (h > 0) return `${h} hod`
  return `${m} min`
}

/**
 * Download image from Altegio URL and upload to Payload Media collection.
 * Returns the media document ID, or null on failure.
 * Skips if imageUrl is empty or not a valid URL.
 */
async function downloadAndUploadImage(
  payload: Payload,
  imageUrl: string,
  altText: string,
): Promise<number | null> {
  if (!imageUrl || !imageUrl.startsWith('http')) return null

  try {
    const response = await fetch(imageUrl)
    if (!response.ok) return null

    const buffer = Buffer.from(await response.arrayBuffer())
    const contentType = response.headers.get('content-type') ?? 'image/jpeg'
    const ext = contentType.includes('png') ? '.png' : contentType.includes('webp') ? '.webp' : '.jpg'
    const filename = `altegio-${slugify(altText)}${ext}`

    // Write to temp file (Payload needs a file path for local uploads)
    const tmpDir = path.join(process.cwd(), 'public', 'media')
    await fs.mkdir(tmpDir, { recursive: true })
    const tmpPath = path.join(tmpDir, filename)
    await fs.writeFile(tmpPath, buffer)

    // Create media document via Payload local API
    const media = await payload.create({
      collection: 'media',
      data: { alt: altText },
      filePath: tmpPath,
    })

    return media.id as number
  } catch (err) {
    console.error(`[Sync] Failed to download image for "${altText}":`, err)
    return null
  }
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })

    // 1. Fetch all services from Altegio
    const altegioRes = await altegioClient.getServices()
    if (!altegioRes.success) {
      return NextResponse.json({ error: 'Failed to fetch Altegio services' }, { status: 502 })
    }

    const altegioServices = altegioRes.data
    const stats = { vehicleCatsUpdated: 0, programsCreated: 0, programsUpdated: 0, addonsCreated: 0, addonsUpdated: 0 }

    // 2. Update vehicle categories with altegioCategoryId
    const vehicleCatDocs = await payload.find({ collection: 'vehicle-categories', limit: 100 })
    const vehicleCatMap: Record<string, number> = {} // payloadSlug -> payloadId

    for (const vc of vehicleCatDocs.docs) {
      vehicleCatMap[vc.slug as string] = vc.id as number
      const mapping = Object.values(ALTEGIO_VEHICLE_CATEGORIES).find(m => m.payloadSlug === vc.slug)
      if (mapping && (vc as Record<string, unknown>).altegioCategoryId !== mapping.altegioCategoryId) {
        await payload.update({
          collection: 'vehicle-categories',
          id: vc.id,
          data: { altegioCategoryId: mapping.altegioCategoryId },
        })
        stats.vehicleCatsUpdated++
      }
    }

    // 3. Ensure "Doplňkové služby" service category exists
    let addonCategoryId: number
    const existingAddonCat = await payload.find({
      collection: 'service-categories',
      where: { slug: { equals: 'doplnkove-sluzby' } },
      limit: 1,
    })
    if (existingAddonCat.docs.length > 0) {
      addonCategoryId = existingAddonCat.docs[0].id as number
    } else {
      const created = await payload.create({
        collection: 'service-categories',
        data: { name: 'Doplňkové služby', slug: 'doplnkove-sluzby', sortOrder: 10 },
      })
      addonCategoryId = created.id as number
    }

    // 4. Group Altegio services by category
    const addons = altegioServices.filter(s => s.category_id === ADDON_CATEGORY_ID)
    const motoServices = altegioServices.filter(s => s.category_id === 12810110)
    const programServices = altegioServices.filter(s =>
      s.category_id !== ADDON_CATEGORY_ID && s.category_id !== 12810110
    )

    // 5. Sync programs — group by title, create one Payload service per program with pricingByVehicle
    const programsByTitle: Record<string, typeof programServices> = {}
    for (const svc of programServices) {
      const title = svc.title.trim()
      if (!programsByTitle[title]) programsByTitle[title] = []
      programsByTitle[title].push(svc)
    }

    // Also add MOTO as a separate program
    for (const svc of motoServices) {
      const title = svc.title.trim()
      if (!programsByTitle[title]) programsByTitle[title] = []
      programsByTitle[title].push(svc)
    }

    // Map altegioCategoryId -> payloadVehicleCategoryId
    const altCatToPayloadVehicle: Record<number, number> = {}
    for (const [, mapping] of Object.entries(ALTEGIO_VEHICLE_CATEGORIES)) {
      const payloadId = vehicleCatMap[mapping.payloadSlug]
      if (payloadId) altCatToPayloadVehicle[mapping.altegioCategoryId] = payloadId
    }

    // Get existing "Programy" service category (use Exteriér as default)
    const programCats = await payload.find({ collection: 'service-categories', limit: 100 })
    const programCategoryId = programCats.docs.find(c => (c.slug as string) === 'exterior')?.id as number || programCats.docs[0]?.id as number

    let sortOrder = 1
    for (const [title, variants] of Object.entries(programsByTitle)) {
      const slug = slugify(title)
      const lowestPrice = Math.min(...variants.map(v => v.price_min))
      const firstVariant = variants[0]

      // Build pricingByVehicle
      const pricingByVehicle = variants
        .map(v => {
          const payloadVehicleId = altCatToPayloadVehicle[v.category_id]
          if (!payloadVehicleId) return null
          return {
            vehicleCategory: payloadVehicleId,
            price: v.price_min,
            altegioServiceId: v.id,
          }
        })
        .filter(Boolean)

      // Check if service already exists by slug
      const existing = await payload.find({
        collection: 'services',
        where: { slug: { equals: slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        // Only update Altegio-sourced fields — preserve manual CMS content
        const updateData: Record<string, unknown> = {
            name: title,
            price: lowestPrice,
            altegioId: firstVariant.id,
            pricingByVehicle,
            duration: durationToText(firstVariant.duration),
            isActive: true,
            isAddon: false,
            sortOrder: sortOrder++,
        }
        // Sync description from Altegio comment if CMS description is empty
        if (!existing.docs[0].description && firstVariant.comment) {
          updateData.description = firstVariant.comment
        }
        // Upload image from Altegio if service has no image yet
        if (!existing.docs[0].image && firstVariant.image) {
          const mediaId = await downloadAndUploadImage(payload, firstVariant.image, title)
          if (mediaId) updateData.image = mediaId
        }
        await payload.update({
          collection: 'services',
          id: existing.docs[0].id,
          data: updateData,
          locale: 'cs',
        })
        stats.programsUpdated++
      } else {
        const createData: Record<string, unknown> = {
            name: title,
            slug,
            price: lowestPrice,
            altegioId: firstVariant.id,
            category: programCategoryId,
            pricingByVehicle,
            duration: durationToText(firstVariant.duration),
            isActive: true,
            isAddon: false,
            sortOrder: sortOrder++,
        }
        // Sync description from Altegio comment
        if (firstVariant.comment) {
          createData.description = firstVariant.comment
        }
        // Upload image from Altegio for new services
        if (firstVariant.image) {
          const mediaId = await downloadAndUploadImage(payload, firstVariant.image, title)
          if (mediaId) createData.image = mediaId
        }
        await payload.create({
          collection: 'services',
          data: createData,
          locale: 'cs',
        })
        stats.programsCreated++
      }
    }

    // 6. Sync addons — only update Altegio-sourced fields
    for (const addon of addons) {
      const slug = slugify(addon.title)

      const existing = await payload.find({
        collection: 'services',
        where: { slug: { equals: slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        // Only update Altegio-sourced fields — preserve image, addonCategory
        const updateData: Record<string, unknown> = {
            name: addon.title,
            price: addon.price_min,
            altegioId: addon.id,
            duration: durationToText(addon.duration),
            isActive: true,
            isAddon: true,
            sortOrder: sortOrder++,
        }
        // Sync description from Altegio comment if CMS description is empty
        if (!existing.docs[0].description && addon.comment) {
          updateData.description = addon.comment
        }
        if (!existing.docs[0].image && addon.image) {
          const mediaId = await downloadAndUploadImage(payload, addon.image, addon.title)
          if (mediaId) updateData.image = mediaId
        }
        await payload.update({
          collection: 'services',
          id: existing.docs[0].id,
          data: updateData,
          locale: 'cs',
        })
        stats.addonsUpdated++
      } else {
        const createData: Record<string, unknown> = {
            name: addon.title,
            slug,
            price: addon.price_min,
            altegioId: addon.id,
            category: addonCategoryId,
            duration: durationToText(addon.duration),
            isActive: true,
            isAddon: true,
            sortOrder: sortOrder++,
        }
        if (addon.comment) {
          createData.description = addon.comment
        }
        if (addon.image) {
          const mediaId = await downloadAndUploadImage(payload, addon.image, addon.title)
          if (mediaId) createData.image = mediaId
        }
        await payload.create({
          collection: 'services',
          data: createData,
          locale: 'cs',
        })
        stats.addonsCreated++
      }
    }

    // 7. Summary
    const totalServices = await payload.find({ collection: 'services', limit: 0 })

    return NextResponse.json({
      success: true,
      stats,
      totalServicesInPayload: totalServices.totalDocs,
      altegioServicesCount: altegioServices.length,
    })
  } catch (error) {
    console.error('[Sync Services]', error)
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    )
  }
}
