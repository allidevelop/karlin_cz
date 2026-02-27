/** A single service returned by the Altegio API. */
export interface AltegioService {
  id: number
  title: string
  category_id: number
  price_min: number
  price_max: number
  discount: number
  /** Duration in seconds. */
  duration: number
  comment: string
  weight: number
  active: boolean
  image: string
  prepaid: 'forbidden' | 'allowed' | 'required'
  staff: number[]
}

/** A service category returned by the Altegio API. */
export interface AltegioCategory {
  id: number
  title: string
  weight: number
  api_id: number | null
  staff: number[]
}

/** A single available date returned from the book_dates endpoint. */
export interface AltegioBookDate {
  date: string
  /** Whether the date is available for booking. */
  is_available: boolean
}

/** A single available time slot returned from the book_times endpoint. */
export interface AltegioBookTime {
  time: string
  /** ISO 8601 datetime string. */
  datetime: string
  /** Staff IDs available at this time. */
  seance_length: number
}

/** Payload sent to create a new booking record. */
export interface AltegioBookingRequest {
  /** Array of service objects with id and staff_id. */
  appointments: {
    id: number
    staff_id: number
  }[]
  /** Client information. */
  client: {
    phone: string
    name: string
    email?: string
  }
  /** ISO date string (YYYY-MM-DD). */
  date: string
  /** Time string (HH:mm). */
  time: string
  /** Optional comment for the booking. */
  comment?: string
  /** SMS notification for the client. */
  notify_by_sms?: number
  /** Email notification for the client. */
  notify_by_email?: number
}

/** Client data structure for the Altegio API. */
export interface AltegioClientData {
  id: number
  name: string
  phone: string
  email: string
  discount: number
  visits: number
  sex_id: number
  importance_id: number
  categories: number[]
  label: string
}

/** Generic wrapper for Altegio API responses. */
export interface AltegioResponse<T> {
  success: boolean
  data: T
  meta?: {
    page: number
    total_count: number
  }
}
