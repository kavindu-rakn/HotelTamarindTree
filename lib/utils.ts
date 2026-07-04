import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Tailwind class merger ────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Price formatting ─────────────────────────────────────────
export function formatUSD(amount: number | string | { toNumber(): number }): string {
  const num = typeof amount === 'object' ? amount.toNumber() : Number(amount)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

// ─── Date formatting ──────────────────────────────────────────
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateInput(date: Date): string {
  // Returns YYYY-MM-DD for <input type="date">
  return date.toISOString().split('T')[0]
}

// ─── Night count ──────────────────────────────────────────────
export function getNightCount(checkIn: Date | string, checkOut: Date | string): number {
  const start = new Date(checkIn)
  const end   = new Date(checkOut)
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
}

// ─── Confirmation code generator ─────────────────────────────
export function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous chars (0/O, 1/I)
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// ─── Slugify ──────────────────────────────────────────────────
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── Meal plan display names ─────────────────────────────────
export function mealPlanLabel(plan: string): string {
  const labels: Record<string, string> = {
    BB: 'Bed & Breakfast',
    HB: 'Half Board',
    FB: 'Full Board',
  }
  return labels[plan] ?? plan
}

export function mealPlanDescription(plan: string): string {
  const descs: Record<string, string> = {
    BB: 'Room + Breakfast included',
    HB: 'Room + Breakfast + Lunch included',
    FB: 'Room + All meals included',
  }
  return descs[plan] ?? ''
}

// ─── Truncate ─────────────────────────────────────────────────
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}
