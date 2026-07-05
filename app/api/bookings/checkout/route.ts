// app/api/bookings/checkout/route.ts
// Payment-free "Request to Book" flow.
// Creates a PENDING booking in the DB and sends notification emails.
// PayHere payment integration will be added in a later phase.
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resend, FROM_EMAIL, HOTEL_EMAIL } from '@/lib/resend'
import {
  generateConfirmationCode,
  assignAvailableUnit,
  countNights,
  guestConfirmationEmailHtml,
  staffNotificationEmailHtml,
} from '@/lib/booking-utils'
import { urlSlugToEnum } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      roomSlug,
      mealPlan,
      checkIn,
      checkOut,
      numGuests,
      firstName,
      lastName,
      email,
      phone,
      specialRequests,
    } = body

    // ── Validate ─────────────────────────────────────────────────
    if (!roomSlug || !mealPlan || !checkIn || !checkOut || !firstName || !lastName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const enumSlug = urlSlugToEnum(roomSlug)
    if (!enumSlug) {
      return NextResponse.json({ error: 'Invalid room slug' }, { status: 400 })
    }

    const checkInDate  = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights       = countNights(checkInDate, checkOutDate)

    if (nights < 1) {
      return NextResponse.json({ error: 'Invalid date range' }, { status: 400 })
    }

    // ── Fetch room type + rate plan ───────────────────────────────
    const roomType = await db.roomType.findUnique({ where: { slug: enumSlug } })
    if (!roomType) return NextResponse.json({ error: 'Room type not found' }, { status: 404 })

    const ratePlan = await db.ratePlan.findFirst({
      where: { roomTypeId: roomType.id, mealPlan: mealPlan as 'BB' | 'HB', isVisible: true },
    })
    if (!ratePlan) return NextResponse.json({ error: 'Rate plan not found' }, { status: 404 })

    // ── Assign a unit ─────────────────────────────────────────────
    const unitId = await assignAvailableUnit(roomType.id, checkInDate, checkOutDate)
    if (!unitId) {
      return NextResponse.json({ error: 'No rooms available for these dates' }, { status: 409 })
    }

    // ── Create or find guest ──────────────────────────────────────
    const guestName = `${firstName.trim()} ${lastName.trim()}`
    let guest = await db.guest.findFirst({ where: { email: email.toLowerCase() } })
    if (!guest) {
      guest = await db.guest.create({
        data: { name: guestName, email: email.toLowerCase(), phone: phone ?? null },
      })
    }

    // ── Calculate total ───────────────────────────────────────────
    const pricePerNight = Number(ratePlan.priceUsd)
    const totalUsd      = pricePerNight * nights

    // ── Create PENDING booking ────────────────────────────────────
    const confirmationCode = generateConfirmationCode()
    await db.booking.create({
      data: {
        confirmationCode,
        roomUnitId:      unitId,
        guestId:         guest.id,
        ratePlanId:      ratePlan.id,
        checkIn:         checkInDate,
        checkOut:        checkOutDate,
        numGuests:       numGuests ?? 1,
        status:          'PENDING',
        totalPriceUsd:   totalUsd,
        paymentStatus:   'UNPAID',
        specialRequests: specialRequests || null,
      },
    })

    // ── Send emails ───────────────────────────────────────────────
    const checkInStr  = checkInDate.toISOString().slice(0, 10)
    const checkOutStr = checkOutDate.toISOString().slice(0, 10)

    const emailParams = {
      guestName,
      confirmCode:  confirmationCode,
      roomName:     roomType.displayName,
      boardPlan:    mealPlan,
      checkIn:      checkInStr,
      checkOut:     checkOutStr,
      nights,
      guests:       numGuests ?? 1,
      totalUsd:     totalUsd.toFixed(2),
    }

    // Guest confirmation (fire-and-forget — don't block the response)
    resend.emails.send({
      from:    FROM_EMAIL,
      to:      email.toLowerCase(),
      subject: `Booking Request Received — ${confirmationCode} | Hotel Tamarind Tree`,
      html:    guestConfirmationEmailHtml(emailParams),
    }).catch(err => console.error('[email] guest confirmation failed:', err))

    // Staff notification
    resend.emails.send({
      from:    FROM_EMAIL,
      to:      HOTEL_EMAIL,
      subject: `New Booking Request: ${confirmationCode} — ${guestName}`,
      html:    staffNotificationEmailHtml({
        ...emailParams,
        guestEmail:  email.toLowerCase(),
        guestPhone:  phone ?? '',
        specialReqs: specialRequests ?? '',
      }),
    }).catch(err => console.error('[email] staff notification failed:', err))

    // ── Return success ────────────────────────────────────────────
    return NextResponse.json({ confirmationCode })

  } catch (err) {
    console.error('[checkout] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
