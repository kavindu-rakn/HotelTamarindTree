'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import {
  generateConfirmationCode,
  assignAvailableUnit,
  countNights,
  bookingConfirmedEmailHtml,
  bookingCancelledEmailHtml,
} from '@/lib/booking-utils'
import { urlSlugToEnum } from '@/lib/utils'

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  return session
}

function isOverlapConflict(err: unknown): boolean {
  return err instanceof Error && err.message.includes('bookings_no_overlap_excl')
}

export async function confirmBooking(bookingId: string) {
  await requireAdmin()

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { guest: true, ratePlan: { include: { roomType: true } } },
  })
  if (!booking) throw new Error('Booking not found')
  if (booking.status !== 'PENDING') throw new Error('Only pending bookings can be confirmed')

  await db.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED' } })

  const nights = countNights(booking.checkIn, booking.checkOut)
  getResend().emails.send({
    from:    FROM_EMAIL,
    to:      booking.guest.email,
    subject: `Booking Confirmed — ${booking.confirmationCode} | Hotel Tamarind Tree`,
    html: bookingConfirmedEmailHtml({
      guestName:   booking.guest.name,
      confirmCode: booking.confirmationCode,
      roomName:    booking.ratePlan.roomType.displayName,
      boardPlan:   booking.ratePlan.mealPlan,
      checkIn:     booking.checkIn.toISOString().slice(0, 10),
      checkOut:    booking.checkOut.toISOString().slice(0, 10),
      nights,
      guests:      booking.numGuests,
      totalUsd:    Number(booking.totalPriceUsd).toFixed(2),
    }),
  }).then(({ error }) => { if (error) console.error('[email] confirmation failed:', error) })
    .catch(err => console.error('[email] confirmation failed:', err))

  revalidatePath('/admin/bookings')
  revalidatePath('/admin')
}

export async function cancelBooking(bookingId: string, reason: string) {
  await requireAdmin()

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { guest: true },
  })
  if (!booking) throw new Error('Booking not found')
  if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
    throw new Error('Only pending or confirmed bookings can be cancelled')
  }

  await db.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED', cancellationReason: reason || null },
  })

  getResend().emails.send({
    from:    FROM_EMAIL,
    to:      booking.guest.email,
    subject: `Booking Cancelled — ${booking.confirmationCode} | Hotel Tamarind Tree`,
    html:    bookingCancelledEmailHtml({ guestName: booking.guest.name, confirmCode: booking.confirmationCode, reason }),
  }).then(({ error }) => { if (error) console.error('[email] cancellation failed:', error) })
    .catch(err => console.error('[email] cancellation failed:', err))

  revalidatePath('/admin/bookings')
  revalidatePath('/admin')
}

export async function checkInBooking(bookingId: string) {
  await requireAdmin()
  const booking = await db.booking.findUnique({ where: { id: bookingId } })
  if (!booking) throw new Error('Booking not found')
  if (booking.status !== 'CONFIRMED') throw new Error('Only confirmed bookings can be checked in')

  await db.booking.update({ where: { id: bookingId }, data: { status: 'CHECKED_IN' } })
  revalidatePath('/admin/bookings')
  revalidatePath('/admin')
}

export async function checkOutBooking(bookingId: string) {
  await requireAdmin()
  const booking = await db.booking.findUnique({ where: { id: bookingId } })
  if (!booking) throw new Error('Booking not found')
  if (booking.status !== 'CHECKED_IN') throw new Error('Only checked-in bookings can be checked out')

  await db.booking.update({ where: { id: bookingId }, data: { status: 'CHECKED_OUT' } })
  revalidatePath('/admin/bookings')
  revalidatePath('/admin')
}

export async function markNoShow(bookingId: string) {
  await requireAdmin()
  const booking = await db.booking.findUnique({ where: { id: bookingId } })
  if (!booking) throw new Error('Booking not found')
  if (booking.status !== 'CONFIRMED') throw new Error('Only confirmed bookings can be marked as no-show')

  await db.booking.update({ where: { id: bookingId }, data: { status: 'NO_SHOW' } })
  revalidatePath('/admin/bookings')
  revalidatePath('/admin')
}

export async function createManualBooking(input: {
  roomSlug: string
  mealPlan: 'BB' | 'HB'
  checkIn: string
  checkOut: string
  numGuests: number
  firstName: string
  lastName: string
  email: string
  phone: string
  specialRequests: string
}) {
  await requireAdmin()

  const enumSlug = urlSlugToEnum(input.roomSlug)
  if (!enumSlug) throw new Error('Invalid room type')

  const checkInDate  = new Date(input.checkIn)
  const checkOutDate = new Date(input.checkOut)
  const nights = countNights(checkInDate, checkOutDate)
  if (nights < 1) throw new Error('Invalid date range')

  const roomType = await db.roomType.findUnique({ where: { slug: enumSlug } })
  if (!roomType) throw new Error('Room type not found')

  const ratePlan = await db.ratePlan.findFirst({
    where: { roomTypeId: roomType.id, mealPlan: input.mealPlan },
  })
  if (!ratePlan) throw new Error('Rate plan not found')

  const guestName = `${input.firstName.trim()} ${input.lastName.trim()}`
  let guest = await db.guest.findFirst({ where: { email: input.email.toLowerCase() } })
  if (!guest) {
    guest = await db.guest.create({
      data: { name: guestName, email: input.email.toLowerCase(), phone: input.phone || null },
    })
  }

  const totalUsd = Number(ratePlan.priceUsd) * nights

  for (let attempt = 0; attempt < 5; attempt++) {
    const unitId = await assignAvailableUnit(roomType.id, checkInDate, checkOutDate)
    if (!unitId) throw new Error('No rooms available for the selected dates')

    try {
      await db.booking.create({
        data: {
          confirmationCode: generateConfirmationCode(),
          roomUnitId:       unitId,
          guestId:          guest.id,
          ratePlanId:       ratePlan.id,
          checkIn:          checkInDate,
          checkOut:         checkOutDate,
          numGuests:        input.numGuests,
          status:           'CONFIRMED',
          totalPriceUsd:    totalUsd,
          paymentStatus:    'UNPAID',
          specialRequests:  input.specialRequests || null,
        },
      })
      revalidatePath('/admin/bookings')
      revalidatePath('/admin')
      return
    } catch (err) {
      if (isOverlapConflict(err)) continue
      throw err
    }
  }
  throw new Error('This room is no longer available for the selected dates. Please try again.')
}
