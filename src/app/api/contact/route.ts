import { NextResponse } from 'next/server'

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

    // For now, log the contact form submission
    // In production, this would send an email or create a record
    console.log('[Contact Form]', { name, email, phone, message })

    return NextResponse.json({ success: true, message: 'Zpráva byla úspěšně odeslána.' })
  } catch {
    return NextResponse.json(
      { error: 'Došlo k chybě při odesílání zprávy.' },
      { status: 500 }
    )
  }
}
