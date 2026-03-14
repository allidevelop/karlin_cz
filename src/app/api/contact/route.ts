import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Vyplňte prosím všechna povinná pole.' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'contact-messages',
      data: { name, email, phone: phone || '', message },
    })

    return NextResponse.json({ success: true, message: 'Zpráva byla úspěšně odeslána.' })
  } catch {
    return NextResponse.json(
      { error: 'Došlo k chybě při odesílání zprávy.' },
      { status: 500 }
    )
  }
}
