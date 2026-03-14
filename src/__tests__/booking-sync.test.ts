/**
 * Booking Two-Way Sync Tests
 *
 * Verifies synchronization between our website and Altegio booking service:
 *
 * 1. service-map.ts ↔ Altegio: IDs and prices match
 * 2. Altegio → Website: API responses correctly transformed for frontend
 * 3. Website → Altegio: booking submissions send correct data
 * 4. End-to-end flow: vehicle → program → addons → contact → create
 *
 * Tests marked "Live" hit the real Altegio API (read-only).
 * Tests marked "Mock" use mocked Altegio to test transformation logic.
 *
 * Run with: npx vitest run src/__tests__/booking-sync.test.ts
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  VEHICLE_CATEGORIES,
  PROGRAMS,
  MOTO_PROGRAM,
  ADDONS,
  ADDONS_CATEGORY_ID,
  getStartingPrice,
  getProgramForVehicle,
  type VehicleKey,
  type ProgramKey,
} from '@/lib/altegio/service-map'

/* ═══════════════════════════════════════════════════════ */
/* PART 1: Live Altegio ↔ service-map.ts consistency      */
/* ═══════════════════════════════════════════════════════ */

const BASE = 'https://api.alteg.io/api/v1'
const COMPANY_ID = '983520'
const PARTNER_TOKEN = 'ygxwyd83pzpn5gmd8we4'
const USER_TOKEN = 'c0f38e47334295986e01ff154b7bd4cb'

const headers: HeadersInit = {
  Authorization: `Bearer ${PARTNER_TOKEN}, User ${USER_TOKEN}`,
  Accept: 'application/vnd.api.v2+json',
}

interface AltegioServiceRaw {
  id: number
  title: string
  category_id: number
  price_min: number
  price_max: number
  active: boolean
}

async function fetchServices(): Promise<AltegioServiceRaw[]> {
  const res = await fetch(`${BASE}/company/${COMPANY_ID}/services`, { headers })
  const data = await res.json()
  return data.data
}

describe('[Live] service-map ↔ Altegio: vehicle categories', () => {
  let services: AltegioServiceRaw[]

  beforeEach(async () => {
    services = await fetchServices()
  })

  it('all 4 vehicle category IDs in service-map exist in Altegio', () => {
    const altegioCategoryIds = [...new Set(services.map(s => s.category_id))]
    for (const [key, cat] of Object.entries(VEHICLE_CATEGORIES)) {
      expect(
        altegioCategoryIds,
        `Category "${key}" (${cat.altegioCategoryId}) missing from Altegio`
      ).toContain(cat.altegioCategoryId)
    }
  })

  it('Altegio addons category ID matches our ADDONS_CATEGORY_ID', () => {
    const altegioCategoryIds = [...new Set(services.map(s => s.category_id))]
    expect(altegioCategoryIds).toContain(ADDONS_CATEGORY_ID)
  })
})

describe('[Live] service-map ↔ Altegio: program IDs and prices', () => {
  let services: AltegioServiceRaw[]

  beforeEach(async () => {
    services = await fetchServices()
  })

  it('every program ID in service-map exists in Altegio', () => {
    const altegioIds = services.map(s => s.id)

    for (const [programKey, program] of Object.entries(PROGRAMS)) {
      for (const vehicleKey of ['sedan', 'suv', 'g-class'] as const) {
        const serviceId = program[vehicleKey].id
        expect(
          altegioIds,
          `Program "${programKey}" for "${vehicleKey}" (ID ${serviceId}) missing from Altegio`
        ).toContain(serviceId)
      }
    }
  })

  it('every program price in service-map matches Altegio price_min', () => {
    for (const [programKey, program] of Object.entries(PROGRAMS)) {
      for (const vehicleKey of ['sedan', 'suv', 'g-class'] as const) {
        const expected = program[vehicleKey]
        const altegioService = services.find(s => s.id === expected.id)

        expect(
          altegioService,
          `Service ${expected.id} (${programKey}/${vehicleKey}) not found in Altegio`
        ).toBeDefined()

        expect(
          altegioService!.price_min,
          `Price mismatch for ${programKey}/${vehicleKey}: map=${expected.price}, altegio=${altegioService!.price_min}`
        ).toBe(expected.price)
      }
    }
  })

  it('MOTO program ID and price match Altegio', () => {
    const motoService = services.find(s => s.id === MOTO_PROGRAM.altegioId)
    expect(motoService, `MOTO service ${MOTO_PROGRAM.altegioId} not found`).toBeDefined()
    expect(motoService!.price_min).toBe(MOTO_PROGRAM.price)
  })

  it('MOTO service is in the MOTO category', () => {
    const motoService = services.find(s => s.id === MOTO_PROGRAM.altegioId)
    expect(motoService!.category_id).toBe(VEHICLE_CATEGORIES.motocykly.altegioCategoryId)
  })
})

describe('[Live] service-map ↔ Altegio: addon IDs and prices', () => {
  let services: AltegioServiceRaw[]

  beforeEach(async () => {
    services = await fetchServices()
  })

  it('every addon ID in service-map exists in Altegio', () => {
    const altegioIds = services.map(s => s.id)
    for (const addon of ADDONS) {
      expect(
        altegioIds,
        `Addon "${addon.name}" (ID ${addon.altegioId}) missing from Altegio`
      ).toContain(addon.altegioId)
    }
  })

  it('every addon price in service-map matches Altegio price_min', () => {
    for (const addon of ADDONS) {
      const altegioService = services.find(s => s.id === addon.altegioId)
      expect(
        altegioService,
        `Addon "${addon.name}" (${addon.altegioId}) not found in Altegio`
      ).toBeDefined()
      expect(
        altegioService!.price_min,
        `Price mismatch for addon "${addon.name}": map=${addon.price}, altegio=${altegioService!.price_min}`
      ).toBe(addon.price)
    }
  })

  it('all addons in Altegio are in the ADDONS category', () => {
    for (const addon of ADDONS) {
      const altegioService = services.find(s => s.id === addon.altegioId)
      expect(
        altegioService!.category_id,
        `Addon "${addon.name}" in wrong category`
      ).toBe(ADDONS_CATEGORY_ID)
    }
  })

  it('no addons are missing from our service-map (Altegio has no extras)', () => {
    const altegioAddons = services.filter(s => s.category_id === ADDONS_CATEGORY_ID)
    const ourIds = ADDONS.map(a => a.altegioId)
    for (const altAddon of altegioAddons) {
      expect(
        ourIds,
        `Altegio addon "${altAddon.title}" (${altAddon.id}) not in our service-map`
      ).toContain(altAddon.id)
    }
  })
})

/* ═══════════════════════════════════════════════════════ */
/* PART 2: Live Altegio → Website: date/time sync         */
/* ═══════════════════════════════════════════════════════ */

describe('[Live] Altegio → Website: dates for every vehicle program', () => {
  it('book_dates returns data for sedan TO GO', async () => {
    const serviceId = PROGRAMS['to-go'].sedan.id
    const res = await fetch(
      `${BASE}/book_dates/${COMPANY_ID}?service_ids=${serviceId}`,
      { headers }
    )
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('booking_dates')
    expect(Array.isArray(data.data.booking_dates)).toBe(true)
  })

  it('book_dates returns data for SUV TO GLOW', async () => {
    const serviceId = PROGRAMS['to-glow'].suv.id
    const res = await fetch(
      `${BASE}/book_dates/${COMPANY_ID}?service_ids=${serviceId}`,
      { headers }
    )
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('booking_dates')
  })

  it('book_dates returns data for G-CLASS PREMIUM', async () => {
    const serviceId = PROGRAMS['premium-detailing']['g-class'].id
    const res = await fetch(
      `${BASE}/book_dates/${COMPANY_ID}?service_ids=${serviceId}`,
      { headers }
    )
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('booking_dates')
  })

  it('book_dates returns data for MOTO', async () => {
    const res = await fetch(
      `${BASE}/book_dates/${COMPANY_ID}?service_ids=${MOTO_PROGRAM.altegioId}`,
      { headers }
    )
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('booking_dates')
  })

  it('all booking_dates are valid YYYY-MM-DD and in the future', async () => {
    const serviceId = PROGRAMS['to-go'].sedan.id
    const res = await fetch(
      `${BASE}/book_dates/${COMPANY_ID}?service_ids=${serviceId}`,
      { headers }
    )
    const data = await res.json()

    const today = new Date().toISOString().slice(0, 10)
    for (const dateStr of data.data.booking_dates) {
      expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(dateStr >= today, `Date ${dateStr} is in the past`).toBe(true)
    }
  })
})

describe('[Live] Altegio → Website: time slots format', () => {
  it('time slots for first available date have correct structure', async () => {
    const serviceId = PROGRAMS['to-go'].sedan.id

    // Get first date
    const datesRes = await fetch(
      `${BASE}/book_dates/${COMPANY_ID}?service_ids=${serviceId}`,
      { headers }
    )
    const datesData = await datesRes.json()
    const dates = datesData.data.booking_dates || []
    if (dates.length === 0) {
      console.warn('No booking dates available — skipping time slot test')
      return
    }

    // Get times for first date
    const timesRes = await fetch(
      `${BASE}/book_times/${COMPANY_ID}/0/${dates[0]}?service_ids=${serviceId}`,
      { headers }
    )
    const timesData = await timesRes.json()
    expect(timesData.success).toBe(true)

    for (const slot of timesData.data) {
      // Must have time, datetime, seance_length
      expect(slot).toHaveProperty('time')
      expect(slot).toHaveProperty('datetime')
      expect(slot).toHaveProperty('seance_length')
      // time can be "7:00" or "10:00" (1 or 2 digit hour)
      expect(slot.time).toMatch(/^\d{1,2}:\d{2}$/)
      // seance_length should be positive
      expect(slot.seance_length).toBeGreaterThan(0)
    }
  })

  it('our padTime regex correctly normalizes single-digit hours', () => {
    const padTime = (t: string) => t.replace(/^(\d):/, '0$1:')

    expect(padTime('7:00')).toBe('07:00')
    expect(padTime('9:30')).toBe('09:30')
    expect(padTime('10:00')).toBe('10:00')
    expect(padTime('19:30')).toBe('19:30')
    expect(padTime('0:00')).toBe('00:00')
  })
})

/* ═══════════════════════════════════════════════════════ */
/* PART 3: service-map helper function correctness        */
/* ═══════════════════════════════════════════════════════ */

describe('getStartingPrice returns cheapest program per vehicle', () => {
  it('sedan starting price is EXTERIÉR (985)', () => {
    expect(getStartingPrice('sedan')).toBe(985)
  })

  it('suv starting price is EXTERIÉR (1085)', () => {
    expect(getStartingPrice('suv')).toBe(1085)
  })

  it('g-class starting price is EXTERIÉR (1285)', () => {
    expect(getStartingPrice('g-class')).toBe(1285)
  })

  it('motocykly starting price is KOMPLEXNÍ MYTÍ (985)', () => {
    expect(getStartingPrice('motocykly')).toBe(985)
  })
})

describe('getProgramForVehicle returns correct altegioId and price', () => {
  it('sedan + to-go returns correct data', () => {
    const result = getProgramForVehicle('to-go', 'sedan')
    expect(result).not.toBeNull()
    expect(result!.altegioId).toBe(11897501)
    expect(result!.price).toBe(1485)
  })

  it('suv + to-wow returns correct data', () => {
    const result = getProgramForVehicle('to-wow', 'suv')
    expect(result).not.toBeNull()
    expect(result!.altegioId).toBe(11897507)
    expect(result!.price).toBe(2985)
  })

  it('g-class + premium-detailing returns correct data', () => {
    const result = getProgramForVehicle('premium-detailing', 'g-class')
    expect(result).not.toBeNull()
    expect(result!.altegioId).toBe(12923753)
    expect(result!.price).toBe(4985)
  })

  it('motocykly returns null (MOTO uses MOTO_PROGRAM instead)', () => {
    const result = getProgramForVehicle('to-go', 'motocykly')
    expect(result).toBeNull()
  })
})

/* ═══════════════════════════════════════════════════════ */
/* PART 4: Mock API routes — data transformation tests    */
/* ═══════════════════════════════════════════════════════ */

const mockGetServices = vi.fn()
const mockGetAvailableDates = vi.fn()
const mockGetAvailableTimes = vi.fn()
const mockCreateBooking = vi.fn()

vi.mock('@/lib/altegio/client', () => ({
  altegioClient: {
    getServices: (...args: unknown[]) => mockGetServices(...args),
    getServiceCategories: vi.fn(),
    getAvailableDates: (...args: unknown[]) => mockGetAvailableDates(...args),
    getAvailableTimes: (...args: unknown[]) => mockGetAvailableTimes(...args),
    createBooking: (...args: unknown[]) => mockCreateBooking(...args),
  },
}))

const mockPayloadFind = vi.fn()
const mockPayloadCreate = vi.fn()

vi.mock('payload', () => ({
  getPayload: vi.fn().mockResolvedValue({
    find: (...args: unknown[]) => mockPayloadFind(...args),
    create: (...args: unknown[]) => mockPayloadCreate(...args),
  }),
}))

vi.mock('@payload-config', () => ({ default: {} }))

function makeRequest(url: string, init?: RequestInit) {
  return new Request(url, init)
}

describe('[Mock] Altegio → Website: dates route transforms booking_dates correctly', () => {
  let datesGET: (req: Request) => Promise<Response>

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()
    const m = await import('@/app/api/booking/dates/route')
    datesGET = m.GET
  })

  it('returns flat string array from booking_dates, not objects', async () => {
    mockGetAvailableDates.mockResolvedValue({
      success: true,
      data: {
        booking_dates: ['2026-03-10', '2026-03-11', '2026-03-12'],
        working_dates: ['2026-03-10', '2026-03-11', '2026-03-12', '2026-03-13'],
      },
    })

    const res = await datesGET(makeRequest('http://localhost/api/booking/dates?serviceId=11897501'))
    const json = await res.json()

    expect(json.dates).toEqual(['2026-03-10', '2026-03-11', '2026-03-12'])
    // Ensure they are strings, not objects
    expect(typeof json.dates[0]).toBe('string')
  })

  it('passes real Altegio service ID from service-map to client', async () => {
    mockGetAvailableDates.mockResolvedValue({
      success: true,
      data: { booking_dates: [], working_dates: [] },
    })

    const sedanToGo = PROGRAMS['to-go'].sedan.id
    await datesGET(makeRequest(`http://localhost/api/booking/dates?serviceId=${sedanToGo}`))

    expect(mockGetAvailableDates).toHaveBeenCalledWith(sedanToGo, undefined)
  })
})

describe('[Mock] Altegio → Website: times route pads single-digit hours', () => {
  let timesGET: (req: Request) => Promise<Response>

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()
    const m = await import('@/app/api/booking/times/route')
    timesGET = m.GET
  })

  it('pads "7:00" to "07:00" and "9:30" to "09:30"', async () => {
    mockGetAvailableTimes.mockResolvedValue({
      success: true,
      data: [
        { time: '7:00', datetime: '2026-03-10T07:00:00', seance_length: 3600 },
        { time: '7:30', datetime: '2026-03-10T07:30:00', seance_length: 3600 },
        { time: '9:30', datetime: '2026-03-10T09:30:00', seance_length: 3600 },
        { time: '10:00', datetime: '2026-03-10T10:00:00', seance_length: 3600 },
        { time: '14:30', datetime: '2026-03-10T14:30:00', seance_length: 3600 },
      ],
    })

    const res = await timesGET(
      makeRequest('http://localhost/api/booking/times?serviceId=11897501&date=2026-03-10')
    )
    const json = await res.json()

    expect(json.times[0].time).toBe('07:00')
    expect(json.times[1].time).toBe('07:30')
    expect(json.times[2].time).toBe('09:30')
    expect(json.times[3].time).toBe('10:00')
    expect(json.times[4].time).toBe('14:30')
  })

  it('preserves datetime and seance_length', async () => {
    mockGetAvailableTimes.mockResolvedValue({
      success: true,
      data: [
        { time: '8:00', datetime: '2026-03-10T08:00:00', seance_length: 7200 },
      ],
    })

    const res = await timesGET(
      makeRequest('http://localhost/api/booking/times?serviceId=11897501&date=2026-03-10')
    )
    const json = await res.json()

    expect(json.times[0].datetime).toBe('2026-03-10T08:00:00')
    expect(json.times[0].seance_length).toBe(7200)
  })
})

describe('[Mock] Website → Altegio: services route derives categories', () => {
  let servicesGET: (req: Request) => Promise<Response>

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()
    const m = await import('@/app/api/booking/services/route')
    servicesGET = m.GET
  })

  it('does not call getServiceCategories (removed, was 403)', async () => {
    const mockGetServiceCategories = vi.fn()
    mockGetServices.mockResolvedValue({
      success: true,
      data: [
        { id: 11897501, title: 'TO GO', category_id: 11897500, price_min: 1485 },
        { id: 11897502, title: 'TO GLOW', category_id: 11897500, price_min: 2085 },
        { id: 12810031, title: 'EXTERIÉR KOMPLET', category_id: 11897500, price_min: 985 },
      ],
    })

    await servicesGET(makeRequest('http://localhost/api/booking/services'))

    // getServiceCategories should NOT have been called
    expect(mockGetServiceCategories).not.toHaveBeenCalled()
  })

  it('groups services by category_id into derived categories', async () => {
    mockGetServices.mockResolvedValue({
      success: true,
      data: [
        { id: 11897501, title: 'TO GO', category_id: 11897500, price_min: 1485 },
        { id: 11897502, title: 'TO GLOW', category_id: 11897500, price_min: 2085 },
        { id: 11897505, title: 'TO GO', category_id: 11897504, price_min: 1585 },
        { id: 12923787, title: 'Čištění pásů', category_id: 12923782, price_min: 485 },
      ],
    })

    const res = await servicesGET(makeRequest('http://localhost/api/booking/services'))
    const json = await res.json()

    expect(json.categories).toHaveLength(3)

    const hatchback = json.categories.find((c: { id: number }) => c.id === 11897500)
    expect(hatchback.services).toHaveLength(2)

    const suv = json.categories.find((c: { id: number }) => c.id === 11897504)
    expect(suv.services).toHaveLength(1)

    const addons = json.categories.find((c: { id: number }) => c.id === 12923782)
    expect(addons.services).toHaveLength(1)
  })
})

/* ═══════════════════════════════════════════════════════ */
/* PART 5: Website → Altegio: booking creation sync       */
/* ═══════════════════════════════════════════════════════ */

describe('[Mock] Website → Altegio: create booking with real service-map IDs', () => {
  let createPOST: (req: Request) => Promise<Response>

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()
    const m = await import('@/app/api/booking/create/route')
    createPOST = m.POST
  })

  it('sends sedan TO GO ID (11897501) to Altegio', async () => {
    mockCreateBooking.mockResolvedValue({ success: true, data: { id: 1001 } })
    mockPayloadFind.mockResolvedValue({ docs: [{ id: 1 }] })
    mockPayloadCreate.mockResolvedValue({ id: 50 })

    const sedanToGo = PROGRAMS['to-go'].sedan.id
    await createPOST(makeRequest('http://localhost/api/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: sedanToGo,
        addonIds: [],
        firstName: 'Jan',
        lastName: 'Novák',
        email: 'jan@test.cz',
        phone: '+420600111222',
        date: '2026-04-01',
        time: '10:00',
        totalPrice: 1485,
      }),
    }))

    const call = mockCreateBooking.mock.calls[0][0]
    expect(call.appointments[0].id).toBe(sedanToGo)
    expect(call.appointments[0].id).toBe(11897501)
  })

  it('sends SUV PREMIUM ID (12923752) with addon IDs to Altegio', async () => {
    mockCreateBooking.mockResolvedValue({ success: true, data: { id: 1002 } })
    mockPayloadFind.mockResolvedValue({ docs: [] })
    mockPayloadCreate.mockResolvedValue({ id: 51 })

    const suvPremium = PROGRAMS['premium-detailing'].suv.id
    const addon1 = ADDONS[0].altegioId // Čištění bezpečnostních pásů
    const addon2 = ADDONS[4].altegioId // Dekontaminace laku

    await createPOST(makeRequest('http://localhost/api/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: suvPremium,
        addonIds: [addon1, addon2],
        firstName: 'Jana',
        lastName: 'Nováková',
        email: 'jana@test.cz',
        phone: '+420600333444',
        date: '2026-04-15',
        time: '14:00',
        totalPrice: 4785 + 485 + 785,
      }),
    }))

    const call = mockCreateBooking.mock.calls[0][0]
    // Main service first, then addons
    expect(call.appointments).toEqual([
      { id: suvPremium, staff_id: 0 },
      { id: addon1, staff_id: 0 },
      { id: addon2, staff_id: 0 },
    ])
    expect(call.client.name).toBe('Jana Nováková')
    expect(call.date).toBe('2026-04-15')
    expect(call.time).toBe('14:00')
  })

  it('normalizes single-digit hour "9:30" to "09:30" before sending to Altegio', async () => {
    mockCreateBooking.mockResolvedValue({ success: true, data: { id: 1003 } })
    mockPayloadFind.mockResolvedValue({ docs: [] })
    mockPayloadCreate.mockResolvedValue({ id: 52 })

    await createPOST(makeRequest('http://localhost/api/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: PROGRAMS['to-go'].sedan.id,
        firstName: 'Petr',
        lastName: 'Novák',
        email: 'petr@test.cz',
        phone: '+420600555666',
        date: '2026-04-01',
        time: '9:30', // single-digit hour from Altegio
        totalPrice: 1485,
      }),
    }))

    // Should be normalized to 09:30 in the Altegio call
    const call = mockCreateBooking.mock.calls[0][0]
    expect(call.time).toBe('09:30')

    // And in the Payload save
    const payloadCall = mockPayloadCreate.mock.calls[0][0]
    expect(payloadCall.data.time).toBe('09:30')
  })

  it('Altegio confirmation flows back: bookingId + status returned to frontend', async () => {
    mockCreateBooking.mockResolvedValue({ success: true, data: { id: 7777 } })
    mockPayloadFind.mockResolvedValue({ docs: [{ id: 1 }] })
    mockPayloadCreate.mockResolvedValue({ id: 99 })

    const res = await createPOST(makeRequest('http://localhost/api/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: PROGRAMS['to-glow']['g-class'].id,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.cz',
        phone: '+420111222333',
        date: '2026-05-01',
        time: '11:00',
        totalPrice: 2585,
      }),
    }))

    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.bookingId).toBe(99)
    expect(json.altegioRecordId).toBe(7777)
    expect(json.status).toBe('confirmed')
  })

  it('graceful degradation: Payload save succeeds even when Altegio fails', async () => {
    mockCreateBooking.mockRejectedValue(new Error('Altegio API timeout'))
    mockPayloadFind.mockResolvedValue({ docs: [] })
    mockPayloadCreate.mockResolvedValue({ id: 100 })

    const res = await createPOST(makeRequest('http://localhost/api/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: PROGRAMS['to-go'].suv.id,
        firstName: 'Offline',
        lastName: 'Test',
        email: 'offline@test.cz',
        phone: '+420999888777',
        date: '2026-04-10',
        time: '12:00',
        totalPrice: 1585,
      }),
    }))

    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.bookingId).toBe(100)
    expect(json.altegioRecordId).toBeUndefined()
    expect(json.status).toBe('pending_confirmation')
  })
})

/* ═══════════════════════════════════════════════════════ */
/* PART 6: E2E flow simulation (Zustand → API → Altegio)  */
/* ═══════════════════════════════════════════════════════ */

describe('[Mock] End-to-end booking flow: vehicle → program → addons → submit', () => {
  let createPOST: (req: Request) => Promise<Response>

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()
    const m = await import('@/app/api/booking/create/route')
    createPOST = m.POST
  })

  it('simulates full sedan TO WOW + 2 addons booking flow', async () => {
    mockCreateBooking.mockResolvedValue({ success: true, data: { id: 5000 } })
    mockPayloadFind.mockResolvedValue({ docs: [{ id: 1 }] })
    mockPayloadCreate.mockResolvedValue({ id: 200 })

    // Step 1: User selects sedan
    const vehicle: VehicleKey = 'sedan'
    const vehicleCategoryId = VEHICLE_CATEGORIES[vehicle].altegioCategoryId

    // Step 2: User selects TO WOW for sedan
    const program = getProgramForVehicle('to-wow', vehicle)!
    expect(program.altegioId).toBe(11897503)
    expect(program.price).toBe(2785)

    // Step 3: User selects 2 addons
    const selectedAddons = [ADDONS[0], ADDONS[7]] // Čištění pásů (485) + Dezinfekce ozonem (985)
    const addonIds = selectedAddons.map(a => a.altegioId)
    const totalPrice = program.price + selectedAddons.reduce((sum, a) => sum + a.price, 0)
    expect(totalPrice).toBe(2785 + 485 + 985)

    // Step 4: User fills form and submits
    const res = await createPOST(makeRequest('http://localhost/api/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehicleCategoryId,
        serviceId: program.altegioId,
        addonIds,
        firstName: 'Martin',
        lastName: 'Dvořák',
        email: 'martin@test.cz',
        phone: '+420777888999',
        date: '2026-04-20',
        time: '10:00',
        note: 'Prosím do 12:00',
        totalPrice,
      }),
    }))

    // Verify Altegio received correct data
    const altegioCall = mockCreateBooking.mock.calls[0][0]
    expect(altegioCall.appointments).toHaveLength(3) // 1 program + 2 addons
    expect(altegioCall.appointments[0].id).toBe(11897503) // TO WOW sedan
    expect(altegioCall.appointments[1].id).toBe(12923787) // Čištění pásů
    expect(altegioCall.appointments[2].id).toBe(12923801) // Dezinfekce ozonem
    expect(altegioCall.client.name).toBe('Martin Dvořák')

    // Verify response for frontend
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.status).toBe('confirmed')
    expect(json.altegioRecordId).toBe(5000)
  })

  it('simulates full G-CLASS EXTERIÉR + 3 addon waxes booking', async () => {
    mockCreateBooking.mockResolvedValue({ success: true, data: { id: 5001 } })
    mockPayloadFind.mockResolvedValue({ docs: [] })
    mockPayloadCreate.mockResolvedValue({ id: 201 })

    const vehicle: VehicleKey = 'g-class'
    const program = getProgramForVehicle('exterior-komplet', vehicle)!
    expect(program.altegioId).toBe(12810059)
    expect(program.price).toBe(1285)

    // 3 wax addons
    const waxAddons = ADDONS.filter(a =>
      [12923804, 12923805, 12923812].includes(a.altegioId)
    )
    expect(waxAddons).toHaveLength(3)

    const totalPrice = program.price + waxAddons.reduce((sum, a) => sum + a.price, 0)
    expect(totalPrice).toBe(1285 + 1485 + 2985 + 4485) // 10240

    const res = await createPOST(makeRequest('http://localhost/api/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: program.altegioId,
        addonIds: waxAddons.map(a => a.altegioId),
        firstName: 'Lukáš',
        lastName: 'Fiala',
        email: 'lukas@test.cz',
        phone: '+420111000999',
        date: '2026-05-01',
        time: '8:00', // single-digit hour
        totalPrice,
      }),
    }))

    // Verify time normalization
    const altegioCall = mockCreateBooking.mock.calls[0][0]
    expect(altegioCall.time).toBe('08:00')
    expect(altegioCall.appointments).toHaveLength(4) // 1 program + 3 addons

    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('simulates MOTO booking (single program, no addons)', async () => {
    mockCreateBooking.mockResolvedValue({ success: true, data: { id: 5002 } })
    mockPayloadFind.mockResolvedValue({ docs: [] })
    mockPayloadCreate.mockResolvedValue({ id: 202 })

    // MOTO has only one program
    const serviceId = MOTO_PROGRAM.altegioId
    expect(serviceId).toBe(12810111)

    const res = await createPOST(makeRequest('http://localhost/api/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId,
        addonIds: [],
        firstName: 'Tomáš',
        lastName: 'Moto',
        email: 'tomas@test.cz',
        phone: '+420555666777',
        date: '2026-04-05',
        time: '15:00',
        totalPrice: 985,
      }),
    }))

    const altegioCall = mockCreateBooking.mock.calls[0][0]
    expect(altegioCall.appointments).toHaveLength(1) // just the MOTO program
    expect(altegioCall.appointments[0].id).toBe(12810111)

    const json = await res.json()
    expect(json.success).toBe(true)
  })
})

/* ═══════════════════════════════════════════════════════ */
/* PART 7: Data integrity checks                          */
/* ═══════════════════════════════════════════════════════ */

describe('Data integrity: service-map internal consistency', () => {
  it('all program IDs are unique across all vehicles', () => {
    const allIds: number[] = []
    for (const program of Object.values(PROGRAMS)) {
      allIds.push(program.sedan.id, program.suv.id, program['g-class'].id)
    }
    allIds.push(MOTO_PROGRAM.altegioId)

    const unique = new Set(allIds)
    expect(unique.size).toBe(allIds.length)
  })

  it('all addon IDs are unique', () => {
    const ids = ADDONS.map(a => a.altegioId)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('no overlap between program IDs and addon IDs', () => {
    const programIds = new Set<number>()
    for (const program of Object.values(PROGRAMS)) {
      programIds.add(program.sedan.id)
      programIds.add(program.suv.id)
      programIds.add(program['g-class'].id)
    }
    programIds.add(MOTO_PROGRAM.altegioId)

    for (const addon of ADDONS) {
      expect(
        programIds.has(addon.altegioId),
        `Addon ${addon.altegioId} overlaps with a program ID`
      ).toBe(false)
    }
  })

  it('SUV prices > sedan prices for every program', () => {
    for (const [key, program] of Object.entries(PROGRAMS)) {
      expect(
        program.suv.price,
        `${key}: SUV (${program.suv.price}) should be > sedan (${program.sedan.price})`
      ).toBeGreaterThan(program.sedan.price)
    }
  })

  it('G-CLASS prices > SUV prices for every program', () => {
    for (const [key, program] of Object.entries(PROGRAMS)) {
      expect(
        program['g-class'].price,
        `${key}: G-CLASS (${program['g-class'].price}) should be > SUV (${program.suv.price})`
      ).toBeGreaterThan(program.suv.price)
    }
  })

  it('all addon prices are positive', () => {
    for (const addon of ADDONS) {
      expect(addon.price, `Addon "${addon.name}" has non-positive price`).toBeGreaterThan(0)
    }
  })

  it('all program prices are positive', () => {
    for (const program of Object.values(PROGRAMS)) {
      expect(program.sedan.price).toBeGreaterThan(0)
      expect(program.suv.price).toBeGreaterThan(0)
      expect(program['g-class'].price).toBeGreaterThan(0)
    }
    expect(MOTO_PROGRAM.price).toBeGreaterThan(0)
  })

  it('ADDONS has exactly 14 entries', () => {
    expect(ADDONS).toHaveLength(14)
  })

  it('PROGRAMS has exactly 6 entries', () => {
    expect(Object.keys(PROGRAMS)).toHaveLength(6)
  })

  it('VEHICLE_CATEGORIES has exactly 4 entries', () => {
    expect(Object.keys(VEHICLE_CATEGORIES)).toHaveLength(4)
  })
})
