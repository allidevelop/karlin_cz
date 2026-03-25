import { getPayload } from 'payload'
import config from '@payload-config'

/** Extract the URL from a resolved Payload upload field. */
export function getMediaUrl(media: unknown): string | null {
  if (!media || typeof media !== 'object') return null
  return (media as { url?: string }).url ?? null
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

/**
 * Get all active services, sorted by sortOrder.
 */
export async function getServices(limit = 100, locale?: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'services',
    limit,
    depth: 2,
    sort: 'sortOrder',
    locale: locale as 'cs' | 'en' | 'ru' | undefined,
    where: {
      isActive: { equals: true },
    },
  })
  return result.docs
}

/**
 * Get all active programs (non-addon services), sorted by sortOrder.
 */
export async function getPrograms(limit = 100, locale?: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'services',
    limit,
    depth: 2,
    sort: 'sortOrder',
    locale: locale as 'cs' | 'en' | 'ru' | undefined,
    where: {
      isActive: { equals: true },
      isAddon: { equals: false },
    },
  })
  return result.docs
}

/**
 * Get all active addons, sorted by sortOrder.
 */
export async function getAddons(limit = 100, locale?: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'services',
    limit,
    depth: 1,
    sort: 'sortOrder',
    locale: locale as 'cs' | 'en' | 'ru' | undefined,
    where: {
      isActive: { equals: true },
      isAddon: { equals: true },
    },
  })
  return result.docs
}

/**
 * Get a single service by its slug.
 * Returns the document or `null` if not found.
 */
export async function getServiceBySlug(slug: string, locale?: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'services',
    limit: 1,
    depth: 2,
    locale: locale as 'cs' | 'en' | 'ru' | undefined,
    where: {
      slug: { equals: slug },
    },
  })
  return result.docs[0] ?? null
}

// ---------------------------------------------------------------------------
// Service Categories
// ---------------------------------------------------------------------------

/**
 * Get all service categories, sorted by sortOrder.
 */
export async function getServiceCategories() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'service-categories',
    limit: 100,
    sort: 'sortOrder',
  })
  return result.docs
}

// ---------------------------------------------------------------------------
// Vehicle Categories
// ---------------------------------------------------------------------------

/**
 * Get all vehicle categories, sorted by sortOrder.
 */
export async function getVehicleCategories() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'vehicle-categories',
    limit: 100,
    depth: 1,
    sort: 'sortOrder',
  })
  return result.docs
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

/**
 * Get all active FAQ items, sorted by sortOrder.
 * If `page` is provided, only returns items assigned to that page (or items with no pages set).
 */
export async function getFAQ(page?: string) {
  const payload = await getPayload({ config })

  if (page) {
    const result = await payload.find({
      collection: 'faq',
      limit: 100,
      sort: 'sortOrder',
      where: {
        isActive: { equals: true },
        or: [
          { pages: { contains: page } },
          { pages: { exists: false } },
        ],
      },
    })
    return result.docs
  }

  const result = await payload.find({
    collection: 'faq',
    limit: 100,
    sort: 'sortOrder',
    where: {
      isActive: { equals: true },
    },
  })
  return result.docs
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

/**
 * Get all approved reviews, sorted by date descending (newest first).
 */
export async function getReviews() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'reviews',
    limit: 100,
    sort: '-date',
    where: {
      isApproved: { equals: true },
    },
  })
  return result.docs
}

// ---------------------------------------------------------------------------
// Promotions
// ---------------------------------------------------------------------------

/**
 * Get all active promotions.
 */
export async function getPromotions() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'promotions',
    limit: 100,
    depth: 1,
    where: {
      isActive: { equals: true },
    },
  })
  return result.docs
}

/**
 * Get a single promotion by its slug.
 * Returns the document or `null` if not found.
 */
export async function getPromotionBySlug(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'promotions',
    limit: 1,
    depth: 1,
    where: {
      slug: { equals: slug },
    },
  })
  return result.docs[0] ?? null
}

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------

/**
 * Get published blog posts, sorted by publishedAt descending (newest first).
 */
export async function getBlogPosts(limit = 10) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'blog-posts',
    limit,
    depth: 1,
    sort: '-publishedAt',
    where: {
      isPublished: { equals: true },
    },
  })
  return result.docs
}

/**
 * Get a single blog post by its slug.
 * Returns the document or `null` if not found.
 */
export async function getBlogPostBySlug(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'blog-posts',
    limit: 1,
    depth: 1,
    where: {
      slug: { equals: slug },
    },
  })
  return result.docs[0] ?? null
}

// ---------------------------------------------------------------------------
// Express Wash Settings (Global)
// ---------------------------------------------------------------------------

export async function getExpressWashSettings(locale?: string) {
  try {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({
      slug: 'express-wash-settings',
      depth: 1,
      locale: locale as 'cs' | 'en' | 'ru' | undefined,
    })
    return {
      showLoyaltyCta: !!data?.showLoyaltyCta,
      showVoucherCta: !!data?.showVoucherCta,
      desktopBannerUrl: getMediaUrl(data?.desktopBannerImage),
      mobileBannerUrl: getMediaUrl(data?.mobileBannerImage),
      bannerLink: (data as Record<string, unknown>)?.bannerLink as string | null ?? null,
    }
  } catch {
    return { showLoyaltyCta: false, showVoucherCta: false, desktopBannerUrl: null, mobileBannerUrl: null, bannerLink: null }
  }
}

// ---------------------------------------------------------------------------
// Instagram Reels (Global)
// ---------------------------------------------------------------------------

export async function getInstagramReels(locale?: string) {
  try {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({
      slug: 'instagram-reels',
      depth: 1,
      locale: locale as 'cs' | 'en' | 'ru' | undefined,
    }) as Record<string, unknown>
    if (!data?.isEnabled) return null
    return {
      title: data.sectionTitle as string | null,
      subtitle: data.sectionSubtitle as string | null,
      instagramUrl: data.instagramUrl as string | null,
      reels: ((data.reels as Array<{ video?: { url?: string } | null; instagramLink?: string; caption?: string }>) ?? [])
        .filter(r => r.video && typeof r.video === 'object' && r.video.url)
        .map(r => ({
          videoUrl: (r.video as { url: string }).url,
          instagramLink: r.instagramLink ?? null,
          caption: r.caption ?? null,
        }))
        .filter((reel, index, self) => self.findIndex(r => r.videoUrl === reel.videoUrl) === index),
    }
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------

/**
 * Get all active partners, sorted by sortOrder.
 */
export async function getPartners() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'partners',
    limit: 100,
    depth: 1,
    sort: 'sortOrder',
    where: {
      isActive: { equals: true },
    },
  })
  return result.docs
}

// ---------------------------------------------------------------------------
// Site Settings (Global)
// ---------------------------------------------------------------------------

export async function getSiteSettings(locale?: string) {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({
      slug: 'site-settings',
      locale: locale as 'cs' | 'en' | 'ru' | undefined,
    })
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Banners
// ---------------------------------------------------------------------------

/**
 * Get active banners filtered by position, respecting date scheduling.
 */
export async function getActiveBanners(position?: string, locale?: string) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'banners',
    limit: 20,
    depth: 1,
    sort: '-priority',
    locale: locale as 'cs' | 'en' | 'ru' | undefined,
    where: position
      ? { and: [{ isActive: { equals: true } }, { position: { equals: position } }] }
      : { isActive: { equals: true } },
  })

  const now = new Date()
  return result.docs.filter((b) => {
    if (b.startDate && new Date(b.startDate) > now) return false
    if (b.endDate && new Date(b.endDate) < now) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// Popup Banners
// ---------------------------------------------------------------------------

/**
 * Get active popup banners sorted by priority (highest first), respecting date scheduling.
 */
export async function getActivePopups(locale?: string) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'popup-banners',
    limit: 10,
    depth: 1,
    sort: '-priority',
    locale: locale as 'cs' | 'en' | 'ru' | undefined,
    where: {
      isActive: { equals: true },
    },
  })

  const now = new Date()
  return result.docs.filter((p) => {
    if (p.startDate && new Date(p.startDate as string) > now) return false
    if (p.endDate && new Date(p.endDate as string) < now) return false
    return true
  })
}

// ---------------------------------------------------------------------------
// Translations (Global)
// ---------------------------------------------------------------------------

export async function getTranslations(locale?: string) {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({
      slug: 'translations',
      locale: locale as 'cs' | 'en' | 'ru' | undefined,
    })
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Home Page Content (Global)
// ---------------------------------------------------------------------------

export async function getHomePageContent(locale?: string) {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({
      slug: 'home-page-content',
      locale: locale as 'cs' | 'en' | 'ru' | undefined,
      depth: 1,
    })
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// CMS Messages Merge — fetch all translation globals and merge into one object
// ---------------------------------------------------------------------------

import { deepMerge, mapFieldsToMessages } from './cms-messages'
import { BOOKING_FIELD_MAP } from '@/payload/globals/TranslationsBooking'
import { COMMON_FIELD_MAP } from '@/payload/globals/TranslationsCommon'
import { PAGES_FIELD_MAP } from '@/payload/globals/TranslationsPages'
import { SEO_FIELD_MAP } from '@/payload/globals/SeoMetadata'

async function fetchGlobalSafe(slug: string, locale: string): Promise<Record<string, unknown>> {
  try {
    const payload = await getPayload({ config })
    return (await payload.findGlobal({
      slug,
      locale: locale as 'cs' | 'en' | 'ru',
      depth: 0,
    })) as unknown as Record<string, unknown>
  } catch {
    return {}
  }
}

/**
 * Fetch ALL CMS translation globals and return a merged messages object
 * that can overlay the static JSON messages.
 */
export async function getCmsMessages(locale: string): Promise<Record<string, unknown>> {
  const [booking, common, pages, seo] = await Promise.all([
    fetchGlobalSafe('translations-booking', locale),
    fetchGlobalSafe('translations-common', locale),
    fetchGlobalSafe('translations-pages', locale),
    fetchGlobalSafe('seo-metadata', locale),
  ])

  const bookingMessages = mapFieldsToMessages(booking as Record<string, string>, BOOKING_FIELD_MAP)
  const commonMessages = mapFieldsToMessages(common as Record<string, string>, COMMON_FIELD_MAP)
  const pagesMessages = mapFieldsToMessages(pages as Record<string, string>, PAGES_FIELD_MAP)
  const seoMessages = mapFieldsToMessages(seo as Record<string, string>, SEO_FIELD_MAP)

  // Merge all CMS message fragments into one overlay object
  let merged: Record<string, unknown> = {}
  merged = deepMerge(merged, commonMessages) as Record<string, unknown>
  merged = deepMerge(merged, bookingMessages) as Record<string, unknown>
  merged = deepMerge(merged, pagesMessages) as Record<string, unknown>
  merged = deepMerge(merged, seoMessages) as Record<string, unknown>

  return merged
}
