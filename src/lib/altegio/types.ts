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

/** Response from the book_dates endpoint — arrays of date strings. */
export interface AltegioBookDatesResponse {
  booking_dates: string[]  // "YYYY-MM-DD"
  working_dates: string[]  // "YYYY-MM-DD"
}

/** A single available time slot returned from the book_times endpoint. */
export interface AltegioBookTime {
  time: string
  /** ISO 8601 datetime string. */
  datetime: string
  /** Staff IDs available at this time. */
  seance_length: number
}

/** Payload sent to create a new booking record via book_record endpoint. */
export interface AltegioBookingRequest {
  /** Client phone (required). */
  phone: string
  /** Client full name (required). */
  fullname: string
  /** Client email (optional). */
  email?: string
  /** Optional comment for the booking. */
  comment?: string
  /** SMS reminder hours before visit (0 to disable). */
  notify_by_sms?: number
  /** Email reminder hours before visit (0 to disable). */
  notify_by_email?: number
  /** Appointments array — each item contains services, staff_id, datetime. */
  appointments: {
    /** Identifier for response mapping. */
    id: number
    /** Array of service IDs to book. */
    services: number[]
    /** Team member ID (0 = any available). */
    staff_id: number
    /** ISO 8601 datetime (e.g., "2026-03-05T19:00:00.000+01:00"). */
    datetime: string
  }[]
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

/** A booking record returned by the Altegio API. */
export interface AltegioRecord {
  id: number
  company_id: number
  staff_id: number
  services: Array<{
    id: number
    title: string
    cost: number
    cost_to_pay: number
    amount: number
  }>
  staff?: {
    id: number
    name: string
    specialization: string
  }
  client?: {
    id: number
    name: string
    surname: string
    phone: string
    email: string
  }
  date: string            // "YYYY-MM-DD HH:mm:ss"
  datetime: string        // ISO datetime
  create_date: string     // ISO datetime
  comment: string
  online: boolean | number
  visit_attendance: number // -1=not come, 0=waiting, 1=confirmed, 2=came
  attendance: number
  confirmed: number
  seance_length: number   // seconds
  length: number          // seconds
  deleted: boolean
  record_from?: string    // source label, e.g. "Altegio.me App", "Online widget"
  from_url?: string       // referrer URL
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
