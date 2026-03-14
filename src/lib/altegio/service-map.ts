/**
 * Central source of truth for Altegio service IDs and prices.
 * Data derived from live Altegio API (company 983520 — Automyčka Karlín).
 */

export type VehicleKey = 'sedan' | 'suv' | 'g-class' | 'motocykly'
export type ProgramKey = 'to-go' | 'to-glow' | 'to-wow' | 'exterior-komplet' | 'interior-komplet' | 'premium-detailing'

/** Vehicle categories mapped to Altegio service category IDs */
export const VEHICLE_CATEGORIES: Record<VehicleKey, { altegioCategoryId: number; name: string }> = {
  sedan: { altegioCategoryId: 11897500, name: 'Hatchback / Sedan' },
  suv: { altegioCategoryId: 11897504, name: 'SUV' },
  'g-class': { altegioCategoryId: 11897508, name: 'G-Class / V-Class / Pickup' },
  motocykly: { altegioCategoryId: 12810110, name: 'Motocykly' },
}

/** Per-vehicle Altegio service ID and price for each program */
export const PROGRAMS: Record<ProgramKey, {
  name: string
  sedan: { id: number; price: number }
  suv: { id: number; price: number }
  'g-class': { id: number; price: number }
}> = {
  'to-go': {
    name: 'TO GO',
    sedan: { id: 11897501, price: 1485 },
    suv: { id: 11897505, price: 1585 },
    'g-class': { id: 11897509, price: 1885 },
  },
  'to-glow': {
    name: 'TO GLOW',
    sedan: { id: 11897502, price: 2085 },
    suv: { id: 11897506, price: 2285 },
    'g-class': { id: 11897510, price: 2585 },
  },
  'to-wow': {
    name: 'TO WOW',
    sedan: { id: 11897503, price: 2785 },
    suv: { id: 11897507, price: 2985 },
    'g-class': { id: 11897511, price: 3285 },
  },
  'exterior-komplet': {
    name: 'EXTERIÉR',
    sedan: { id: 12810031, price: 985 },
    suv: { id: 12810049, price: 1085 },
    'g-class': { id: 12810059, price: 1285 },
  },
  'interior-komplet': {
    name: 'INTERIÉR',
    sedan: { id: 12810032, price: 1085 },
    suv: { id: 12810051, price: 1185 },
    'g-class': { id: 12810060, price: 1385 },
  },
  'premium-detailing': {
    name: 'PREMIUM',
    sedan: { id: 12923748, price: 4485 },
    suv: { id: 12923752, price: 4785 },
    'g-class': { id: 12923753, price: 4985 },
  },
}

/** MOTO has only one program */
export const MOTO_PROGRAM = {
  id: 'komplexni-myti',
  altegioId: 12810111,
  name: 'KOMPLEXNÍ MYTÍ',
  price: 985,
}

/** Addons category ID in Altegio */
export const ADDONS_CATEGORY_ID = 12923782

/** All 14 addons — same IDs regardless of vehicle */
export const ADDONS = [
  { altegioId: 12923787, name: 'Čištění bezpečnostních pásů', price: 485 },
  { altegioId: 12923789, name: 'Impregnace kůže', price: 485 },
  { altegioId: 12923791, name: 'Odstranění vodního kamene z oken', price: 485 },
  { altegioId: 12923792, name: 'Mytí motoru', price: 485 },
  { altegioId: 12923795, name: 'Dekontaminace laku', price: 785 },
  { altegioId: 12923797, name: 'Tekuté stěrače – čelní sklo', price: 785 },
  { altegioId: 12923800, name: 'Tekuté stěrače – celé vozidlo', price: 2485 },
  { altegioId: 12923801, name: 'Dezinfekce ozonem', price: 985 },
  { altegioId: 12923803, name: 'Čištění/impregnace vinylové střechy cabrio', price: 2485 },
  { altegioId: 12923804, name: 'Tekutý nano vosk – 3 měsíce', price: 1485 },
  { altegioId: 12923805, name: 'Tuhý vosk Carnauba Premium – 6 měsíců', price: 2985 },
  { altegioId: 12923812, name: 'Syntetický nano vosk Fusso – 12 měsíců', price: 4485 },
  { altegioId: 12923817, name: 'Keramická ochrana sedaček + TO WOW zdarma', price: 9985 },
  { altegioId: 13073029, name: 'Leštění karoserie', price: 7000 },
] as const

/** Get the starting (cheapest) price for a vehicle category */
export function getStartingPrice(vehicle: VehicleKey): number {
  if (vehicle === 'motocykly') return MOTO_PROGRAM.price
  // Find the minimum price across all programs for this vehicle
  return Math.min(
    ...Object.values(PROGRAMS).map(p => p[vehicle as 'sedan' | 'suv' | 'g-class'].price)
  )
}

/** Get program details for a specific vehicle */
export function getProgramForVehicle(
  programKey: ProgramKey,
  vehicle: VehicleKey
): { altegioId: number; price: number; name: string } | null {
  if (vehicle === 'motocykly') return null
  const program = PROGRAMS[programKey]
  if (!program) return null
  const vehicleData = program[vehicle as 'sedan' | 'suv' | 'g-class']
  return { altegioId: vehicleData.id, price: vehicleData.price, name: program.name }
}
