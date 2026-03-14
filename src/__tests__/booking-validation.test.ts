/**
 * Booking Zod Validation — unit tests
 *
 * Tests the BookingSchema used by POST /api/booking/create to ensure
 * invalid payloads are rejected before any Altegio / Payload calls.
 */
import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Recreate the same schema used in the API route
// (importing from the route file would pull in Next.js internals)
const BookingSchema = z.object({
  vehicleCategoryId: z.number().optional(),
  serviceId: z.number(),
  addonIds: z.array(z.number()).optional().default([]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{1,2}:\d{2}$/),
  note: z.string().optional(),
  totalPrice: z.number().optional(),
})

/* ── Helpers ── */

const validPayload = {
  serviceId: 100,
  addonIds: [200, 201],
  firstName: 'Jan',
  lastName: 'Novák',
  email: 'jan@test.cz',
  phone: '+420600111222',
  date: '2026-04-01',
  time: '10:30',
  note: 'Test',
  totalPrice: 2970,
}

/* ────────────────────────────────────────────────── */
/* Valid payloads                                      */
/* ────────────────────────────────────────────────── */
describe('Valid booking payloads', () => {
  it('accepts a complete valid payload', () => {
    const result = BookingSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('accepts payload without optional fields', () => {
    const result = BookingSchema.safeParse({
      serviceId: 100,
      firstName: 'Jan',
      lastName: 'Novák',
      email: 'jan@test.cz',
      phone: '+420600111222',
      date: '2026-04-01',
      time: '10:30',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.addonIds).toEqual([]) // default
      expect(result.data.note).toBeUndefined()
      expect(result.data.totalPrice).toBeUndefined()
      expect(result.data.vehicleCategoryId).toBeUndefined()
    }
  })

  it('accepts payload with vehicleCategoryId', () => {
    const result = BookingSchema.safeParse({
      ...validPayload,
      vehicleCategoryId: 1,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.vehicleCategoryId).toBe(1)
    }
  })

  it('accepts empty addons array', () => {
    const result = BookingSchema.safeParse({
      ...validPayload,
      addonIds: [],
    })
    expect(result.success).toBe(true)
  })
})

/* ────────────────────────────────────────────────── */
/* Missing required fields                            */
/* ────────────────────────────────────────────────── */
describe('Missing required fields', () => {
  it('rejects missing serviceId', () => {
    const { serviceId, ...rest } = validPayload
    const result = BookingSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects missing firstName', () => {
    const { firstName, ...rest } = validPayload
    const result = BookingSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects missing lastName', () => {
    const { lastName, ...rest } = validPayload
    const result = BookingSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects missing email', () => {
    const { email, ...rest } = validPayload
    const result = BookingSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects missing phone', () => {
    const { phone, ...rest } = validPayload
    const result = BookingSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects missing date', () => {
    const { date, ...rest } = validPayload
    const result = BookingSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects missing time', () => {
    const { time, ...rest } = validPayload
    const result = BookingSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })
})

/* ────────────────────────────────────────────────── */
/* Invalid field values                               */
/* ────────────────────────────────────────────────── */
describe('Invalid field values', () => {
  it('rejects empty firstName', () => {
    const result = BookingSchema.safeParse({ ...validPayload, firstName: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty lastName', () => {
    const result = BookingSchema.safeParse({ ...validPayload, lastName: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = BookingSchema.safeParse({ ...validPayload, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects too-short phone', () => {
    const result = BookingSchema.safeParse({ ...validPayload, phone: '123' })
    expect(result.success).toBe(false)
  })

  it('rejects string serviceId', () => {
    const result = BookingSchema.safeParse({ ...validPayload, serviceId: 'abc' })
    expect(result.success).toBe(false)
  })

  it('rejects string in addonIds', () => {
    const result = BookingSchema.safeParse({ ...validPayload, addonIds: ['abc'] })
    expect(result.success).toBe(false)
  })
})

/* ────────────────────────────────────────────────── */
/* Date format validation                             */
/* ────────────────────────────────────────────────── */
describe('Date format', () => {
  it('rejects DD.MM.YYYY format', () => {
    const result = BookingSchema.safeParse({ ...validPayload, date: '01.04.2026' })
    expect(result.success).toBe(false)
  })

  it('rejects DD/MM/YYYY format', () => {
    const result = BookingSchema.safeParse({ ...validPayload, date: '01/04/2026' })
    expect(result.success).toBe(false)
  })

  it('rejects ISO datetime (not just date)', () => {
    const result = BookingSchema.safeParse({ ...validPayload, date: '2026-04-01T10:30:00Z' })
    expect(result.success).toBe(false)
  })

  it('rejects date with single-digit month', () => {
    const result = BookingSchema.safeParse({ ...validPayload, date: '2026-4-01' })
    expect(result.success).toBe(false)
  })

  it('accepts valid YYYY-MM-DD', () => {
    const result = BookingSchema.safeParse({ ...validPayload, date: '2026-12-31' })
    expect(result.success).toBe(true)
  })
})

/* ────────────────────────────────────────────────── */
/* Time format validation                             */
/* ────────────────────────────────────────────────── */
describe('Time format', () => {
  it('accepts H:MM format (Altegio returns single-digit hours)', () => {
    const result = BookingSchema.safeParse({ ...validPayload, time: '9:30' })
    expect(result.success).toBe(true)
  })

  it('rejects HH:MM:SS format', () => {
    const result = BookingSchema.safeParse({ ...validPayload, time: '10:30:00' })
    expect(result.success).toBe(false)
  })

  it('accepts valid HH:MM', () => {
    const result = BookingSchema.safeParse({ ...validPayload, time: '09:00' })
    expect(result.success).toBe(true)
  })

  it('accepts evening time', () => {
    const result = BookingSchema.safeParse({ ...validPayload, time: '19:30' })
    expect(result.success).toBe(true)
  })
})
