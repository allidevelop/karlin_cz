import { getPayload } from 'payload'
import config from '@payload-config'

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

/**
 * Get all active services, sorted by sortOrder.
 */
export async function getServices(limit = 100) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'services',
    limit,
    depth: 2,
    sort: 'sortOrder',
    where: {
      isActive: { equals: true },
    },
  })
  return result.docs
}

/**
 * Get a single service by its slug.
 * Returns the document or `null` if not found.
 */
export async function getServiceBySlug(slug: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'services',
    limit: 1,
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
    sort: 'sortOrder',
  })
  return result.docs
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

/**
 * Get all active FAQ items, sorted by sortOrder.
 */
export async function getFAQ() {
  const payload = await getPayload({ config })
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
    where: {
      slug: { equals: slug },
    },
  })
  return result.docs[0] ?? null
}

// ---------------------------------------------------------------------------
// Express Wash Settings (Global)
// ---------------------------------------------------------------------------

export async function getExpressWashSettings() {
  try {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({ slug: 'express-wash-settings' })
    return {
      showLoyaltyCta: !!data?.showLoyaltyCta,
      showVoucherCta: !!data?.showVoucherCta,
    }
  } catch {
    return { showLoyaltyCta: false, showVoucherCta: false }
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
    sort: 'sortOrder',
    where: {
      isActive: { equals: true },
    },
  })
  return result.docs
}
