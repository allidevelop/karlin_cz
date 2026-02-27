import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BookingState {
  // Step 1: Vehicle
  vehicleCategory: string | null
  // Step 2: Program
  selectedProgram: string | null
  programPrice: number
  // Step 3: Add-ons
  addons: string[]
  addonsPrice: number
  // Step 4: Contact
  firstName: string
  lastName: string
  email: string
  phone: string
  selectedDate: string | null
  selectedTime: string | null
  // Total
  totalPrice: number
  // Actions
  setVehicleCategory: (category: string) => void
  setProgram: (program: string, price: number) => void
  toggleAddon: (addon: string, price: number) => void
  setContactInfo: (info: Partial<Pick<BookingState, 'firstName' | 'lastName' | 'email' | 'phone'>>) => void
  setDateTime: (date: string, time: string) => void
  reset: () => void
}

const initialState = {
  vehicleCategory: null,
  selectedProgram: null,
  programPrice: 0,
  addons: [],
  addonsPrice: 0,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  selectedDate: null,
  selectedTime: null,
  totalPrice: 0,
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,

      setVehicleCategory: (category) =>
        set({ vehicleCategory: category }),

      setProgram: (program, price) =>
        set((state) => ({
          selectedProgram: program,
          programPrice: price,
          totalPrice: price + state.addonsPrice,
        })),

      toggleAddon: (addon, price) =>
        set((state) => {
          const exists = state.addons.includes(addon)
          const nextAddons = exists
            ? state.addons.filter((a) => a !== addon)
            : [...state.addons, addon]
          const nextAddonsPrice = exists
            ? state.addonsPrice - price
            : state.addonsPrice + price

          return {
            addons: nextAddons,
            addonsPrice: nextAddonsPrice,
            totalPrice: state.programPrice + nextAddonsPrice,
          }
        }),

      setContactInfo: (info) =>
        set((state) => ({ ...state, ...info })),

      setDateTime: (date, time) =>
        set({ selectedDate: date, selectedTime: time }),

      reset: () => set(initialState),
    }),
    {
      name: 'automycka-booking',
    }
  )
)
