/**
 * Zustand Booking Store — unit tests
 *
 * Verifies that multi-step booking state (vehicle → program → addons → contact)
 * is managed correctly and the totalPrice auto-recalculates.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { useBookingStore, type BookingProgram, type BookingAddon } from '@/stores/booking-store'

// Reset store before each test (zustand persist uses localStorage which jsdom provides)
beforeEach(() => {
  useBookingStore.getState().reset()
})

/* ── Helpers ── */

const mockProgram: BookingProgram = {
  id: 'to-go',
  name: 'To Go',
  price: 985,
  altegioId: 100,
}

const mockProgramExpensive: BookingProgram = {
  id: 'premium-detailing',
  name: 'Premium Detailing',
  price: 4500,
  altegioId: 12923748,
}

const mockAddon1: BookingAddon = {
  id: 'impregnace-kuze',
  name: 'Impregnace kůže',
  price: 1285,
  altegioId: 12923789,
}

const mockAddon2: BookingAddon = {
  id: 'cisteni-kobercu',
  name: 'Čištění koberců (extrakce)',
  price: 700,
  altegioId: 12923787,
}

/* ────────────────────────────────────────────────── */
/* Vehicle Category                                   */
/* ────────────────────────────────────────────────── */
describe('Vehicle category', () => {
  it('starts with null vehicle category', () => {
    const state = useBookingStore.getState()
    expect(state.vehicleCategory).toBeNull()
    expect(state.vehicleCategoryName).toBeNull()
  })

  it('sets vehicle category id and name', () => {
    useBookingStore.getState().setVehicleCategory('suv', 'SUV')
    const state = useBookingStore.getState()
    expect(state.vehicleCategory).toBe('suv')
    expect(state.vehicleCategoryName).toBe('SUV')
  })

  it('can overwrite vehicle category', () => {
    const store = useBookingStore.getState()
    store.setVehicleCategory('sedan', 'Sedan')
    store.setVehicleCategory('g-class', 'G-Class')
    const state = useBookingStore.getState()
    expect(state.vehicleCategory).toBe('g-class')
    expect(state.vehicleCategoryName).toBe('G-Class')
  })
})

/* ────────────────────────────────────────────────── */
/* Program selection                                  */
/* ────────────────────────────────────────────────── */
describe('Program selection', () => {
  it('starts with no program and zero total', () => {
    const state = useBookingStore.getState()
    expect(state.selectedProgram).toBeNull()
    expect(state.totalPrice).toBe(0)
  })

  it('sets a program and updates totalPrice', () => {
    useBookingStore.getState().setProgram(mockProgram)
    const state = useBookingStore.getState()
    expect(state.selectedProgram).toEqual(mockProgram)
    expect(state.totalPrice).toBe(985)
  })

  it('replaces program and recalculates total', () => {
    const store = useBookingStore.getState()
    store.setProgram(mockProgram)
    store.setProgram(mockProgramExpensive)
    const state = useBookingStore.getState()
    expect(state.selectedProgram?.id).toBe('premium-detailing')
    expect(state.totalPrice).toBe(4500)
  })

  it('clears program and resets total to addons-only', () => {
    const store = useBookingStore.getState()
    store.setProgram(mockProgram)
    store.toggleAddon(mockAddon1)
    expect(useBookingStore.getState().totalPrice).toBe(985 + 1285)

    store.clearProgram()
    const state = useBookingStore.getState()
    expect(state.selectedProgram).toBeNull()
    expect(state.totalPrice).toBe(1285) // only addon remains
  })
})

/* ────────────────────────────────────────────────── */
/* Addon toggle                                       */
/* ────────────────────────────────────────────────── */
describe('Addon toggle', () => {
  it('starts with empty addons list', () => {
    expect(useBookingStore.getState().addons).toEqual([])
  })

  it('adds an addon on first toggle', () => {
    useBookingStore.getState().toggleAddon(mockAddon1)
    const state = useBookingStore.getState()
    expect(state.addons).toHaveLength(1)
    expect(state.addons[0].id).toBe('impregnace-kuze')
    expect(state.totalPrice).toBe(1285)
  })

  it('removes addon on second toggle (same id)', () => {
    const store = useBookingStore.getState()
    store.toggleAddon(mockAddon1)
    store.toggleAddon(mockAddon1) // remove
    const state = useBookingStore.getState()
    expect(state.addons).toHaveLength(0)
    expect(state.totalPrice).toBe(0)
  })

  it('accumulates multiple addons', () => {
    const store = useBookingStore.getState()
    store.toggleAddon(mockAddon1)
    store.toggleAddon(mockAddon2)
    const state = useBookingStore.getState()
    expect(state.addons).toHaveLength(2)
    expect(state.totalPrice).toBe(1285 + 700)
  })

  it('totalPrice = program + addons', () => {
    const store = useBookingStore.getState()
    store.setProgram(mockProgram) // 985
    store.toggleAddon(mockAddon1) // 1285
    store.toggleAddon(mockAddon2) // 700
    expect(useBookingStore.getState().totalPrice).toBe(985 + 1285 + 700)
  })

  it('removing an addon recalculates total correctly', () => {
    const store = useBookingStore.getState()
    store.setProgram(mockProgram) // 985
    store.toggleAddon(mockAddon1) // +1285
    store.toggleAddon(mockAddon2) // +700
    store.toggleAddon(mockAddon1) // -1285
    expect(useBookingStore.getState().totalPrice).toBe(985 + 700)
    expect(useBookingStore.getState().addons).toHaveLength(1)
  })
})

/* ────────────────────────────────────────────────── */
/* Contact info                                       */
/* ────────────────────────────────────────────────── */
describe('Contact info', () => {
  it('sets partial contact fields', () => {
    useBookingStore.getState().setContactInfo({
      firstName: 'Jan',
      lastName: 'Novák',
      email: 'jan@test.cz',
    })
    const state = useBookingStore.getState()
    expect(state.firstName).toBe('Jan')
    expect(state.lastName).toBe('Novák')
    expect(state.email).toBe('jan@test.cz')
    expect(state.phone).toBe('') // not touched
  })

  it('overwrites only provided fields', () => {
    const store = useBookingStore.getState()
    store.setContactInfo({ firstName: 'Jan', phone: '+420111222333' })
    store.setContactInfo({ firstName: 'Petr' })
    const state = useBookingStore.getState()
    expect(state.firstName).toBe('Petr')
    expect(state.phone).toBe('+420111222333') // still there
  })
})

/* ────────────────────────────────────────────────── */
/* Date & Time                                        */
/* ────────────────────────────────────────────────── */
describe('Date & Time', () => {
  it('starts with null date and time', () => {
    const state = useBookingStore.getState()
    expect(state.selectedDate).toBeNull()
    expect(state.selectedTime).toBeNull()
  })

  it('sets date and time together', () => {
    useBookingStore.getState().setDateTime('2026-03-15', '10:30')
    const state = useBookingStore.getState()
    expect(state.selectedDate).toBe('2026-03-15')
    expect(state.selectedTime).toBe('10:30')
  })
})

/* ────────────────────────────────────────────────── */
/* Promo code                                         */
/* ────────────────────────────────────────────────── */
describe('Promo code', () => {
  it('sets promo code', () => {
    useBookingStore.getState().setPromoCode('SLEVA20')
    expect(useBookingStore.getState().promoCode).toBe('SLEVA20')
  })
})

/* ────────────────────────────────────────────────── */
/* Booking result                                     */
/* ────────────────────────────────────────────────── */
describe('Booking result', () => {
  it('stores booking id and status', () => {
    useBookingStore.getState().setBookingResult(42, 'confirmed')
    const state = useBookingStore.getState()
    expect(state.bookingId).toBe(42)
    expect(state.bookingStatus).toBe('confirmed')
  })
})

/* ────────────────────────────────────────────────── */
/* Full reset                                         */
/* ────────────────────────────────────────────────── */
describe('Reset', () => {
  it('resets all state to initial values', () => {
    const store = useBookingStore.getState()
    store.setVehicleCategory('suv', 'SUV')
    store.setProgram(mockProgram)
    store.toggleAddon(mockAddon1)
    store.setContactInfo({ firstName: 'Jan', email: 'a@b.cz' })
    store.setDateTime('2026-03-15', '10:00')
    store.setPromoCode('VIP')
    store.setBookingResult(99, 'confirmed')

    store.reset()

    const state = useBookingStore.getState()
    expect(state.vehicleCategory).toBeNull()
    expect(state.vehicleCategoryName).toBeNull()
    expect(state.selectedProgram).toBeNull()
    expect(state.addons).toEqual([])
    expect(state.firstName).toBe('')
    expect(state.lastName).toBe('')
    expect(state.email).toBe('')
    expect(state.phone).toBe('')
    expect(state.selectedDate).toBeNull()
    expect(state.selectedTime).toBeNull()
    expect(state.promoCode).toBe('')
    expect(state.bookingId).toBeNull()
    expect(state.bookingStatus).toBeNull()
    expect(state.totalPrice).toBe(0)
  })
})

/* ────────────────────────────────────────────────── */
/* Full booking flow simulation                       */
/* ────────────────────────────────────────────────── */
describe('Full booking flow (end-to-end state)', () => {
  it('simulates a complete multi-step booking', () => {
    const store = useBookingStore.getState()

    // Step 1: Vehicle
    store.setVehicleCategory('suv', 'SUV')

    // Step 2: Program
    store.setProgram({ id: 'to-glow', name: 'To Glow', price: 1085, altegioId: 201 })

    // Step 3: Addons
    store.toggleAddon({ id: 'impregnace-kuze', name: 'Impregnace kůže', price: 1285, altegioId: 12923789 })
    store.toggleAddon({ id: 'ozonizace', name: 'Odstranění zápachu', price: 800, altegioId: 12923801 })

    // Step 4: Contact + Date
    store.setContactInfo({
      firstName: 'Jana',
      lastName: 'Nováková',
      email: 'jana@test.cz',
      phone: '+420600111222',
      comment: 'Prosím ráno',
    })
    store.setDateTime('2026-04-01', '09:00')

    // Verify final state
    const state = useBookingStore.getState()
    expect(state.vehicleCategory).toBe('suv')
    expect(state.selectedProgram?.id).toBe('to-glow')
    expect(state.addons).toHaveLength(2)
    expect(state.totalPrice).toBe(1085 + 1285 + 800) // 3170
    expect(state.firstName).toBe('Jana')
    expect(state.selectedDate).toBe('2026-04-01')
    expect(state.selectedTime).toBe('09:00')

    // Step 5: Booking confirmed
    store.setBookingResult(123, 'confirmed')
    expect(useBookingStore.getState().bookingId).toBe(123)
    expect(useBookingStore.getState().bookingStatus).toBe('confirmed')
  })
})
