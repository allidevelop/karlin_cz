import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST || ''
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587')
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''

async function sendNewsletterNotification(subscriberEmail: string, notifyTo: string) {
  if (!SMTP_HOST || !SMTP_USER) {
    console.log('[NEWSLETTER] SMTP not configured, skipping email notification')
    return
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  await transporter.sendMail({
    from: `"Automyčka Karlín" <${SMTP_USER}>`,
    to: notifyTo,
    subject: 'Add to newsletter',
    text: `Nový odběratel newsletteru: ${subscriberEmail}`,
    html: `<h2>Nový odběratel newsletteru</h2><p><strong>E-mail:</strong> <a href="mailto:${subscriberEmail}">${subscriberEmail}</a></p><p><small>Datum: ${new Date().toLocaleString('cs-CZ')}</small></p>`,
  })

  console.log(`[NEWSLETTER] Notification sent to ${notifyTo} for subscriber ${subscriberEmail}`)
}

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

    // Send email notification if enabled in SiteSettings
    try {
      const settings = await payload.findGlobal({ slug: 'site-settings' }) as Record<string, unknown>
      const emailEnabled = settings.newsletterEmailEnabled !== false
      const notifyTo = (settings.notificationEmail as string) || 'info@automycka-karlin.eu'
      if (emailEnabled) {
        sendNewsletterNotification(email, notifyTo).catch((err) => {
          console.error('[NEWSLETTER] Email send error:', err.message)
        })
      }
    } catch (e) {
      console.error('[NEWSLETTER] Settings read error:', e)
    }

    return NextResponse.json({ success: true, message: 'Úspěšně přihlášeno k odběru novinek.' })
  } catch {
    return NextResponse.json(
      { error: 'Došlo k chybě. Zkuste to prosím znovu.' },
      { status: 500 }
    )
  }
}
