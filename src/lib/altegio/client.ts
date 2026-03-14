import type {
  AltegioResponse,
  AltegioService,
  AltegioCategory,
  AltegioBookDatesResponse,
  AltegioBookTime,
  AltegioBookingRequest,
  AltegioClientData,
  AltegioRecord,
} from './types'

const ALTEGIO_BASE_URL = 'https://api.alteg.io/api/v1'

interface AltegioConfig {
  partnerId: string
  partnerToken: string
  userToken: string
  companyId: string
}

class AltegioClient {
  private config: AltegioConfig
  private requestQueue: Promise<void> = Promise.resolve()
  private lastRequestTime = 0
  private minInterval = 200 // 5 req/s max

  constructor(config: AltegioConfig) {
    this.config = config
  }

  private get headers(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.config.partnerToken}, User ${this.config.userToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.api.v2+json',
    }
  }

  private get companyUrl(): string {
    return `${ALTEGIO_BASE_URL}/company/${this.config.companyId}`
  }

  /**
   * Rate-limited fetch that ensures a minimum interval between requests.
   * Queues requests sequentially so we never exceed 5 req/s.
   */
  private async rateLimitedFetch<T>(
    url: string,
    options?: RequestInit
  ): Promise<AltegioResponse<T>> {
    return new Promise<AltegioResponse<T>>((resolve, reject) => {
      this.requestQueue = this.requestQueue.then(async () => {
        const now = Date.now()
        const elapsed = now - this.lastRequestTime
        if (elapsed < this.minInterval) {
          await new Promise((r) => setTimeout(r, this.minInterval - elapsed))
        }
        this.lastRequestTime = Date.now()

        try {
          const response = await fetch(url, {
            ...options,
            headers: {
              ...this.headers,
              ...options?.headers,
            },
          })

          if (!response.ok) {
            const errorBody = await response.text()
            throw new Error(
              `Altegio API error ${response.status}: ${errorBody}`
            )
          }

          const json = (await response.json()) as AltegioResponse<T>
          resolve(json)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  /**
   * Fetch all services for the company.
   * GET /company/{id}/services
   */
  async getServices(): Promise<AltegioResponse<AltegioService[]>> {
    return this.rateLimitedFetch<AltegioService[]>(
      `${this.companyUrl}/services`
    )
  }

  /**
   * Fetch all service categories for the company.
   * GET /company/{id}/service_categories
   */
  async getServiceCategories(): Promise<AltegioResponse<AltegioCategory[]>> {
    return this.rateLimitedFetch<AltegioCategory[]>(
      `${this.companyUrl}/service_categories`
    )
  }

  /**
   * Fetch available booking dates for a given service.
   * GET /book_dates/{company_id}
   */
  async getAvailableDates(
    serviceId: number,
    staffId?: number
  ): Promise<AltegioResponse<AltegioBookDatesResponse>> {
    const params = new URLSearchParams({
      service_ids: String(serviceId),
    })
    if (staffId) {
      params.set('staff_id', String(staffId))
    }

    return this.rateLimitedFetch<AltegioBookDatesResponse>(
      `${ALTEGIO_BASE_URL}/book_dates/${this.config.companyId}?${params.toString()}`
    )
  }

  /**
   * Fetch available time slots for a given service on a specific date.
   * GET /book_times/{company_id}/{staff_id}/{date}
   */
  async getAvailableTimes(
    serviceId: number,
    date: string,
    staffId?: number
  ): Promise<AltegioResponse<AltegioBookTime[]>> {
    const resolvedStaffId = staffId ?? 0
    const params = new URLSearchParams({
      service_ids: String(serviceId),
    })

    return this.rateLimitedFetch<AltegioBookTime[]>(
      `${ALTEGIO_BASE_URL}/book_times/${this.config.companyId}/${resolvedStaffId}/${date}?${params.toString()}`
    )
  }

  /**
   * Create a new booking record.
   * POST /book_record/{company_id}
   */
  async createBooking(
    data: AltegioBookingRequest
  ): Promise<AltegioResponse<{ id: number }>> {
    return this.rateLimitedFetch<{ id: number }>(
      `${ALTEGIO_BASE_URL}/book_record/${this.config.companyId}`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  }

  /**
   * Create or find a client record.
   * POST /company/{id}/clients
   */
  async createClient(data: {
    name: string
    phone: string
    email?: string
  }): Promise<AltegioResponse<AltegioClientData>> {
    return this.rateLimitedFetch<AltegioClientData>(
      `${this.companyUrl}/clients`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  }

  /**
   * Fetch booking records for the company.
   * GET /records/{company_id}
   * Requires record_form_access permission on the user token.
   */
  async getRecords(params?: {
    startDate?: string  // YYYY-MM-DD
    endDate?: string    // YYYY-MM-DD
    page?: number
    count?: number
  }): Promise<AltegioResponse<AltegioRecord[]>> {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.set('start_date', params.startDate)
    if (params?.endDate) searchParams.set('end_date', params.endDate)
    if (params?.page) searchParams.set('page', String(params.page))
    searchParams.set('count', String(params?.count ?? 200))

    const qs = searchParams.toString()
    return this.rateLimitedFetch<AltegioRecord[]>(
      `${ALTEGIO_BASE_URL}/records/${this.config.companyId}${qs ? `?${qs}` : ''}`
    )
  }
}

/** Singleton Altegio API client instance. */
export const altegioClient = new AltegioClient({
  partnerId: process.env.ALTEGIO_PARTNER_ID ?? '',
  partnerToken: process.env.ALTEGIO_PARTNER_TOKEN ?? '',
  userToken: process.env.ALTEGIO_USER_TOKEN ?? '',
  companyId: process.env.ALTEGIO_COMPANY_ID ?? '',
})
