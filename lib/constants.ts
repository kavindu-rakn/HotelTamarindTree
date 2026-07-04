// ─── Site Metadata ────────────────────────────────────────────
export const SITE_NAME    = 'Hotel Tamarind Tree'
export const SITE_TAGLINE = 'A Sanctuary in the Heart of Tissamaharama'
export const SITE_URL     = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tamarindtree.lk'
export const SITE_EMAIL   = 'info@tamarindtree.lk'
export const SITE_PHONE   = '+94 XX XXX XXXX' // TODO: replace with real number
export const SITE_ADDRESS = 'Tissamaharama, Sri Lanka'

// ─── Brand ───────────────────────────────────────────────────
export const BRAND_COLORS = {
  crimson:    '#5e1e12',
  taupe:      '#6D5840',
  cream:      '#FAF7F2',
  gold:       '#C9A96E',
  ink:        '#2C1A12',
} as const

// ─── Room Type Slugs ─────────────────────────────────────────
export const ROOM_TYPE_SLUGS = {
  DELUXE_TWIN:    'DELUXE_TWIN',
  DELUXE_DOUBLE:  'DELUXE_DOUBLE',
  DELUXE_TRIPLE:  'DELUXE_TRIPLE',
  FAMILY:         'FAMILY',
} as const

export type RoomTypeSlug = keyof typeof ROOM_TYPE_SLUGS

// ─── Meal Plans ───────────────────────────────────────────────
export const MEAL_PLANS = {
  BB: 'BB',
  HB: 'HB',
  FB: 'FB',
} as const

export type MealPlan = keyof typeof MEAL_PLANS

// ─── Booking Statuses ─────────────────────────────────────────
export const BOOKING_STATUS = {
  PENDING:      'PENDING',
  CONFIRMED:    'CONFIRMED',
  CANCELLED:    'CANCELLED',
  CHECKED_IN:   'CHECKED_IN',
  CHECKED_OUT:  'CHECKED_OUT',
  NO_SHOW:      'NO_SHOW',
} as const

export type BookingStatus = keyof typeof BOOKING_STATUS

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING:      'Pending',
  CONFIRMED:    'Confirmed',
  CANCELLED:    'Cancelled',
  CHECKED_IN:   'Checked In',
  CHECKED_OUT:  'Checked Out',
  NO_SHOW:      'No Show',
}

// ─── Payment Statuses ─────────────────────────────────────────
export const PAYMENT_STATUS = {
  UNPAID:               'UNPAID',
  PENDING:              'PENDING',
  PAID:                 'PAID',
  REFUNDED:             'REFUNDED',
  PARTIALLY_REFUNDED:   'PARTIALLY_REFUNDED',
} as const

export type PaymentStatus = keyof typeof PAYMENT_STATUS

// ─── Navigation ───────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Home',        href: '/' },
  { label: 'Rooms',       href: '/rooms' },
  { label: 'Gallery',     href: '/gallery' },
  { label: 'Facilities',  href: '/facilities' },
  { label: 'Offers',      href: '/offers' },
  { label: 'About',       href: '/about' },
  { label: 'Contact',     href: '/contact' },
] as const

// ─── Booking Config ───────────────────────────────────────────
export const MAX_ADVANCE_BOOKING_DAYS = 365
export const MIN_STAY_NIGHTS         = 1
export const DEFAULT_CHECK_IN_HOUR   = 14  // 2 PM
export const DEFAULT_CHECK_OUT_HOUR  = 11  // 11 AM

// ─── Admin Roles ─────────────────────────────────────────────
export const ADMIN_ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
} as const

export type AdminRole = keyof typeof ADMIN_ROLES
