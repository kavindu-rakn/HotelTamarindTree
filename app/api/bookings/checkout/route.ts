// app/api/bookings/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { generateConfirmationCode, assignAvailableUnit, countNights } from '@/lib/booking-utils'
import { urlSlugToEnum } from '@/lib/utils'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      roomSlug,      // URL slug e.g. "deluxe-twin"
      mealPlan,      // "BB" or "HB"
      checkIn,       // "2026-08-01"
      checkOut,      // "2026-08-04"
      numGuests,     // number
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
    const booking = await db.booking.create({
      data: {
        confirmationCode,
        roomUnitId:     unitId,
        guestId:        guest.id,
        ratePlanId:     ratePlan.id,
        checkIn:        checkInDate,
        checkOut:       checkOutDate,
        numGuests:      numGuests ?? 1,
        status:         'PENDING',
        totalPriceUsd:  totalUsd,
        paymentStatus:  'PENDING',
        specialRequests: specialRequests || null,
      },
    })

    // ── Create Stripe Checkout Session ────────────────────────────
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${roomType.displayName} — ${mealPlan === 'BB' ? 'Bed & Breakfast' : 'Half Board'}`,
              description: `${nights} night${nights > 1 ? 's' : ''} · ${checkIn} → ${checkOut} · Ref: ${confirmationCode}`,
              images: [`${SITE_URL}/rooms/${roomSlug}.png`],
            },
            unit_amount: Math.round(totalUsd * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      customer_email: email.toLowerCase(),
      metadata: {
        bookingId:        booking.id,
        confirmationCode,
        guestName,
        phone:            phone ?? '',
        specialRequests:  specialRequests ?? '',
        roomName:         roomType.displayName,
        mealPlan,
        nights:           String(nights),
        numGuests:        String(numGuests ?? 1),
      },
      success_url: `${SITE_URL}/book/success?ref=${confirmationCode}`,
      cancel_url:  `${SITE_URL}/book/cancel?ref=${confirmationCode}`,
      expires_at:  Math.floor(Date.now() / 1000) + 30 * 60, // 30 min — matches our pending timeout
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
