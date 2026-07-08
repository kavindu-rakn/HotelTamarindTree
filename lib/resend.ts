// lib/resend.ts
import { Resend } from 'resend'

let _resend: Resend | null = null

export function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export const FROM_EMAIL = 'Hotel Tamarind Tree <bookings@tamarindtree.lk>'
export const HOTEL_EMAIL = process.env.HOTEL_NOTIFICATION_EMAIL ?? 'info@tamarindtree.lk'
