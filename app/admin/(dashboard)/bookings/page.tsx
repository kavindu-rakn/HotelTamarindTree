import Link from 'next/link'
import { db } from '@/lib/db'
import { BOOKING_STATUS, BookingStatus } from '@/lib/constants'
import BookingsTable from './BookingsTable'
import { Plus } from 'lucide-react'

const STATUS_TABS: (BookingStatus | 'ALL')[] = ['ALL', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW']

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminBookingsPage({ searchParams }: Props) {
  const { status } = await searchParams
  const activeStatus = (status && status in BOOKING_STATUS) ? (status as BookingStatus) : 'ALL'

  const bookings = await db.booking.findMany({
    where: activeStatus === 'ALL' ? {} : { status: activeStatus },
    include: {
      guest: true,
      roomUnit: { include: { roomType: true } },
      ratePlan: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-semibold text-[#2C1A12]">Bookings</h1>
        <Link
          href="/admin/bookings/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5e1e12] text-white font-sans font-semibold text-sm rounded hover:bg-[#7a2a1c] transition-colors"
        >
          <Plus size={15} /> New Booking
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map(s => (
          <Link
            key={s}
            href={s === 'ALL' ? '/admin/bookings' : `/admin/bookings?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs font-sans font-semibold transition-colors ${
              activeStatus === s
                ? 'bg-[#5e1e12] text-white'
                : 'bg-white text-[#6D5840] border border-[#E5DDD3] hover:border-[#5e1e12]/40'
            }`}
          >
            {s === 'ALL' ? 'All' : s.replace('_', ' ')}
          </Link>
        ))}
      </div>

      <BookingsTable bookings={bookings.map(b => ({
        id:               b.id,
        confirmationCode: b.confirmationCode,
        status:           b.status,
        guestName:        b.guest.name,
        guestEmail:       b.guest.email,
        roomName:         b.roomUnit.roomType.displayName,
        unitNumber:       b.roomUnit.unitNumber,
        mealPlan:         b.ratePlan.mealPlan,
        checkIn:          b.checkIn.toISOString(),
        checkOut:         b.checkOut.toISOString(),
        numGuests:        b.numGuests,
        totalUsd:         Number(b.totalPriceUsd),
      }))} />
    </div>
  )
}
