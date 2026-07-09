// lib/resend.ts
import { Resend } from 'resend'

let _resend: Resend | null = null

export function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

// Until tamarindtree.lk is verified in Resend, RESEND_FROM_EMAIL can be set to
// the sandbox sender 'onboarding@resend.dev', which needs no domain
// verification — but Resend will then only deliver to the email address the
// Resend account itself is signed up with, regardless of who the code sends to.
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'Hotel Tamarind Tree <bookings@tamarindtree.lk>'
export const HOTEL_EMAIL = process.env.HOTEL_NOTIFICATION_EMAIL ?? 'info@tamarindtree.lk'
