// lib/resend.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)

export const FROM_EMAIL = 'Hotel Tamarind Tree <bookings@tamarindtree.lk>'
export const HOTEL_EMAIL = process.env.HOTEL_NOTIFICATION_EMAIL ?? 'info@tamarindtree.lk'
