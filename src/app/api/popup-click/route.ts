import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * POST /api/popup-click?id=123
 * Increments click count for a popup banner.
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const popupId = searchParams.get('id')

  if (!popupId) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })
    const popup = await payload.findByID({
      collection: 'popup-banners',
      id: popupId,
    })

    if (popup) {
      await payload.update({
        collection: 'popup-banners',
        id: popupId,
        data: {
          clickCount: ((popup.clickCount as number) ?? 0) + 1,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false })
  }
}
