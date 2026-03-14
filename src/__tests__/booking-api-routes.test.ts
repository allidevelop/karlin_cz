/**
 * Booking API Routes — integration tests with mocked Altegio
 *
 * All Altegio calls are mocked via vi.mock — NOTHING hits the real API.
 * Payload CMS is also mocked so no DB is needed.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

/* ─── Mock Altegio client ─── */

const mockGetServices = vi.fn()
const mockGetServiceCategories = vi.fn()
const mockGetAvailableDates = vi.fn()
const mockGetAvailableTimes = vi.fn()
const mockCreateBooking = vi.fn()

vi.mock('@/lib/altegio/client', () => ({
  altegioClient: {
    getServices: (...args: unknown[]) => mockGetServices(...args),
    getServiceCategories: (...args: unknown[]) => mockGetServiceCategories(...args),
    getAvailableDates: (...args: unknown[]) => mockGetAvailableDates(...args),
    getAvailableTimes: (...args: unknown[]) => mockGetAvailableTimes(...args),
    createBooking: (...args: unknown[]) => mockCreateBooking(...args),
  },
}))

/* ─── Mock Payload CMS ─── */

const mockPayloadFind = vi.fn()
const mockPayloadCreate = vi.fn()

vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    find: (...args: unknown[]) => mockPayloadFind(...args),
    create: (...args: unknown[]) => mockPayloadCreate(...args),
  }),
}))

vi.mock('@payload-config', () => ({ default: {} }))

/* ─── Import route handlers AFTER mocks ─── */

// We need to dynamically import because the modules grab altegioClient at import-time
let servicesGET: (req: Request) => Promise<Response>
let datesGET: (req: Request) => Promise<Response>
let timesGET: (req: Request) => Promise<Response>
let createPOST: (req: Request) => Promise<Response>

beforeEach(async () => {
  vi.clearAllMocks()
  // Reset module registry so module-level cache (e.g. cachedServices) is cleared
  vi.resetModules()

  // Dynamic imports so mocks are applied and cache is fresh
  const servicesModule = await import('@/app/api/booking/services/route')
  const datesModule = await import('@/app/api/booking/dates/route')
  const timesModule = await import('@/app/api/booking/times/route')
  const createModule = await import('@/app/api/booking/create/route')

  servicesGET = servicesModule.GET
  datesGET = datesModule.GET
  timesGET = timesModule.GET
  createPOST = createModule.POST
})

/* ── Helpers ── */

function makeRequest(url: string, init?: RequestInit) {
  return new Request(url, init)
}

async function parseJSON(response: Response) {
  return response.json()
}

/* ════════════════════════════════════════════════════ */
/* GET /api/booking/services                           */
/* ════════════════════════════════════════════════════ */
describe('GET /api/booking/services', () => {
  it('returns services and derived categories from Altegio', async () => {
    mockGetServices.mockResolvedValue({
      success: true,
      data: [
        { id: 1, title: 'To Go', price_min: 985, active: true, category_id: 10 },
        { id: 2, title: 'To Glow', price_min: 1085, active: true, category_id: 10 },
        { id: 3, title: 'Exterior', price_min: 985, active: true, category_id: 20 },
      ],
    })

    const res = await servicesGET(makeRequest('http://localhost/api/booking/services'))
    expect(res.status).toBe(200)

    const json = await parseJSON(res)
    expect(json.services).toHaveLength(3)
    // Categories derived from services' category_id
    expect(json.categories).toHaveLength(2)
    expect(json.categories[0].id).toBe(10)
    expect(json.categories[0].services).toHaveLength(2)
    expect(json.categories[1].id).toBe(20)
    expect(json.categories[1].services).toHaveLength(1)
    expect(json.services[0].title).toBe('To Go')
  })

  it('returns 502 when Altegio services call fails', async () => {
    mockGetServices.mockResolvedValue({ success: false, data: [] })

    const res = await servicesGET(makeRequest('http://localhost/api/booking/services'))
    expect(res.status).toBe(502)
  })

  it('returns 500 when Altegio throws an exception', async () => {
    mockGetServices.mockRejectedValue(new Error('Network error'))

    const res = await servicesGET(makeRequest('http://localhost/api/booking/services'))
    expect(res.status).toBe(500)
  })
})

/* ════════════════════════════════════════════════════ */
/* GET /api/booking/dates                              */
/* ════════════════════════════════════════════════════ */
describe('GET /api/booking/dates', () => {
  it('returns booking_dates from Altegio response', async () => {
    mockGetAvailableDates.mockResolvedValue({
      success: true,
      data: {
        booking_dates: ['2026-03-10', '2026-03-12', '2026-03-13'],
        working_dates: ['2026-03-10', '2026-03-11', '2026-03-12', '2026-03-13'],
      },
    })

    const res = await datesGET(
      makeRequest('http://localhost/api/booking/dates?serviceId=100')
    )
    expect(res.status).toBe(200)

    const json = await parseJSON(res)
    expect(json.dates).toHaveLength(3)
    expect(json.dates).toEqual(['2026-03-10', '2026-03-12', '2026-03-13'])
  })

  it('passes serviceId and staffId to Altegio client', async () => {
    mockGetAvailableDates.mockResolvedValue({ success: true, data: { booking_dates: [], working_dates: [] } })

    await datesGET(
      makeRequest('http://localhost/api/booking/dates?serviceId=100&staffId=5')
    )

    expect(mockGetAvailableDates).toHaveBeenCalledWith(100, 5)
  })

  it('returns 400 when serviceId is missing', async () => {
    const res = await datesGET(makeRequest('http://localhost/api/booking/dates'))
    expect(res.status).toBe(400)
    const json = await parseJSON(res)
    expect(json.error).toContain('serviceId')
  })

  it('returns 502 when Altegio returns success: false', async () => {
    mockGetAvailableDates.mockResolvedValue({ success: false, data: { booking_dates: [], working_dates: [] } })

    const res = await datesGET(
      makeRequest('http://localhost/api/booking/dates?serviceId=100')
    )
    expect(res.status).toBe(502)
  })
})

/* ════════════════════════════════════════════════════ */
/* GET /api/booking/times                              */
/* ════════════════════════════════════════════════════ */
describe('GET /api/booking/times', () => {
  it('returns time slots from Altegio with padded hours', async () => {
    mockGetAvailableTimes.mockResolvedValue({
      success: true,
      data: [
        { time: '7:00', datetime: '2026-03-10T07:00:00', seance_length: 3600 },
        { time: '9:00', datetime: '2026-03-10T09:00:00', seance_length: 3600 },
        { time: '10:00', datetime: '2026-03-10T10:00:00', seance_length: 3600 },
      ],
    })

    const res = await timesGET(
      makeRequest('http://localhost/api/booking/times?serviceId=100&date=2026-03-10')
    )
    expect(res.status).toBe(200)

    const json = await parseJSON(res)
    expect(json.times).toHaveLength(3)
    // Single-digit hours should be padded
    expect(json.times[0].time).toBe('07:00')
    expect(json.times[1].time).toBe('09:00')
    expect(json.times[2].time).toBe('10:00')
  })

  it('returns 400 when serviceId is missing', async () => {
    const res = await timesGET(
      makeRequest('http://localhost/api/booking/times?date=2026-03-10')
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when date is missing', async () => {
    const res = await timesGET(
      makeRequest('http://localhost/api/booking/times?serviceId=100')
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid date format', async () => {
    const res = await timesGET(
      makeRequest('http://localhost/api/booking/times?serviceId=100&date=10.03.2026')
    )
    expect(res.status).toBe(400)
    const json = await parseJSON(res)
    expect(json.error).toContain('YYYY-MM-DD')
  })

  it('returns 400 for ISO datetime instead of date', async () => {
    const res = await timesGET(
      makeRequest('http://localhost/api/booking/times?serviceId=100&date=2026-03-10T09:00:00')
    )
    expect(res.status).toBe(400)
  })

  it('passes staffId when provided', async () => {
    mockGetAvailableTimes.mockResolvedValue({ success: true, data: [] })

    await timesGET(
      makeRequest('http://localhost/api/booking/times?serviceId=100&date=2026-03-10&staffId=7')
    )

    expect(mockGetAvailableTimes).toHaveBeenCalledWith(100, '2026-03-10', 7)
  })

  it('returns 502 when Altegio fails', async () => {
    mockGetAvailableTimes.mockResolvedValue({ success: false, data: [] })

    const res = await timesGET(
      makeRequest('http://localhost/api/booking/times?serviceId=100&date=2026-03-10')
    )
    expect(res.status).toBe(502)
  })
})

/* ════════════════════════════════════════════════════ */
/* POST /api/booking/create                            */
/* ════════════════════════════════════════════════════ */
describe('POST /api/booking/create', () => {
  const validBody = {
    serviceId: 100,
    addonIds: [200],
    firstName: 'Jan',
    lastName: 'Novák',
    email: 'jan@test.cz',
    phone: '+420600111222',
    date: '2026-04-01',
    time: '10:30',
    note: 'Prosím ráno',
    totalPrice: 2970,
  }

  it('creates booking in Altegio and Payload, returns confirmed', async () => {
    mockCreateBooking.mockResolvedValue({ success: true, data: { id: 555 } })
    mockPayloadFind.mockResolvedValue({ docs: [{ id: 1 }] })
    mockPayloadCreate.mockResolvedValue({ id: 42 })

    const res = await createPOST(
      makeRequest('http://localhost/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validBody),
      })
    )

    expect(res.status).toBe(200)
    const json = await parseJSON(res)
    expect(json.success).toBe(true)
    expect(json.bookingId).toBe(42)
    expect(json.altegioRecordId).toBe(555)
    expect(json.status).toBe('confirmed')
  })

  it('sends correct appointments to Altegio (main service + addons)', async () => {
    mockCreateBooking.mockResolvedValue({ success: true, data: { id: 1 } })
    mockPayloadFind.mockResolvedValue({ docs: [] })
    mockPayloadCreate.mockResolvedValue({ id: 1 })

    await createPOST(
      makeRequest('http://localhost/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validBody),
      })
    )

    const altegioCall = mockCreateBooking.mock.calls[0][0]
    expect(altegioCall.appointments).toEqual([
      { id: 100, staff_id: 0 },
      { id: 200, staff_id: 0 },
    ])
    expect(altegioCall.client.name).toBe('Jan Novák')
    expect(altegioCall.client.phone).toBe('+420600111222')
    expect(altegioCall.date).toBe('2026-04-01')
    expect(altegioCall.time).toBe('10:30')
  })

  it('saves to Payload even when Altegio fails (graceful degradation)', async () => {
    mockCreateBooking.mockRejectedValue(new Error('Altegio down'))
    mockPayloadFind.mockResolvedValue({ docs: [] })
    mockPayloadCreate.mockResolvedValue({ id: 77 })

    const res = await createPOST(
      makeRequest('http://localhost/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validBody),
      })
    )

    expect(res.status).toBe(200)
    const json = await parseJSON(res)
    expect(json.success).toBe(true)
    expect(json.bookingId).toBe(77)
    expect(json.altegioRecordId).toBeUndefined()
    expect(json.status).toBe('pending_confirmation')
  })

  it('saves to Payload when Altegio returns success: false', async () => {
    mockCreateBooking.mockResolvedValue({ success: false, data: null })
    mockPayloadFind.mockResolvedValue({ docs: [] })
    mockPayloadCreate.mockResolvedValue({ id: 88 })

    const res = await createPOST(
      makeRequest('http://localhost/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validBody),
      })
    )

    const json = await parseJSON(res)
    expect(json.success).toBe(true)
    expect(json.altegioRecordId).toBeUndefined()
    expect(json.status).toBe('pending_confirmation')
  })

  it('sets status to "confirmed" in Payload when altegioRecordId exists', async () => {
    mockCreateBooking.mockResolvedValue({ success: true, data: { id: 999 } })
    mockPayloadFind.mockResolvedValue({ docs: [{ id: 5 }] })
    mockPayloadCreate.mockResolvedValue({ id: 50 })

    await createPOST(
      makeRequest('http://localhost/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validBody),
      })
    )

    const createCall = mockPayloadCreate.mock.calls[0][0]
    expect(createCall.data.status).toBe('confirmed')
    expect(createCall.data.altegioRecordId).toBe(999)
  })

  it('sets status to "new" in Payload when Altegio fails', async () => {
    mockCreateBooking.mockRejectedValue(new Error('timeout'))
    mockPayloadFind.mockResolvedValue({ docs: [] })
    mockPayloadCreate.mockResolvedValue({ id: 60 })

    await createPOST(
      makeRequest('http://localhost/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validBody),
      })
    )

    const createCall = mockPayloadCreate.mock.calls[0][0]
    expect(createCall.data.status).toBe('new')
    expect(createCall.data.altegioRecordId).toBeUndefined()
  })

  it('returns 400 for invalid payload (missing required fields)', async () => {
    const res = await createPOST(
      makeRequest('http://localhost/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: 'Jan' }), // missing everything else
      })
    )

    expect(res.status).toBe(400)
    const json = await parseJSON(res)
    expect(json.error).toContain('Invalid')
  })

  it('returns 400 for invalid email', async () => {
    const res = await createPOST(
      makeRequest('http://localhost/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validBody, email: 'not-email' }),
      })
    )

    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid date format', async () => {
    const res = await createPOST(
      makeRequest('http://localhost/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validBody, date: '01.04.2026' }),
      })
    )

    expect(res.status).toBe(400)
  })

  it('accepts H:MM time format (Altegio single-digit hours)', async () => {
    mockCreateBooking.mockResolvedValue({ success: true, data: { id: 400 } })
    mockPayloadFind.mockResolvedValue({ docs: [{ id: 1 }] })
    mockPayloadCreate.mockResolvedValue({ id: 44 })

    const res = await createPOST(
      makeRequest('http://localhost/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validBody, time: '9:30' }),
      })
    )

    expect(res.status).toBe(200)
    // Verify time is normalized to HH:MM when sent to Altegio
    const altegioCall = mockCreateBooking.mock.calls[0][0]
    expect(altegioCall.time).toBe('09:30')
  })

  it('returns 400 for invalid time format (HH:MM:SS)', async () => {
    const res = await createPOST(
      makeRequest('http://localhost/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validBody, time: '10:30:00' }),
      })
    )

    expect(res.status).toBe(400)
  })

  it('returns 500 when Payload CMS throws', async () => {
    mockCreateBooking.mockResolvedValue({ success: true, data: { id: 1 } })
    mockPayloadFind.mockRejectedValue(new Error('DB connection lost'))

    const res = await createPOST(
      makeRequest('http://localhost/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validBody),
      })
    )

    expect(res.status).toBe(500)
  })

  it('handles booking without addons', async () => {
    mockCreateBooking.mockResolvedValue({ success: true, data: { id: 300 } })
    mockPayloadFind.mockResolvedValue({ docs: [{ id: 1 }] })
    mockPayloadCreate.mockResolvedValue({ id: 33 })

    const bodyNoAddons = { ...validBody, addonIds: [] }
    await createPOST(
      makeRequest('http://localhost/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyNoAddons),
      })
    )

    const altegioCall = mockCreateBooking.mock.calls[0][0]
    expect(altegioCall.appointments).toEqual([{ id: 100, staff_id: 0 }])
  })
})
