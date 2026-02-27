import type { MetadataRoute } from 'next'
import { getServices, getBlogPosts, getPromotions } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3231'

  const staticPages = [
    '',
    '/sluzby',
    '/akce',
    '/blog',
    '/pro-firmy',
    '/kategorie-vozidel',
    '/doplnkove-sluzby',
    '/zasady-ochrany-osobnich-udaju',
    '/obchodni-podminky',
    '/rezervace/vozidlo',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const services = await getServices()
  const servicePages = services.map((s) => ({
    url: `${baseUrl}/sluzby/${s.slug}`,
    lastModified: new Date(s.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const posts = await getBlogPosts()
  const blogPages = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const promos = await getPromotions()
  const promoPages = promos.map((p) => ({
    url: `${baseUrl}/akce/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages, ...blogPages, ...promoPages]
}
