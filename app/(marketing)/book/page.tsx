'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  CalendarDays, Users, ChevronRight, ChevronLeft, Loader2,
  BedDouble, Check, AlertCircle, ArrowRight,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────

interface RateOption {
  id:           string
  pricePerNight: number
  totalUsd:     number
}

interface AvailableRoom {
  id:           string
  slug:         string
  displayName:  string
  maxOccupancy: number
  bedConfig:    string
  imagePath:    string
  nights:       number
  rates: {
    BB: RateOption | null
    HB: RateOption | null
  }
}

type MealPlan = 'BB' | 'HB'
type Step = 1 | 2 | 3

// ─── Helpers ─────────────────────────────────────────────────────────────

function today()    { return new Date().toISOString().slice(0, 10) }
function tomorrow() {
  const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10)
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Step Indicator ──────────────────────────────────────────────────────

function StepIndicator({ step }: { step: Step }) {
  const steps = ['Dates & Guests', 'Select Room', 'Your Details']
  return (
    <div className="flex items-center gap-0 mb-10">
      {steps.map((label, i) => {
        const s = (i + 1) as Step
        const active    = s === step
        const completed = s < step
        return (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold font-sans transition-all ${
                completed ? 'bg-[#5e1e12] text-white' : active ? 'bg-[#5e1e12] text-white ring-4 ring-[#5e1e12]/20' : 'bg-[#E5DDD3] text-[#6D5840]'
              }`}>
                {completed ? <Check size={14} /> : s}
              </div>
              <span className={`text-xs font-sans whitespace-nowrap hidden sm:block ${active ? 'text-[#5e1e12] font-semibold' : 'text-[#6D5840]'}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-colors ${completed ? 'bg-[#5e1e12]' : 'bg-[#E5DDD3]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────

export default function BookPage() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  // Step
  const [step, setStep]   = useState<Step>(1)

  // Step 1 — search
  const [checkIn,  setCheckIn]  = useState(today())
  const [checkOut, setCheckOut] = useState(tomorrow())
  const [guests,   setGuests]   = useState(2)

  // Step 2 — room selection
  const [rooms,         setRooms]         = useState<AvailableRoom[]>([])
  const [loading,       setLoading]       = useState(false)
  const [searchError,   setSearchError]   = useState('')
  const [selectedRoom,  setSelectedRoom]  = useState<AvailableRoom | null>(null)
  const [selectedPlan,  setSelectedPlan]  = useState<MealPlan>('BB')

  // Step 3 — guest details
  const [firstName,    setFirstName]    = useState('')
  const [lastName,     setLastName]     = useState('')
  const [email,        setEmail]        = useState('')
  const [phone,        setPhone]        = useState('')
  const [specialReqs,  setSpecialReqs]  = useState('')
  const [submitting,   setSubmitting]   = useState(false)
  const [submitError,  setSubmitError]  = useState('')

  // Pre-fill room slug from URL (e.g. /book?room=deluxe-twin)
  const prefilledRoom = searchParams.get('room')

  // Auto-search if arriving from a room card with dates set
  const searchAvailability = useCallback(async () => {
    setLoading(true)
    setSearchError('')
    setRooms([])
    try {
      const res = await fetch(`/api/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)
      const data = await res.json()
      if (!res.ok) { setSearchError(data.error ?? 'Search failed'); return }
      setRooms(data.results)
      if (data.results.length === 0) {
        setSearchError('No rooms available for these dates. Try different dates or contact us directly.')
        return
      }
      setStep(2)
      // Auto-select if coming from a room card
      if (prefilledRoom) {
        const match = data.results.find((r: AvailableRoom) => r.slug === prefilledRoom)
        if (match) setSelectedRoom(match)
      }
    } catch {
      setSearchError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [checkIn, checkOut, guests, prefilledRoom])

  // Ensure checkout is always after checkin
  useEffect(() => {
    if (checkOut <= checkIn) {
      const d = new Date(checkIn); d.setDate(d.getDate() + 1)
      setCheckOut(d.toISOString().slice(0, 10))
    }
  }, [checkIn, checkOut])

  const nights = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)

  const selectedRate = selectedRoom?.rates[selectedPlan] ?? null

  async function handlePay() {
    if (!selectedRoom || !selectedRate) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/bookings/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomSlug:       selectedRoom.slug,
          mealPlan:       selectedPlan,
          checkIn,
          checkOut,
          numGuests:      guests,
          firstName,
          lastName,
          email,
          phone,
          specialRequests: specialReqs,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setSubmitError(data.error ?? 'Something went wrong'); return }
      router.push(data.url) // redirect to Stripe
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* ── Page header ── */}
      <section
        className="relative pt-32 pb-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3d1209 0%, #5e1e12 50%, #6D5840 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #FAF7F2 1px, transparent 0)`, backgroundSize: '28px 28px' }} aria-hidden="true" />
        <div className="relative z-10 container-hotel text-center">
          <p className="text-label text-[#C9A96E] mb-3">Reservations</p>
          <h1 className="text-display text-white mb-4">Book Your Stay</h1>
          <div className="w-16 h-0.5 bg-[#C9A96E] mx-auto" />
        </div>
      </section>

      {/* ── Main booking area ── */}
      <section className="py-14 bg-[#FAF7F2] min-h-screen">
        <div className="container-hotel max-w-4xl">
          <StepIndicator step={step} />

          {/* ═══════════════ STEP 1 — Dates & Guests ═══════════════ */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-[#E5DDD3] shadow-[0_2px_20px_rgba(94,30,18,0.06)] p-8 md:p-10">
              <h2 className="font-serif text-2xl font-semibold text-[#2C1A12] mb-2">When are you visiting?</h2>
              <p className="text-sm text-[#6D5840] font-sans mb-8">Choose your dates and we&apos;ll show you what&apos;s available.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Check-in */}
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-2 uppercase tracking-wider">
                    <CalendarDays size={12} className="inline mr-1" /> Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today()}
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-[#2C1A12] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#5e1e12]/30 focus:border-[#5e1e12] transition-colors"
                  />
                </div>
                {/* Check-out */}
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-2 uppercase tracking-wider">
                    <CalendarDays size={12} className="inline mr-1" /> Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-[#2C1A12] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#5e1e12]/30 focus:border-[#5e1e12] transition-colors"
                  />
                </div>
                {/* Guests */}
                <div>
                  <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-2 uppercase tracking-wider">
                    <Users size={12} className="inline mr-1" /> Guests
                  </label>
                  <select
                    value={guests}
                    onChange={e => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-[#2C1A12] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#5e1e12]/30 focus:border-[#5e1e12] transition-colors"
                  >
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {nights > 0 && (
                <p className="text-sm text-[#6D5840] font-sans mb-6">
                  <span className="font-semibold text-[#2C1A12]">{nights} night{nights > 1 ? 's' : ''}</span>
                  {' '}— {formatDate(checkIn)} to {formatDate(checkOut)}
                </p>
              )}

              {searchError && (
                <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-sans">{searchError}</p>
                </div>
              )}

              <button
                onClick={searchAvailability}
                disabled={loading || nights < 1}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#5e1e12] text-white font-sans font-semibold text-sm rounded hover:bg-[#7a2a1c] hover:shadow-[0_4px_20px_rgba(94,30,18,0.35)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <CalendarDays size={16} />}
                {loading ? 'Searching…' : 'Check Availability'}
              </button>
            </div>
          )}

          {/* ═══════════════ STEP 2 — Room Selection ═══════════════ */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#2C1A12]">Available Rooms</h2>
                  <p className="text-sm text-[#6D5840] font-sans mt-1">
                    {nights} night{nights > 1 ? 's' : ''} · {formatDate(checkIn)} → {formatDate(checkOut)} · {guests} guest{guests > 1 ? 's' : ''}
                  </p>
                </div>
                <button onClick={() => setStep(1)} className="inline-flex items-center gap-1 text-sm text-[#5e1e12] font-sans hover:underline">
                  <ChevronLeft size={14} /> Change dates
                </button>
              </div>

              <div className="space-y-5">
                {rooms.map(room => (
                  <article
                    key={room.id}
                    className={`bg-white rounded-xl border overflow-hidden shadow-sm transition-all duration-200 ${
                      selectedRoom?.id === room.id
                        ? 'border-[#5e1e12] shadow-[0_0_0_3px_rgba(94,30,18,0.12)]'
                        : 'border-[#E5DDD3] hover:shadow-md hover:border-[#5e1e12]/40'
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-0">
                      {/* Image */}
                      <div className="relative h-48 sm:h-full">
                        <Image src={room.imagePath} alt={room.displayName} fill className="object-cover" sizes="220px" />
                      </div>
                      {/* Content */}
                      <div className="p-6 flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <h3 className="font-serif text-xl font-semibold text-[#2C1A12]">{room.displayName}</h3>
                            <div className="flex items-center gap-1 text-xs text-[#6D5840] font-sans">
                              <BedDouble size={13} className="text-[#5e1e12]" />
                              {room.bedConfig} · max {room.maxOccupancy} guests
                            </div>
                          </div>

                          {/* Board plan toggle */}
                          <div className="flex gap-2 mt-4">
                            {(['BB', 'HB'] as MealPlan[]).map(plan => {
                              const rate = room.rates[plan]
                              if (!rate) return null
                              const active = selectedRoom?.id === room.id && selectedPlan === plan
                              return (
                                <button
                                  key={plan}
                                  onClick={() => { setSelectedRoom(room); setSelectedPlan(plan) }}
                                  className={`flex-1 text-left rounded-lg border px-4 py-3 transition-all duration-150 ${
                                    active
                                      ? 'border-[#5e1e12] bg-[#5e1e12]/5'
                                      : 'border-[#E5DDD3] hover:border-[#5e1e12]/40'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div>
                                      <span className={`text-xs font-sans font-bold px-1.5 py-0.5 rounded ${active ? 'bg-[#5e1e12] text-white' : 'bg-[#E5DDD3] text-[#5e1e12]'}`}>{plan}</span>
                                      <p className="text-xs text-[#6D5840] font-sans mt-1">
                                        {plan === 'BB' ? 'Bed & Breakfast' : 'Half Board'}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-serif text-lg font-semibold text-[#5e1e12]">${rate.pricePerNight}<span className="text-xs font-sans font-normal text-[#6D5840]">/night</span></p>
                                      <p className="text-xs text-[#6D5840] font-sans">Total: ${rate.totalUsd}</p>
                                    </div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        <button
                          onClick={() => { setSelectedRoom(room); setStep(3) }}
                          className="self-start inline-flex items-center gap-2 px-6 py-3 bg-[#5e1e12] text-white font-sans font-semibold text-sm rounded hover:bg-[#7a2a1c] transition-all duration-200 group"
                        >
                          Select This Room
                          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════ STEP 3 — Guest Details ═══════════════ */}
          {step === 3 && selectedRoom && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setStep(2)} className="inline-flex items-center gap-1 text-sm text-[#5e1e12] font-sans hover:underline">
                    <ChevronLeft size={14} /> Back
                  </button>
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-[#2C1A12]">Your Details</h2>
                    <p className="text-sm text-[#6D5840] font-sans">Complete your reservation — you&apos;ll be redirected to Stripe to pay.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#E5DDD3] shadow-[0_2px_20px_rgba(94,30,18,0.06)] p-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-2 uppercase tracking-wider">First Name *</label>
                      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-[#2C1A12] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#5e1e12]/30 focus:border-[#5e1e12] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-2 uppercase tracking-wider">Last Name *</label>
                      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-[#2C1A12] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#5e1e12]/30 focus:border-[#5e1e12] transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-2 uppercase tracking-wider">Email Address *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-[#2C1A12] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#5e1e12]/30 focus:border-[#5e1e12] transition-colors" />
                    <p className="text-xs text-[#6D5840] font-sans mt-1">Your booking confirmation will be sent here.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-2 uppercase tracking-wider">Phone Number</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 890"
                      className="w-full px-4 py-3 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-[#2C1A12] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#5e1e12]/30 focus:border-[#5e1e12] transition-colors placeholder-[#6D5840]/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-2 uppercase tracking-wider">Special Requests</label>
                    <textarea rows={3} value={specialReqs} onChange={e => setSpecialReqs(e.target.value)}
                      placeholder="Early check-in, extra pillows, dietary requirements, etc."
                      className="w-full px-4 py-3 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-[#2C1A12] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#5e1e12]/30 focus:border-[#5e1e12] transition-colors resize-none placeholder-[#6D5840]/40" />
                  </div>

                  {submitError && (
                    <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 font-sans">{submitError}</p>
                    </div>
                  )}

                  <button
                    onClick={handlePay}
                    disabled={submitting || !firstName || !lastName || !email}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#5e1e12] text-white font-sans font-semibold text-sm rounded hover:bg-[#7a2a1c] hover:shadow-[0_4px_20px_rgba(94,30,18,0.35)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    {submitting ? 'Redirecting to Stripe…' : `Pay USD $${selectedRate?.totalUsd?.toFixed(2)} Securely`}
                  </button>
                  <p className="text-xs text-center text-[#6D5840] font-sans">🔒 Secure payment powered by Stripe. Your card details are never stored on our servers.</p>
                </div>
              </div>

              {/* Summary sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white rounded-xl border border-[#E5DDD3] shadow-[0_4px_24px_rgba(94,30,18,0.08)] overflow-hidden">
                  <div className="relative h-36">
                    <Image src={selectedRoom.imagePath} alt={selectedRoom.displayName} fill className="object-cover" sizes="300px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <p className="absolute bottom-3 left-3 font-serif text-white font-semibold text-lg">{selectedRoom.displayName}</p>
                  </div>
                  <div className="p-5 space-y-3 text-sm font-sans">
                    <div className="flex justify-between text-[#5a3d2b]">
                      <span>Board plan</span>
                      <span className="font-semibold">{selectedPlan === 'BB' ? 'Bed & Breakfast' : 'Half Board'}</span>
                    </div>
                    <div className="flex justify-between text-[#5a3d2b]">
                      <span>Check-in</span>
                      <span className="font-semibold">{formatDate(checkIn)}</span>
                    </div>
                    <div className="flex justify-between text-[#5a3d2b]">
                      <span>Check-out</span>
                      <span className="font-semibold">{formatDate(checkOut)}</span>
                    </div>
                    <div className="flex justify-between text-[#5a3d2b]">
                      <span>Nights</span>
                      <span className="font-semibold">{nights}</span>
                    </div>
                    <div className="flex justify-between text-[#5a3d2b]">
                      <span>Guests</span>
                      <span className="font-semibold">{guests}</span>
                    </div>
                    <div className="flex justify-between text-[#5a3d2b]">
                      <span>Rate</span>
                      <span className="font-semibold">${selectedRate?.pricePerNight}/night</span>
                    </div>
                    <div className="border-t border-[#E5DDD3] pt-3 flex justify-between items-center">
                      <span className="font-semibold text-[#2C1A12]">Total</span>
                      <span className="font-serif text-xl font-semibold text-[#5e1e12]">USD ${selectedRate?.totalUsd?.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-[#6D5840]">✓ Best rate — book direct</p>
                    <p className="text-xs text-[#6D5840]">✓ Secure payment via Stripe</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
