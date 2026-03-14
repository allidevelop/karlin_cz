/**
 * Altegio Live API — read-only integration tests
 *
 * These tests hit the REAL Altegio API for company Automyčka Karlín (983520).
 * They only perform GET requests — nothing is created, modified or deleted.
 *
 * Run with: npx vitest run src/__tests__/altegio-live.test.ts
 */
import { describe, it, expect } from 'vitest'

const BASE = 'https://api.alteg.io/api/v1'
const COMPANY_ID = '983520'
const PARTNER_TOKEN = 'ygxwyd83pzpn5gmd8we4'
const USER_TOKEN = 'c0f38e47334295986e01ff154b7bd4cb'

const headers: HeadersInit = {
  Authorization: `Bearer ${PARTNER_TOKEN}, User ${USER_TOKEN}`,
  Accept: 'application/vnd.api.v2+json',
}

async function get(path: string) {
  const res = await fetch(`${BASE}${path}`, { headers })
  return res.json()
}

/* ── Expected Altegio IDs ── */

const CATEGORY_IDS = {
  HATCHBACK: 11897500,
  SUV: 11897504,
  GCLASS: 11897508,
  MOTO: 12810110,
  ADDONS: 12923782,
}

const HATCHBACK_SERVICES = {
  TO_GO: 11897501,
  TO_GLOW: 11897502,
  TO_WOW: 11897503,
  EXTERIOR: 12810031,
  INTERIOR: 12810032,
  PREMIUM: 12923748,
}

/* ════════════════════════════════════════════════════ */
/* Company                                             */
/* ════════════════════════════════════════════════════ */
describe('Company info', () => {
  it('company 983520 is Automyčka Karlín in Prague', async () => {
    const data = await get(`/company/${COMPANY_ID}`)
    expect(data.success).toBe(true)
    expect(data.data.id).toBe(983520)
    expect(data.data.title).toBe('Automyčka Karlín')
    expect(data.data.city).toBe('Prague')
    expect(data.data.phone).toContain('775')
  })
})

/* ════════════════════════════════════════════════════ */
/* Services                                            */
/* ════════════════════════════════════════════════════ */
describe('Services', () => {
  it('returns all 33 active services', async () => {
    const data = await get(`/company/${COMPANY_ID}/services`)
    expect(data.success).toBe(true)
    expect(data.data.length).toBeGreaterThanOrEqual(33)
  })

  it('has 5 service categories', async () => {
    const data = await get(`/company/${COMPANY_ID}/services`)
    const categoryIds = [...new Set(data.data.map((s: { category_id: number }) => s.category_id))]
    expect(categoryIds).toContain(CATEGORY_IDS.HATCHBACK)
    expect(categoryIds).toContain(CATEGORY_IDS.SUV)
    expect(categoryIds).toContain(CATEGORY_IDS.GCLASS)
    expect(categoryIds).toContain(CATEGORY_IDS.MOTO)
    expect(categoryIds).toContain(CATEGORY_IDS.ADDONS)
  })

  it('HATCHBACK category has 6 programs with correct IDs', async () => {
    const data = await get(`/company/${COMPANY_ID}/services`)
    const hatchback = data.data.filter((s: { category_id: number }) => s.category_id === CATEGORY_IDS.HATCHBACK)
    expect(hatchback.length).toBe(6)

    const ids = hatchback.map((s: { id: number }) => s.id)
    expect(ids).toContain(HATCHBACK_SERVICES.TO_GO)
    expect(ids).toContain(HATCHBACK_SERVICES.TO_GLOW)
    expect(ids).toContain(HATCHBACK_SERVICES.TO_WOW)
    expect(ids).toContain(HATCHBACK_SERVICES.EXTERIOR)
    expect(ids).toContain(HATCHBACK_SERVICES.INTERIOR)
    expect(ids).toContain(HATCHBACK_SERVICES.PREMIUM)
  })

  it('SUV programs are more expensive than HATCHBACK', async () => {
    const data = await get(`/company/${COMPANY_ID}/services`)
    const findService = (id: number) => data.data.find((s: { id: number }) => s.id === id)

    const hatchToGo = findService(HATCHBACK_SERVICES.TO_GO)
    const suvToGo = findService(11897505) // SUV TO GO

    expect(suvToGo.price_min).toBeGreaterThan(hatchToGo.price_min)
  })

  it('HATCHBACK TO GO costs 1485 CZK', async () => {
    const data = await get(`/company/${COMPANY_ID}/services`)
    const toGo = data.data.find((s: { id: number }) => s.id === HATCHBACK_SERVICES.TO_GO)
    expect(toGo.price_min).toBe(1485)
    expect(toGo.title).toBe('TO GO')
  })

  it('DOPLŇKOVÉ SLUŽBY (addons) has 14 services', async () => {
    const data = await get(`/company/${COMPANY_ID}/services`)
    const addons = data.data.filter((s: { category_id: number }) => s.category_id === CATEGORY_IDS.ADDONS)
    expect(addons.length).toBeGreaterThanOrEqual(14)
  })

  it('each program in every vehicle category has same name set', async () => {
    const data = await get(`/company/${COMPANY_ID}/services`)
    const vehicleCats = [CATEGORY_IDS.HATCHBACK, CATEGORY_IDS.SUV, CATEGORY_IDS.GCLASS]

    for (const catId of vehicleCats) {
      const services = data.data.filter((s: { category_id: number }) => s.category_id === catId)
      const titles = services.map((s: { title: string }) => s.title).sort()
      expect(titles).toContain('TO GO')
      expect(titles).toContain('TO GLOW')
      expect(titles).toContain('TO WOW')
      expect(titles).toContain('EXTERIÉR KOMPLET')
      expect(titles).toContain('INTERIÉR KOMPLET')
      expect(titles).toContain('PREMIUM DETAILING KOMPLET')
    }
  })

  it('MOTO category has KOMPLEXNÍ MYTÍ at 985 CZK', async () => {
    const data = await get(`/company/${COMPANY_ID}/services`)
    const moto = data.data.filter((s: { category_id: number }) => s.category_id === CATEGORY_IDS.MOTO)
    expect(moto.length).toBeGreaterThanOrEqual(1)
    expect(moto[0].title).toBe('KOMPLEXNÍ MYTÍ')
    expect(moto[0].price_min).toBe(985)
  })
})

/* ════════════════════════════════════════════════════ */
/* Book dates (read-only)                              */
/* ════════════════════════════════════════════════════ */
describe('Book dates', () => {
  it('returns booking_dates array (not {date, is_available} objects)', async () => {
    const data = await get(`/book_dates/${COMPANY_ID}?service_ids=${HATCHBACK_SERVICES.TO_GO}`)
    expect(data.success).toBe(true)

    // Real API returns { booking_dates: string[], working_dates: string[] }
    // NOT the { date, is_available }[] format our types.ts assumes
    expect(data.data).toHaveProperty('booking_dates')
    expect(data.data).toHaveProperty('working_dates')
    expect(Array.isArray(data.data.booking_dates)).toBe(true)

    // Each date should be YYYY-MM-DD format
    if (data.data.booking_dates.length > 0) {
      expect(data.data.booking_dates[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('returns working_dates for the next months', async () => {
    const data = await get(`/book_dates/${COMPANY_ID}?service_ids=${HATCHBACK_SERVICES.TO_GO}`)
    expect(data.data.working_dates.length).toBeGreaterThan(0)
  })
})

/* ════════════════════════════════════════════════════ */
/* Book times (read-only)                              */
/* ════════════════════════════════════════════════════ */
describe('Book times', () => {
  it('returns time slots with correct format', async () => {
    // Get first available date
    const datesData = await get(`/book_dates/${COMPANY_ID}?service_ids=${HATCHBACK_SERVICES.TO_GO}`)
    const dates = datesData.data.booking_dates || []

    if (dates.length === 0) {
      // No dates available — skip
      console.warn('No booking dates available, skipping time slot test')
      return
    }

    const firstDate = dates[0]
    const timesData = await get(`/book_times/${COMPANY_ID}/0/${firstDate}?service_ids=${HATCHBACK_SERVICES.TO_GO}`)

    expect(timesData.success).toBe(true)
    expect(Array.isArray(timesData.data)).toBe(true)

    if (timesData.data.length > 0) {
      const slot = timesData.data[0]
      expect(slot).toHaveProperty('time')
      expect(slot).toHaveProperty('datetime')
      expect(slot).toHaveProperty('seance_length')
      // Altegio returns "7:00" not "07:00" — no leading zero!
      // Our BookingSchema requires HH:MM (2 digits) — need to pad when consuming
      expect(slot.time).toMatch(/^\d{1,2}:\d{2}$/)
    }
  })
})

/* ════════════════════════════════════════════════════ */
/* Price consistency checks                            */
/* ════════════════════════════════════════════════════ */
describe('Price consistency', () => {
  it('G-CLASS is the most expensive vehicle category', async () => {
    const data = await get(`/company/${COMPANY_ID}/services`)
    const findPrice = (catId: number, title: string) => {
      const s = data.data.find((s: { category_id: number; title: string }) => s.category_id === catId && s.title === title)
      return s?.price_min ?? 0
    }

    const programs = ['TO GO', 'TO GLOW', 'TO WOW']
    for (const prog of programs) {
      const hatchPrice = findPrice(CATEGORY_IDS.HATCHBACK, prog)
      const suvPrice = findPrice(CATEGORY_IDS.SUV, prog)
      const gclassPrice = findPrice(CATEGORY_IDS.GCLASS, prog)

      expect(suvPrice).toBeGreaterThan(hatchPrice)
      expect(gclassPrice).toBeGreaterThan(suvPrice)
    }
  })

  it('all addon prices are positive', async () => {
    const data = await get(`/company/${COMPANY_ID}/services`)
    const addons = data.data.filter((s: { category_id: number }) => s.category_id === CATEGORY_IDS.ADDONS)

    for (const addon of addons) {
      expect(addon.price_min).toBeGreaterThan(0)
    }
  })
})
