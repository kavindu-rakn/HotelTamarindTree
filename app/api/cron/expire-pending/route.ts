// app/api/cron/expire-pending/route.ts
// Cancels PENDING booking requests that have sat unanswered past
// PENDING_REQUEST_EXPIRY_HOURS, freeing the room unit back up.
// Triggered by Vercel Cron (see vercel.json) — protected via CRON_SECRET.
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { PENDING_REQUEST_EXPIRY_HOURS } from '@/lib/constants'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cutoff = new Date(Date.now() - PENDING_REQUEST_EXPIRY_HOURS * 60 * 60 * 1000)

  const { count } = await db.booking.updateMany({
    where: {
      status: 'PENDING',
      createdAt: { lt: cutoff },
    },
    data: {
      status: 'CANCELLED',
      cancellationReason: `Auto-expired — no staff response within ${PENDING_REQUEST_EXPIRY_HOURS}h`,
    },
  })

  return NextResponse.json({ expired: count })
}
