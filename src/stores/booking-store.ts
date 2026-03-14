import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BookingProgram {
  id: string
  name: string
  price: number
  altegioId: number
}

export interface BookingAddon {
  id: string
  name: string
  price: number
  altegioId: number
}

export interface BookingState {
  // Step 1: Vehicle
  vehicleCategory: string | null
  vehicleCategoryName: string | null
  altegioCategoryId: number | null
  // Step 2: Program
  selectedProgram: BookingProgram | null
  isAddonOnly: boolean
  // Step 3: Add-ons
  addons: BookingAddon[]
  // Step 4: Contact + Date/Time
  firstName: string
  lastName: string
  email: string
  phone: string
  comment: string
  selectedDate: string | null
  selectedTime: string | null
  reminder: string
  // Promo
  promoCode: string
  promotionId: string | null
  promotionDiscount: number
  promoDiscountType: 'percentage' | 'fixed' | null
  promoDiscountValue: number
  // Direct promo booking (skip vehicle/program selection)
  directAltegioServiceId: number | null
  directServiceName: string | null
  directServicePrice: number | null
  // Booking result
  bookingId: number | null
  bookingStatus: string | null
  // Computed
  totalPrice: number
  // Actions
  setVehicleCategory: (id: string, name: string, altegioCategoryId?: number) => void
  setProgram: (program: BookingProgram) => void
  clearProgram: () => void
  setAddonOnly: (value: boolean) => void
  toggleAddon: (addon: BookingAddon) => void
  setContactInfo: (info: Partial<Pick<BookingState, 'firstName' | 'lastName' | 'email' | 'phone' | 'comment' | 'reminder'>>) => void
  setDateTime: (date: string, time: string) => void
  setPromoCode: (code: string) => void
  setPromotion: (id: string, promoCode: string, discountType: 'percentage' | 'fixed', discountValue: number) => void
  setDirectPromoBooking: (altegioServiceId: number, serviceName: string, price: number, promotionId: string, promoCode: string) => void
  clearDirectService: () => void
  clearPromotion: () => void
  setBookingResult: (id: number, status: string) => void
  reset: () => void
}

const initialState = {
  vehicleCategory: null as string | null,
  vehicleCategoryName: null as string | null,
  altegioCategoryId: null as number | null,
  selectedProgram: null as BookingProgram | null,
  isAddonOnly: false,
  addons: [] as BookingAddon[],
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  comment: '',
  selectedDate: null as string | null,
  selectedTime: null as string | null,
  reminder: '1h',
  promoCode: '',
  promotionId: null as string | null,
  promotionDiscount: 0,
  promoDiscountType: null as 'percentage' | 'fixed' | null,
  promoDiscountValue: 0,
  directAltegioServiceId: null as number | null,
  directServiceName: null as string | null,
  directServicePrice: null as number | null,
  bookingId: null as number | null,
  bookingStatus: null as string | null,
  totalPrice: 0,
}

function calcSubtotal(program: BookingProgram | null, addons: BookingAddon[]) {
  return (program?.price ?? 0) + addons.reduce((sum, a) => sum + a.price, 0)
}

function calcDiscount(subtotal: number, type: 'percentage' | 'fixed' | null, value: number): number {
  if (type === 'percentage') return Math.min(subtotal, Math.round(subtotal * value / 100))
  if (type === 'fixed') return Math.min(subtotal, value)
  return 0
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,

      setVehicleCategory: (id, name, altegioCategoryId) =>
        set({ vehicleCategory: id, vehicleCategoryName: name, altegioCategoryId: altegioCategoryId ?? null }),

      setProgram: (program) =>
        set((state) => {
          const subtotal = calcSubtotal(program, state.addons)
          const discount = calcDiscount(subtotal, state.promoDiscountType, state.promoDiscountValue)
          return {
            selectedProgram: program,
            promotionDiscount: discount,
            totalPrice: subtotal - discount,
          }
        }),

      clearProgram: () =>
        set((state) => {
          const subtotal = calcSubtotal(null, state.addons)
          const discount = calcDiscount(subtotal, state.promoDiscountType, state.promoDiscountValue)
          return {
            selectedProgram: null,
            promotionDiscount: discount,
            totalPrice: subtotal - discount,
          }
        }),

      setAddonOnly: (value) =>
        set({ isAddonOnly: value, selectedProgram: null, totalPrice: 0, promotionDiscount: 0 }),

      toggleAddon: (addon) =>
        set((state) => {
          const exists = state.addons.some((a) => a.id === addon.id)
          const nextAddons = exists
            ? state.addons.filter((a) => a.id !== addon.id)
            : [...state.addons, addon]
          const subtotal = calcSubtotal(state.selectedProgram, nextAddons)
          const discount = calcDiscount(subtotal, state.promoDiscountType, state.promoDiscountValue)
          return {
            addons: nextAddons,
            promotionDiscount: discount,
            totalPrice: subtotal - discount,
          }
        }),

      setContactInfo: (info) => set((state) => ({ ...state, ...info })),

      setDateTime: (date, time) =>
        set({ selectedDate: date, selectedTime: time }),

      setPromoCode: (code) => set({ promoCode: code }),

      setPromotion: (id, promoCode, discountType, discountValue) =>
        set((state) => {
          const subtotal = calcSubtotal(state.selectedProgram, state.addons)
          const discount = calcDiscount(subtotal, discountType, discountValue)
          return {
            promotionId: id,
            promoCode,
            promoDiscountType: discountType,
            promoDiscountValue: discountValue,
            promotionDiscount: discount,
            totalPrice: subtotal - discount,
          }
        }),

      setDirectPromoBooking: (altegioServiceId, serviceName, price, promotionId, promoCode) =>
        set({
          ...initialState,
          directAltegioServiceId: altegioServiceId,
          directServiceName: serviceName,
          directServicePrice: price,
          promotionId,
          promoCode,
          totalPrice: price,
        }),

      clearDirectService: () =>
        set({
          directAltegioServiceId: null,
          directServiceName: null,
          directServicePrice: null,
          totalPrice: 0,
        }),

      clearPromotion: () =>
        set((state) => {
          const subtotal = calcSubtotal(state.selectedProgram, state.addons)
          return {
            promotionId: null,
            promoCode: '',
            promoDiscountType: null,
            promoDiscountValue: 0,
            promotionDiscount: 0,
            totalPrice: subtotal,
          }
        }),

      setBookingResult: (id, status) =>
        set({ bookingId: id, bookingStatus: status }),

      reset: () => set(initialState),
    }),
    {
      name: 'automycka-booking',
    }
  )
)
