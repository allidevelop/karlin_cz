import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import nodemailer from 'nodemailer'

const NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || 'info@automycka-karlin.eu'
const SMTP_HOST = process.env.SMTP_HOST || ''
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587')
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''

async function sendNotificationEmail(data: { name: string; email: string; phone: string; message: string }, notifyTo?: string) {
  if (!SMTP_HOST || !SMTP_USER) {
    console.log('[CONTACT] SMTP not configured, skipping email notification')
    return
  }

  const recipient = notifyTo || NOTIFY_EMAIL

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  await transporter.sendMail({
    from: `"Automyčka Karlín" <${SMTP_USER}>`,
    to: recipient,
    subject: `Nová zpráva od ${data.name}`,
    text: `Jméno: ${data.name}\nE-mail: ${data.email}\nTelefon: ${data.phone || '—'}\n\nZpráva:\n${data.message}`,
    html: `
      <h2>Nová zpráva z kontaktního formuláře</h2>
      <p><strong>Jméno:</strong> ${data.name}</p>
      <p><strong>E-mail:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      <p><strong>Telefon:</strong> ${data.phone || '—'}</p>
      <hr />
      <p>${data.message.replace(/\n/g, '<br />')}</p>
    `,
  })

  console.log(`[CONTACT] Email notification sent to ${recipient}`)
}

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

    // Send email notification if enabled in SiteSettings (non-blocking)
    try {
      const settings = await payload.findGlobal({ slug: 'site-settings' }) as Record<string, unknown>
      const emailEnabled = settings.contactFormEmailEnabled !== false
      if (emailEnabled) {
        const notifyTo = (settings.notificationEmail as string) || NOTIFY_EMAIL
        sendNotificationEmail({ name, email, phone: phone || '', message }, notifyTo).catch((err) => {
          console.error('[CONTACT] Email send error:', err.message)
        })
      }
    } catch (e) {
      console.error('[CONTACT] Settings read error:', e)
    }

    return NextResponse.json({ success: true, message: 'Zpráva byla úspěšně odeslána.' })
  } catch {
    return NextResponse.json(
      { error: 'Došlo k chybě při odesílání zprávy.' },
      { status: 500 }
    )
  }
}
