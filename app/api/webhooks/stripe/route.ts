// app/api/webhooks/stripe/route.ts
// Stripe sends events here after payment. We confirm the booking and send emails.
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { getResend, FROM_EMAIL, HOTEL_EMAIL } from '@/lib/resend'
import { countNights, guestConfirmationEmailHtml, staffNotificationEmailHtml } from '@/lib/booking-utils'

export async function POST(req: NextRequest) {
  const sig     = req.headers.get('stripe-signature') ?? ''
  const rawBody = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[stripe webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object
    const meta     = session.metadata ?? {}
    const bookingId = meta.bookingId

    if (!bookingId) {
      console.error('[stripe webhook] missing bookingId in metadata')
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
    }

    // Update booking to CONFIRMED
    const booking = await db.booking.update({
      where: { id: bookingId },
      data: {
        status:          'CONFIRMED',
        paymentStatus:   'PAID',
        paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
      },
      include: { guest: true, roomUnit: { include: { roomType: true } }, ratePlan: true },
    })

    const nights    = countNights(new Date(booking.checkIn), new Date(booking.checkOut))
    const checkIn   = new Date(booking.checkIn).toISOString().slice(0, 10)
    const checkOut  = new Date(booking.checkOut).toISOString().slice(0, 10)
    const totalUsd  = Number(booking.totalPriceUsd).toFixed(2)
    const mealPlan  = booking.ratePlan.mealPlan
    const roomName  = booking.roomUnit.roomType.displayName

    const emailParams = {
      guestName:   booking.guest.name,
      confirmCode: booking.confirmationCode,
      roomName,
      boardPlan:   mealPlan,
      checkIn,
      checkOut,
      nights,
      guests:      booking.numGuests,
      totalUsd,
    }

    // Send guest confirmation email
    await getResend().emails.send({
      from:    FROM_EMAIL,
      to:      booking.guest.email,
      subject: `Booking Confirmed — ${booking.confirmationCode} | Hotel Tamarind Tree`,
      html:    guestConfirmationEmailHtml(emailParams),
    })

    // Send staff notification email
    await getResend().emails.send({
      from:    FROM_EMAIL,
      to:      HOTEL_EMAIL,
      subject: `New Booking: ${booking.confirmationCode} — ${booking.guest.name}`,
      html:    staffNotificationEmailHtml({
        ...emailParams,
        guestEmail:  booking.guest.email,
        guestPhone:  booking.guest.phone ?? '',
        specialReqs: booking.specialRequests ?? '',
      }),
    })

    console.log(`[stripe webhook] Booking ${booking.confirmationCode} confirmed, emails sent.`)
  }

  if (event.type === 'checkout.session.expired') {
    // Stripe session expired (30 min) → cancel the pending booking to free the room
    const session  = event.data.object
    const bookingId = session.metadata?.bookingId
    if (bookingId) {
      await db.booking.update({
        where:  { id: bookingId },
        data:   { status: 'CANCELLED', paymentStatus: 'UNPAID', cancellationReason: 'Checkout session expired' },
      })
      console.log(`[stripe webhook] Booking ${bookingId} expired and cancelled.`)
    }
  }

  return NextResponse.json({ received: true })
}
