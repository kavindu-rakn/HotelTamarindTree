'use client'

import { useState, useTransition } from 'react'
import { formatDateShort, formatUSD } from '@/lib/utils'
import { BOOKING_STATUS_LABELS, BookingStatus } from '@/lib/constants'
import { confirmBooking, cancelBooking, checkInBooking, checkOutBooking, markNoShow } from './actions'
import { Check, X, LogIn, LogOut, UserX, Loader2 } from 'lucide-react'

interface BookingRow {
  id:               string
  confirmationCode: string
  status:           BookingStatus
  guestName:        string
  guestEmail:       string
  roomName:         string
  unitNumber:       string
  mealPlan:         string
  checkIn:          string
  checkOut:         string
  numGuests:        number
  totalUsd:         number
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING:     'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED:   'bg-green-50 text-green-700 border-green-200',
  CHECKED_IN:  'bg-blue-50 text-blue-700 border-blue-200',
  CHECKED_OUT: 'bg-gray-100 text-gray-600 border-gray-200',
  CANCELLED:   'bg-red-50 text-red-700 border-red-200',
  NO_SHOW:     'bg-red-50 text-red-700 border-red-200',
}

export default function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
  const [cancelTarget, setCancelTarget] = useState<BookingRow | null>(null)

  if (bookings.length === 0) {
    return <p className="text-sm text-[#6D5840] font-sans py-12 text-center">No bookings found.</p>
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E5DDD3] overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-[#E5DDD3] text-left text-xs text-[#6D5840] uppercase tracking-wider">
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <BookingRowItem key={b.id} booking={b} onRequestCancel={() => setCancelTarget(b)} />
            ))}
          </tbody>
        </table>
      </div>

      {cancelTarget && (
        <CancelModal booking={cancelTarget} onClose={() => setCancelTarget(null)} />
      )}
    </>
  )
}

function BookingRowItem({ booking, onRequestCancel }: { booking: BookingRow; onRequestCancel: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function run(action: () => Promise<void>) {
    setError('')
    startTransition(async () => {
      try {
        await action()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    })
  }

  return (
    <tr className="border-b border-[#E5DDD3] last:border-0 hover:bg-[#FAF7F2]/60">
      <td className="px-4 py-3">
        <p className="font-semibold text-[#2C1A12]">{booking.guestName}</p>
        <p className="text-xs text-[#6D5840]">{booking.guestEmail}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-[#2C1A12]">{booking.roomName}</p>
        <p className="text-xs text-[#6D5840]">Unit {booking.unitNumber} · {booking.mealPlan} · {booking.numGuests} guest{booking.numGuests !== 1 ? 's' : ''}</p>
      </td>
      <td className="px-4 py-3 text-xs text-[#5a3d2b]">
        {formatDateShort(booking.checkIn)} → {formatDateShort(booking.checkOut)}
      </td>
      <td className="px-4 py-3 text-[#2C1A12] font-semibold">{formatUSD(booking.totalUsd)}</td>
      <td className="px-4 py-3">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[booking.status]}`}>
          {BOOKING_STATUS_LABELS[booking.status]}
        </span>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </td>
      <td className="px-4 py-3 font-mono text-xs text-[#5e1e12]">{booking.confirmationCode}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1.5">
          {isPending && <Loader2 size={14} className="animate-spin text-[#6D5840]" />}
          {!isPending && booking.status === 'PENDING' && (
            <>
              <ActionButton title="Confirm" onClick={() => run(() => confirmBooking(booking.id))} icon={Check} className="text-green-700 hover:bg-green-50" />
              <ActionButton title="Cancel" onClick={onRequestCancel} icon={X} className="text-red-600 hover:bg-red-50" />
            </>
          )}
          {!isPending && booking.status === 'CONFIRMED' && (
            <>
              <ActionButton title="Check In" onClick={() => run(() => checkInBooking(booking.id))} icon={LogIn} className="text-blue-700 hover:bg-blue-50" />
              <ActionButton title="No-show" onClick={() => run(() => markNoShow(booking.id))} icon={UserX} className="text-amber-700 hover:bg-amber-50" />
              <ActionButton title="Cancel" onClick={onRequestCancel} icon={X} className="text-red-600 hover:bg-red-50" />
            </>
          )}
          {!isPending && booking.status === 'CHECKED_IN' && (
            <ActionButton title="Check Out" onClick={() => run(() => checkOutBooking(booking.id))} icon={LogOut} className="text-gray-700 hover:bg-gray-100" />
          )}
        </div>
      </td>
    </tr>
  )
}

function ActionButton({ title, onClick, icon: Icon, className }: { title: string; onClick: () => void; icon: typeof Check; className: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg border border-transparent transition-colors ${className}`}
    >
      <Icon size={14} />
    </button>
  )
}

function CancelModal({ booking, onClose }: { booking: BookingRow; onClose: () => void }) {
  const [reason, setReason] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleCancel() {
    setError('')
    startTransition(async () => {
      try {
        await cancelBooking(booking.id, reason)
        onClose()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="font-serif text-lg font-semibold text-[#2C1A12] mb-1">Cancel Booking</h3>
        <p className="text-sm text-[#6D5840] font-sans mb-4">
          {booking.guestName} · {booking.confirmationCode}
        </p>
        <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-2 uppercase tracking-wider">Reason (optional)</label>
        <textarea
          rows={3}
          value={reason}
          onChange={e => setReason(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#5e1e12]/30"
        />
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm font-sans font-semibold text-[#6D5840] hover:bg-[#FAF7F2] rounded-lg">
            Keep Booking
          </button>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="px-4 py-2 bg-red-600 text-white text-sm font-sans font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  )
}
