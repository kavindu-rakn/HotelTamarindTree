import Link from 'next/link'
import { db } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { Clock, LogIn, LogOut, Mail, ArrowRight } from 'lucide-react'

function startOfToday() {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  return d
}
function endOfToday() {
  const d = startOfToday()
  d.setUTCDate(d.getUTCDate() + 1)
  return d
}

export default async function AdminOverviewPage() {
  const today = startOfToday()
  const tomorrow = endOfToday()

  const [pendingCount, arrivalsToday, departuresToday, unreadInquiries, totalUnits, occupiedTonight, recentPending] =
    await Promise.all([
      db.booking.count({ where: { status: 'PENDING' } }),
      db.booking.findMany({
        where: { status: 'CONFIRMED', checkIn: { gte: today, lt: tomorrow } },
        include: { guest: true, roomUnit: { include: { roomType: true } } },
        orderBy: { checkIn: 'asc' },
      }),
      db.booking.findMany({
        where: { status: 'CHECKED_IN', checkOut: { gte: today, lt: tomorrow } },
        include: { guest: true, roomUnit: { include: { roomType: true } } },
        orderBy: { checkOut: 'asc' },
      }),
      db.inquiry.count({ where: { isRead: false } }),
      db.roomUnit.count({ where: { isActive: true } }),
      db.booking.count({
        where: {
          status: { in: ['CONFIRMED', 'CHECKED_IN'] },
          checkIn: { lte: today },
          checkOut: { gt: today },
        },
      }),
      db.booking.findMany({
        where: { status: 'PENDING' },
        include: { guest: true, ratePlan: { include: { roomType: true } } },
        orderBy: { createdAt: 'asc' },
        take: 5,
      }),
    ])

  const occupancyPct = totalUnits > 0 ? Math.round((occupiedTonight / totalUnits) * 100) : 0

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-[#2C1A12] mb-1">Overview</h1>
      <p className="text-sm text-[#6D5840] font-sans mb-8">{formatDate(new Date())}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Pending Requests" value={pendingCount} href="/admin/bookings?status=PENDING" />
        <StatCard label="Arrivals Today" value={arrivalsToday.length} />
        <StatCard label="Departures Today" value={departuresToday.length} />
        <StatCard label="Occupancy Tonight" value={`${occupancyPct}%`} sub={`${occupiedTonight}/${totalUnits} rooms`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending requests */}
        <div className="bg-white rounded-xl border border-[#E5DDD3] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold text-[#2C1A12] flex items-center gap-2">
              <Clock size={16} className="text-[#C9A96E]" /> Awaiting Confirmation
            </h2>
            <Link href="/admin/bookings?status=PENDING" className="text-xs font-sans font-semibold text-[#5e1e12] flex items-center gap-1 hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentPending.length === 0 ? (
            <p className="text-sm text-[#6D5840] font-sans">No pending requests.</p>
          ) : (
            <ul className="space-y-3">
              {recentPending.map(b => (
                <li key={b.id} className="flex items-center justify-between text-sm font-sans">
                  <div>
                    <p className="font-semibold text-[#2C1A12]">{b.guest.name}</p>
                    <p className="text-xs text-[#6D5840]">{b.ratePlan.roomType.displayName} · {formatDate(b.checkIn)}</p>
                  </div>
                  <span className="text-xs font-mono text-[#5e1e12]">{b.confirmationCode}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Today's movement */}
        <div className="bg-white rounded-xl border border-[#E5DDD3] p-6">
          <h2 className="font-serif text-lg font-semibold text-[#2C1A12] mb-4 flex items-center gap-2">
            <LogIn size={16} className="text-[#C9A96E]" /> Today&apos;s Arrivals &amp; Departures
          </h2>
          {arrivalsToday.length === 0 && departuresToday.length === 0 ? (
            <p className="text-sm text-[#6D5840] font-sans">Nothing scheduled today.</p>
          ) : (
            <ul className="space-y-3">
              {arrivalsToday.map(b => (
                <li key={b.id} className="flex items-center gap-3 text-sm font-sans">
                  <LogIn size={14} className="text-green-600 shrink-0" />
                  <span className="text-[#2C1A12] font-semibold">{b.guest.name}</span>
                  <span className="text-xs text-[#6D5840]">{b.roomUnit.roomType.displayName} · Unit {b.roomUnit.unitNumber}</span>
                </li>
              ))}
              {departuresToday.map(b => (
                <li key={b.id} className="flex items-center gap-3 text-sm font-sans">
                  <LogOut size={14} className="text-amber-600 shrink-0" />
                  <span className="text-[#2C1A12] font-semibold">{b.guest.name}</span>
                  <span className="text-xs text-[#6D5840]">{b.roomUnit.roomType.displayName} · Unit {b.roomUnit.unitNumber}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {unreadInquiries > 0 && (
        <Link
          href="/admin/inquiries"
          className="mt-6 flex items-center justify-between bg-[#5e1e12]/5 border border-[#5e1e12]/20 rounded-xl p-5 hover:bg-[#5e1e12]/10 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-sans font-semibold text-[#5e1e12]">
            <Mail size={16} /> {unreadInquiries} unread contact {unreadInquiries === 1 ? 'inquiry' : 'inquiries'}
          </span>
          <ArrowRight size={14} className="text-[#5e1e12]" />
        </Link>
      )}
    </div>
  )
}

function StatCard({ label, value, sub, href }: { label: string; value: string | number; sub?: string; href?: string }) {
  const content = (
    <div className="bg-white rounded-xl border border-[#E5DDD3] p-5">
      <p className="text-xs font-sans font-semibold text-[#6D5840] uppercase tracking-wider mb-2">{label}</p>
      <p className="font-serif text-3xl font-semibold text-[#2C1A12]">{value}</p>
      {sub && <p className="text-xs text-[#6D5840] font-sans mt-1">{sub}</p>}
    </div>
  )
  return href ? <Link href={href}>{content}</Link> : content
}
