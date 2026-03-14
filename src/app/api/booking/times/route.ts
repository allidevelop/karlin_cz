import { NextResponse } from 'next/server'
import { altegioClient } from '@/lib/altegio/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')
    const date = searchParams.get('date')
    const staffId = searchParams.get('staffId')

    if (!serviceId || !date) {
      return NextResponse.json(
        { error: 'serviceId and date are required' },
        { status: 400 }
      )
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'date must be in YYYY-MM-DD format' },
        { status: 400 }
      )
    }

    const response = await altegioClient.getAvailableTimes(
      Number(serviceId),
      date,
      staffId ? Number(staffId) : undefined
    )

    if (!response.success) {
      return NextResponse.json(
        { error: 'Failed to fetch available times' },
        { status: 502 }
      )
    }

    // Altegio returns single-digit hours ("7:00") — normalize to "07:00"
    const normalizedTimes = response.data.map((slot: { time: string; datetime: string; seance_length: number }) => ({
      ...slot,
      time: slot.time.replace(/^(\d):/, '0$1:'),
    }))

    return NextResponse.json({ times: normalizedTimes })
  } catch (error) {
    console.error('[Altegio Times]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
