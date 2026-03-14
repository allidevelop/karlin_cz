import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { altegioClient } from '@/lib/altegio/client'

/**
 * Sync booking records from Altegio into Payload CMS.
 * GET /api/booking/sync-records?days=30&secret=...
 *
 * Requires ALTEGIO_USER_TOKEN with record_form_access permission.
 * Protected by SYNC_SECRET (falls back to PAYLOAD_SECRET).
 */

function authorize(request: NextRequest): boolean {
  const secret = process.env.SYNC_SECRET || process.env.PAYLOAD_SECRET
  if (!secret) return false

  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader === `Bearer ${secret}`) return true

  // Check query param
  const querySecret = request.nextUrl.searchParams.get('secret')
  if (querySecret === secret) return true

  return false
}

/** Map Altegio visit_attendance to Payload status */
function mapStatus(visitAttendance: number, deleted: boolean): string {
  if (deleted) return 'cancelled'
  switch (visitAttendance) {
    case -1: return 'cancelled' // not come / no-show
    case 1: return 'confirmed'
    case 2: return 'completed'  // came
    default: return 'new'       // 0 = waiting
  }
}

/** Map Altegio visit_attendance to altegioVisitStatus */
function mapVisitStatus(visitAttendance: number): string {
  switch (visitAttendance) {
    case -1: return 'no-show'
    case 1: return 'confirmed'
    case 2: return 'came'
    default: return 'waiting'
  }
}

/** Determine booking source from Altegio record */
function mapSource(online: boolean | number): string {
  return online ? 'website' : 'altegio'
}

export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    const days = parseInt(request.nextUrl.searchParams.get('days') || '30', 10)

    // Calculate date range (add 30 days to endDate to include future bookings)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const formatDate = (d: Date) => d.toISOString().split('T')[0]

    const stats = { created: 0, updated: 0, skipped: 0, errors: 0, pages: 0 }
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await altegioClient.getRecords({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        page,
        count: 200,
      })

      if (!response.success) {
        return NextResponse.json(
          {
            error: 'Failed to fetch Altegio records',
            details: 'Ensure ALTEGIO_USER_TOKEN has record_form_access permission. Go to Altegio admin → Settings → Users → edit user → enable "Access to records".',
          },
          { status: 502 }
        )
      }

      const records = response.data
      stats.pages++

      if (!records || records.length === 0) {
        hasMore = false
        break
      }

      for (const record of records) {
        try {
          // Check if record already exists in Payload
          const existing = await payload.find({
            collection: 'bookings',
            where: { altegioRecordId: { equals: record.id } },
            limit: 1,
          })

          const clientName = record.client?.name || 'Neznámý klient'
          const clientPhone = record.client?.phone || ''
          const serviceName = record.services?.map(s => s.title).join(', ') || ''
          const totalPrice = record.services?.reduce((sum, s) => sum + s.cost * s.amount, 0) || 0
          const staffName = record.staff?.name || ''

          // Try to match service by altegioId
          let serviceId: number | undefined
          if (record.services?.[0]) {
            const matched = await payload.find({
              collection: 'services',
              where: { altegioId: { equals: record.services[0].id } },
              limit: 1,
            })
            if (matched.docs.length > 0) {
              serviceId = matched.docs[0].id as number
            }
          }

          // Extract time from datetime
          const time = record.datetime
            ? new Date(record.datetime).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit', hour12: false })
            : ''

          const bookingData: Record<string, unknown> = {
            clientName,
            clientPhone,
            serviceName,
            staffName,
            totalPrice,
            date: record.date,
            time,
            note: record.comment || '',
            status: mapStatus(record.visit_attendance, record.deleted),
            source: mapSource(record.online),
            altegioVisitStatus: mapVisitStatus(record.visit_attendance),
            altegioRecordId: record.id,
            altegioSyncedAt: new Date().toISOString(),
          }

          // Set service relation if matched
          if (serviceId) {
            bookingData.service = serviceId
          }

          // Set client email/phone from Altegio
          if (record.client?.email) {
            bookingData.email = record.client.email
          }
          if (record.client?.phone) {
            bookingData.phone = record.client.phone
          }

          if (existing.docs.length > 0) {
            // Update existing record
            await payload.update({
              collection: 'bookings',
              id: existing.docs[0].id,
              data: bookingData,
            })
            stats.updated++
          } else {
            // Create new record
            await payload.create({
              collection: 'bookings',
              data: bookingData,
            })
            stats.created++
          }
        } catch (err) {
          console.error(`[Sync Records] Error processing record ${record.id}:`, err)
          stats.errors++
        }
      }

      // Check if there are more pages
      if (response.meta?.total_count && page * 200 >= response.meta.total_count) {
        hasMore = false
      } else if (records.length < 200) {
        hasMore = false
      } else {
        page++
      }
    }

    const totalBookings = await payload.find({ collection: 'bookings', limit: 0 })

    return NextResponse.json({
      success: true,
      stats,
      totalBookingsInPayload: totalBookings.totalDocs,
      dateRange: { from: formatDate(startDate), to: formatDate(endDate) },
    })
  } catch (error) {
    console.error('[Sync Records]', error)
    const message = String(error)
    if (message.includes('403') || message.includes('Not enough rights')) {
      return NextResponse.json(
        {
          error: 'Altegio token lacks records access',
          details: 'Ensure ALTEGIO_USER_TOKEN has record_form_access permission. Go to Altegio admin → Settings → Users → edit user → enable "Access to records".',
        },
        { status: 502 }
      )
    }
    return NextResponse.json(
      { error: 'Sync failed', details: message },
      { status: 500 }
    )
  }
}
