import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Zadejte prosím platný email.' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Check if already subscribed
    const existing = await payload.find({
      collection: 'newsletter',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({ success: true, message: 'Tento email je již přihlášen k odběru.' })
    }

    // Create subscription
    await payload.create({
      collection: 'newsletter',
      data: {
        email,
        subscribedAt: new Date().toISOString(),
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, message: 'Úspěšně přihlášeno k odběru novinek.' })
  } catch {
    return NextResponse.json(
      { error: 'Došlo k chybě. Zkuste to prosím znovu.' },
      { status: 500 }
    )
  }
}
