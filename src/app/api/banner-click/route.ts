import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * POST /api/banner-click?id=123
 * Increments click count for a banner (simple analytics).
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const bannerId = searchParams.get('id')

  if (!bannerId) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })
    const banner = await payload.findByID({
      collection: 'banners',
      id: bannerId,
    })

    if (banner) {
      await payload.update({
        collection: 'banners',
        id: bannerId,
        data: {
          clickCount: ((banner.clickCount as number) ?? 0) + 1,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false })
  }
}
