import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const code = (body.code ?? '').trim().toUpperCase()

    if (!code) {
      return NextResponse.json({ valid: false, error: 'empty' })
    }

    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'promo-codes',
      where: {
        code: { equals: code },
        isActive: { equals: true },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return NextResponse.json({ valid: false, error: 'invalid' })
    }

    const promo = result.docs[0] as Record<string, unknown>

    // Check date range
    const now = new Date()
    if (promo.startDate && new Date(promo.startDate as string) > now) {
      return NextResponse.json({ valid: false, error: 'invalid' })
    }
    if (promo.endDate && new Date(promo.endDate as string) < now) {
      return NextResponse.json({ valid: false, error: 'expired' })
    }

    // Check max uses (0 = unlimited)
    const maxUses = (promo.maxUses as number) ?? 0
    const usedCount = (promo.usedCount as number) ?? 0
    if (maxUses > 0 && usedCount >= maxUses) {
      return NextResponse.json({ valid: false, error: 'used_up' })
    }

    return NextResponse.json({
      valid: true,
      discountType: promo.discountType as string,
      discountValue: promo.discountValue as number,
      promoId: String(promo.id),
    })
  } catch {
    return NextResponse.json({ valid: false, error: 'server_error' }, { status: 500 })
  }
}
