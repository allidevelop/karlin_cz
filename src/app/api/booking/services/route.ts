import { NextResponse } from 'next/server'
import { altegioClient } from '@/lib/altegio/client'

// Cache services for 5 minutes
let cachedServices: { data: unknown; timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000

export async function GET() {
  try {
    const now = Date.now()
    if (cachedServices && now - cachedServices.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedServices.data)
    }

    const servicesRes = await altegioClient.getServices()

    if (!servicesRes.success) {
      return NextResponse.json(
        { error: 'Failed to fetch services from Altegio' },
        { status: 502 }
      )
    }

    // Derive categories from services' category_id fields
    const categoryIds = [...new Set(servicesRes.data.map(s => s.category_id))]
    const categories = categoryIds.map(catId => ({
      id: catId,
      services: servicesRes.data.filter(s => s.category_id === catId),
    }))

    const result = {
      services: servicesRes.data,
      categories,
    }

    cachedServices = { data: result, timestamp: now }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[Altegio Services]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
