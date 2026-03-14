import { NextResponse } from 'next/server'
import { altegioClient } from '@/lib/altegio/client'

/**
 * GET /api/booking/verify-prices?ids=123,456,789
 *
 * Fetches current prices from Altegio for given service IDs
 * and returns a map of serviceId -> price.
 * Used by the program selector to verify CMS-cached prices are current.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const idsParam = searchParams.get('ids')

  if (!idsParam) {
    return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 })
  }

  const requestedIds = idsParam.split(',').map(Number).filter(Boolean)

  if (requestedIds.length === 0) {
    return NextResponse.json({ prices: {} })
  }

  try {
    const response = await altegioClient.getServices()
    const services = response.data ?? []

    const priceMap: Record<number, number> = {}
    for (const service of services) {
      if (requestedIds.includes(service.id)) {
        priceMap[service.id] = service.price_min ?? service.price_max ?? 0
      }
    }

    return NextResponse.json({ prices: priceMap })
  } catch (error) {
    console.error('[verify-prices] Failed to fetch from Altegio:', error)
    // Return empty — the frontend will just use CMS prices
    return NextResponse.json({ prices: {} })
  }
}
