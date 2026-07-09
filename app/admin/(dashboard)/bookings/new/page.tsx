'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle, Search } from 'lucide-react'
import { createManualBooking } from '../actions'

interface RateOption { id: string; pricePerNight: number; totalUsd: number }
interface AvailableRoom {
  slug: string
  displayName: string
  maxOccupancy: number
  bedConfig: string
  rates: { BB: RateOption | null; HB: RateOption | null }
}

function today() { return new Date().toISOString().slice(0, 10) }
function tomorrow() { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10) }

export default function NewBookingPage() {
  const router = useRouter()
  const [checkIn, setCheckIn]   = useState(today())
  const [checkOut, setCheckOut] = useState(tomorrow())
  const [guests, setGuests]     = useState(2)

  const [rooms, setRooms] = useState<AvailableRoom[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const [selectedRoom, setSelectedRoom] = useState<AvailableRoom | null>(null)
  const [mealPlan, setMealPlan] = useState<'BB' | 'HB'>('BB')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [phone, setPhone]         = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  const [isPending, startTransition] = useTransition()
  const [submitError, setSubmitError] = useState('')

  async function search() {
    setSearching(true)
    setSearchError('')
    setRooms([])
    setSelectedRoom(null)
    try {
      const res = await fetch(`/api/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)
      const data = await res.json()
      if (!res.ok) { setSearchError(data.error ?? 'Search failed'); return }
      setRooms(data.results)
      if (data.results.length === 0) setSearchError('No rooms available for these dates.')
    } catch {
      setSearchError('Network error.')
    } finally {
      setSearching(false)
    }
  }

  const selectedRate = selectedRoom?.rates[mealPlan] ?? null

  function handleSubmit() {
    if (!selectedRoom || !firstName || !lastName || !email) return
    setSubmitError('')
    startTransition(async () => {
      try {
        await createManualBooking({
          roomSlug: selectedRoom.slug,
          mealPlan,
          checkIn,
          checkOut,
          numGuests: guests,
          firstName,
          lastName,
          email,
          phone,
          specialRequests,
        })
        router.push('/admin/bookings')
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
      }
    })
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold text-[#2C1A12] mb-6">New Booking</h1>

      <div className="bg-white rounded-xl border border-[#E5DDD3] p-6 mb-6">
        <h2 className="font-serif text-lg font-semibold text-[#2C1A12] mb-4">Dates &amp; Guests</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-1.5 uppercase tracking-wider">Check-in</label>
            <input type="date" value={checkIn} min={today()} onChange={e => setCheckIn(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-sm font-sans" />
          </div>
          <div>
            <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-1.5 uppercase tracking-wider">Check-out</label>
            <input type="date" value={checkOut} min={checkIn} onChange={e => setCheckOut(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-sm font-sans" />
          </div>
          <div>
            <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-1.5 uppercase tracking-wider">Guests</label>
            <select value={guests} onChange={e => setGuests(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-sm font-sans">
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={search}
          disabled={searching}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#5e1e12] text-white text-sm font-sans font-semibold rounded hover:bg-[#7a2a1c] disabled:opacity-50"
        >
          {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          Check Availability
        </button>
        {searchError && (
          <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={14} className="text-red-500" />
            <p className="text-sm text-red-700 font-sans">{searchError}</p>
          </div>
        )}
      </div>

      {rooms.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E5DDD3] p-6 mb-6">
          <h2 className="font-serif text-lg font-semibold text-[#2C1A12] mb-4">Select Room</h2>
          <div className="space-y-3">
            {rooms.map(room => (
              <div key={room.slug} className={`rounded-lg border p-4 ${selectedRoom?.slug === room.slug ? 'border-[#5e1e12]' : 'border-[#E5DDD3]'}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-[#2C1A12] font-sans">{room.displayName}</p>
                  <p className="text-xs text-[#6D5840] font-sans">{room.bedConfig} · max {room.maxOccupancy}</p>
                </div>
                <div className="flex gap-2">
                  {(['BB', 'HB'] as const).map(plan => {
                    const rate = room.rates[plan]
                    if (!rate) return null
                    const active = selectedRoom?.slug === room.slug && mealPlan === plan
                    return (
                      <button
                        key={plan}
                        onClick={() => { setSelectedRoom(room); setMealPlan(plan) }}
                        className={`flex-1 text-left px-3 py-2 rounded-lg border text-sm font-sans ${active ? 'border-[#5e1e12] bg-[#5e1e12]/5' : 'border-[#E5DDD3]'}`}
                      >
                        <span className="font-semibold">{plan}</span> — ${rate.pricePerNight}/night (${rate.totalUsd} total)
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedRoom && (
        <div className="bg-white rounded-xl border border-[#E5DDD3] p-6">
          <h2 className="font-serif text-lg font-semibold text-[#2C1A12] mb-4">Guest Details</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-sm font-sans" />
            <input placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-sm font-sans" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-sm font-sans" />
            <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-sm font-sans" />
          </div>
          <textarea placeholder="Special requests" rows={2} value={specialRequests} onChange={e => setSpecialRequests(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-sm font-sans mb-4" />

          {submitError && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={14} className="text-red-500" />
              <p className="text-sm text-red-700 font-sans">{submitError}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isPending || !firstName || !lastName || !email}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5e1e12] text-white text-sm font-sans font-semibold rounded hover:bg-[#7a2a1c] disabled:opacity-50"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Create Booking {selectedRate ? `— $${selectedRate.totalUsd.toFixed(2)}` : ''}
          </button>
        </div>
      )}
    </div>
  )
}
