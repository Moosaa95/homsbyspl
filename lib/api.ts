import type {
  ApartmentFilters,
  ApartmentListItem,
  Apartment,
  Booking,
  BookedDateRange,
  BookingCreateData,
  PaginatedResponse,
  PaystackConfig,
  PaymentInitResponse,
  PropertyFilters,
  PropertyListItem,
  Property,
} from "./types"

function getBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api")
    .trim()
    .replace(/\/+$/, "")
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getBase()}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const msg =
      body?.detail ??
      (typeof body === "object" ? JSON.stringify(body) : `Error ${res.status}`)
    throw new Error(msg)
  }
  return res.json() as Promise<T>
}

export const api = {
  apartments: {
    list(filters: ApartmentFilters = {}): Promise<PaginatedResponse<ApartmentListItem>> {
      const p = new URLSearchParams()
      if (filters.search) p.set("search", filters.search)
      if (filters.type) p.set("type", filters.type)
      if (filters.min_price != null) p.set("min_price", String(filters.min_price))
      if (filters.max_price != null) p.set("max_price", String(filters.max_price))
      if (filters.bedrooms != null) p.set("bedrooms", String(filters.bedrooms))
      if (filters.featured != null) p.set("featured", String(filters.featured))
      if (filters.property != null) p.set("property", String(filters.property))
      p.set("page", String(filters.page ?? 1))
      p.set("page_size", String(filters.page_size ?? 12))
      p.set("ordering", filters.ordering ?? "-created_at")
      return request<PaginatedResponse<ApartmentListItem>>(`/apartments/?${p}`)
    },

    get(id: string | number): Promise<Apartment> {
      return request<Apartment>(`/apartments/${id}/`)
    },

    bookedDates(id: string | number): Promise<BookedDateRange[]> {
      return request<BookedDateRange[]>(`/apartments/${id}/booked_dates/`)
    },
  },

  properties: {
    list(filters: PropertyFilters = {}): Promise<PaginatedResponse<PropertyListItem>> {
      const p = new URLSearchParams()
      if (filters.search) p.set("search", filters.search)
      if (filters.featured != null) p.set("featured", String(filters.featured))
      p.set("page", String(filters.page ?? 1))
      p.set("page_size", String(filters.page_size ?? 12))
      if (filters.ordering) p.set("ordering", filters.ordering)
      return request<PaginatedResponse<PropertyListItem>>(`/properties/?${p}`)
    },

    get(id: string | number): Promise<Property> {
      return request<Property>(`/properties/${id}/`)
    },
  },

  bookings: {
    create(data: BookingCreateData): Promise<Booking> {
      return request<Booking>("/bookings/", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((json) => {
        // Backend may return { booking: {...} } or the booking directly
        const raw = json as unknown as { booking?: Booking } & Booking
        return (raw?.booking ?? raw) as Booking
      })
    },
  },

  payments: {
    config(): Promise<PaystackConfig> {
      return request<PaystackConfig>("/payments/config/")
    },

    initialize(bookingId: string): Promise<PaymentInitResponse> {
      return request<PaymentInitResponse>("/payments/initialize/", {
        method: "POST",
        body: JSON.stringify({ booking_id: bookingId }),
      })
    },

    verify(reference: string): Promise<{ status: string; booking?: Booking }> {
      return request<{ status: string; booking?: Booking }>("/payments/verify/", {
        method: "POST",
        body: JSON.stringify({ reference }),
      })
    },
  },
}
