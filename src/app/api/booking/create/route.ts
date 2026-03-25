import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'
import { altegioClient } from '@/lib/altegio/client'

const BookingSchema = z.object({
  vehicleCategoryId: z.number().optional(),
  serviceId: z.number(),
  addonIds: z.array(z.number()).optional().default([]),
  firstName: z.string().min(1),
  lastName: z.string().optional().default(''),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(5),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{1,2}:\d{2}$/),
  note: z.string().optional(),
  totalPrice: z.number().optional(),
  promoCode: z.string().optional(),
  promoDiscountType: z.enum(['percentage', 'fixed']).optional(),
  promoDiscountValue: z.number().optional(),
  promotionDiscount: z.number().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = BookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Reject past dates (compare in Europe/Prague timezone)
    const now = new Date()
    const pragueDate = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Prague' }))
    const todayStr = pragueDate.toISOString().split('T')[0]
    if (data.date < todayStr) {
      return NextResponse.json(
        { error: 'Cannot book a past date' },
        { status: 400 }
      )
    }

    // Normalize time to HH:MM (Altegio may return "7:00" but we want "07:00")
    const normalizedTime = data.time.replace(/^(\d):/, '0$1:')

    // 1. Create booking in Altegio
    let altegioRecordId: number | undefined

    // Build comment with promo info for Altegio
    const commentParts: string[] = []
    if (data.note) commentParts.push(data.note)
    if (data.promoCode && data.promotionDiscount && data.promotionDiscount > 0) {
      const discountLabel = data.promoDiscountType === 'percentage'
        ? `${data.promoDiscountValue}%`
        : `${data.promoDiscountValue} CZK`
      commentParts.push(`PROMO: ${data.promoCode} (-${discountLabel}, sleva ${data.promotionDiscount} CZK). Cena po slevě: ${data.totalPrice ?? 0} CZK`)
    }
    const altegioComment = commentParts.join(' | ') || undefined

    try {
      // Build service IDs array: main service + addons
      const serviceIds = [
        ...(data.serviceId > 0 ? [data.serviceId] : []),
        ...data.addonIds,
      ]

      // Altegio datetime in ISO 8601 format (Prague timezone UTC+1)
      const altegioDatetime = `${data.date}T${normalizedTime}:00.000+01:00`

      const altegioResponse = await altegioClient.createBooking({
        phone: data.phone,
        fullname: `${data.firstName} ${data.lastName || ''}`.trim(),
        email: data.email || 'noemail@automycka.cz',
        comment: altegioComment,
        notify_by_sms: 1,
        notify_by_email: 1,
        appointments: [{
          id: 1,
          services: serviceIds,
          staff_id: 0,
          datetime: altegioDatetime,
        }],
      })

      if (altegioResponse.success) {
        // Response data is an array: [{ id, record_id, record_hash }]
        const records = altegioResponse.data as unknown as { id: number; record_id: number; record_hash: string }[]
        altegioRecordId = records?.[0]?.record_id
      } else {
        console.error('[Booking] Altegio booking failed:', altegioResponse)
      }
    } catch (altegioError) {
      // Log but don't fail — save to Payload DB regardless
      console.error('[Booking] Altegio error (continuing with local save):', altegioError)
    }

    // 2. Save booking to Payload CMS
    const payload = await getPayload({ config })

    // Resolve Payload service ID from altegioId (skip if addon-only with serviceId=0)
    const serviceDoc = data.serviceId > 0
      ? await payload.find({
          collection: 'services',
          where: { altegioId: { equals: data.serviceId } },
          limit: 1,
        })
      : { docs: [] }

    const vehicleDoc = data.vehicleCategoryId
      ? await payload.find({
          collection: 'vehicle-categories',
          limit: 1,
          where: { id: { equals: data.vehicleCategoryId } },
        })
      : null

    // Resolve addon Payload IDs from altegioIds
    let addonPayloadIds: (string | number)[] = []
    let addonNames: string[] = []
    if (data.addonIds.length > 0) {
      const addonDocs = await payload.find({
        collection: 'services',
        where: { altegioId: { in: data.addonIds } },
        limit: data.addonIds.length,
      })
      addonPayloadIds = addonDocs.docs.map((d) => d.id)
      addonNames = addonDocs.docs.map((d) => d.name).filter(Boolean)
    }

    const clientName = `${data.firstName} ${data.lastName}`.trim()
    const mainServiceName = serviceDoc.docs[0]?.name ?? ''
    const serviceName = [mainServiceName, ...addonNames].filter(Boolean).join(', ')

    const booking = await payload.create({
      collection: 'bookings',
      data: {
        vehicleCategory: vehicleDoc?.docs[0]?.id,
        service: serviceDoc.docs[0]?.id,
        addons: addonPayloadIds.length > 0 ? addonPayloadIds : undefined,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        clientName,
        clientPhone: data.phone,
        serviceName,
        source: 'website',
        date: data.date,
        time: normalizedTime,
        note: data.promoCode
          ? `${data.note || ''} | PROMO: ${data.promoCode} (-${data.promotionDiscount} CZK)`.trim()
          : data.note,
        totalPrice: data.totalPrice,
        status: altegioRecordId ? 'confirmed' : 'new',
        altegioRecordId,
      },
    })

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      altegioRecordId,
      status: altegioRecordId ? 'confirmed' : 'pending_confirmation',
    })
  } catch (error) {
    console.error('[Booking Create]', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
