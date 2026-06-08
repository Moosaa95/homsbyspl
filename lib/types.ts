export interface Location {
  id: number
  name: string
  state?: string
  country?: string
}

export interface PropertyDetails {
  id: number
  name: string
  location_details?: Location
}

export interface AgentDetails {
  id: number
  name: string
  phone?: string
  mobile?: string
  email?: string
}

export interface ApartmentListItem {
  id: number
  title: string
  type: string
  price: string
  currency: string
  status: "rent" | "sale"
  bedrooms: number
  bathrooms: number
  living_rooms: number
  guests: number
  description: string
  amenities: string[]
  featured: boolean
  is_active: boolean
  is_available: boolean
  primary_image: string | null
  location: string
  location_data_details?: Location
  property_details?: PropertyDetails
  agent?: AgentDetails
}

export interface Apartment extends ApartmentListItem {
  area: number
  garages: number
  units: number
  images: string[]                                // API returns flat list of URL strings
  categorized_images: Record<string, string[]>    // same — lists of URL strings per category
  available_from?: string
  property_id?: number
  latitude?: string
  longitude?: string
}

export interface BookedDateRange {
  start: string
  end: string
}

export interface BookingCreateData {
  apartment_id: number
  name: string
  email: string
  phone: string
  check_in: string
  check_out: string
  guests: number
  special_requests?: string
  // Guest verification fields (supported by backend)
  address?: string
  id_type?: string
  purpose?: string
}

export interface Booking {
  booking_id: string
  apartment_details?: ApartmentListItem
  name: string
  email: string
  phone: string
  check_in: string
  check_out: string
  guests: number
  nights: number
  total_amount: string
  currency: string
  status: string
  payment_status: string
  special_requests?: string
  address?: string
  id_type?: string
  id_document_url?: string
  purpose?: string
  created_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface PaystackConfig {
  public_key: string
  callback_url: string
}

export interface PaymentInitResponse {
  authorization_url?: string
  access_code?: string
  reference: string
  payment_id?: string
  amount?: number | string
}

export interface ApartmentFilters {
  search?: string
  type?: string
  min_price?: number
  max_price?: number
  bedrooms?: number
  featured?: boolean
  property?: number
  page?: number
  page_size?: number
  ordering?: string
}

// ── Properties ────────────────────────────────────────────────

export interface PropertyImage {
  id: number
  image: string
  image_url?: string
  order: number
  is_primary: boolean
}

export interface PropertyListItem {
  id: number
  name: string
  featured: boolean
  primary_image: string | null
  location_details?: Location
  apartment_count: number
}

export interface Property {
  id: number
  name: string
  description?: string
  entity?: string
  address?: string
  amenities: string[]
  featured: boolean
  is_active: boolean
  latitude?: string
  longitude?: string
  location_details?: Location
  images: PropertyImage[]
  apartment_count: number
  created_at: string
  updated_at: string
}

export interface PropertyFilters {
  search?: string
  featured?: boolean
  page?: number
  page_size?: number
  ordering?: string
}
