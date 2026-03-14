import { NextResponse } from 'next/server'
import { altegioClient } from '@/lib/altegio/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')
    const staffId = searchParams.get('staffId')

    if (!serviceId) {
      return NextResponse.json(
        { error: 'serviceId is required' },
        { status: 400 }
      )
    }

    const response = await altegioClient.getAvailableDates(
      Number(serviceId),
      staffId ? Number(staffId) : undefined
    )

    if (!response.success) {
      return NextResponse.json(
        { error: 'Failed to fetch available dates' },
        { status: 502 }
      )
    }

    // book_dates returns { booking_dates: string[], working_dates: string[] }
    const availableDates = response.data.booking_dates

    return NextResponse.json({ dates: availableDates })
  } catch (error) {
    console.error('[Altegio Dates]', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
