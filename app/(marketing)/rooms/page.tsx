import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Users, Check } from 'lucide-react'
import { db } from '@/lib/db'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Rooms & Rates | ${SITE_NAME}`,
  description:
    'Choose from Deluxe Twin, Deluxe Double, Deluxe Triple, and Family rooms at Hotel Tamarind Tree. Bed & Breakfast and Half Board packages available.',
}

// Fetch room types with their rate plans from the database
async function getRoomTypes() {
  return db.roomType.findMany({
    include: {
      ratePlans: {
        where: { isVisible: true },
        orderBy: { priceUsd: 'asc' },
      },
      _count: { select: { units: true } },
    },
    orderBy: { displayName: 'asc' },
  })
}

const ROOM_FEATURES: Record<string, string[]> = {
  'deluxe-twin':   ['2 single beds', 'En-suite bathroom', 'Air conditioning', 'Free Wi-Fi', 'Wardrobe & mirror', 'Daily housekeeping'],
  'deluxe-double': ['1 double bed', 'En-suite bathroom', 'Air conditioning', 'Free Wi-Fi', 'Wardrobe & mirror', 'Daily housekeeping'],
  'deluxe-triple': ['3 single beds', 'En-suite bathroom', 'Air conditioning', 'Free Wi-Fi', 'Wardrobe & mirror', 'Daily housekeeping'],
  'family':        ['4 beds', 'En-suite bathroom', 'Air conditioning', 'Free Wi-Fi', 'Wardrobe & mirror', 'Extra seating area', 'Daily housekeeping'],
}

const ROOM_DESCRIPTIONS: Record<string, string> = {
  'deluxe-twin':
    'Thoughtfully designed for friends or colleagues, the Deluxe Twin features two comfortable single beds with warm Sri Lankan décor, a private en-suite bathroom, and everything you need for a restful stay after a day on safari.',
  'deluxe-double':
    'Our signature room for couples — a plush double bed, tasteful teak furnishings, and a private bathroom create a peaceful retreat in the heart of Tissamaharama.',
  'deluxe-triple':
    'Spacious and versatile, the Deluxe Triple is fitted with three single beds and a private bathroom, making it ideal for small families, a trio of friends, or those who simply like extra space.',
  'family':
    'Our largest room is built for families. Four beds, generous floor space, and all the comforts of home — giving you a relaxed base to plan your Yala safari and south coast adventures.',
}

const PLAN_LABELS: Record<string, { label: string; desc: string; color: string }> = {
  BB: { label: 'Bed & Breakfast', desc: 'Room + morning breakfast', color: 'bg-[#FAF7F2] text-[#5e1e12] border border-[#C9A96E]/30' },
  HB: { label: 'Half Board',      desc: 'Room + breakfast + lunch', color: 'bg-[#5e1e12]/5 text-[#5e1e12] border border-[#5e1e12]/20' },
}

export default async function RoomsPage() {
  const roomTypes = await getRoomTypes()

  return (
    <>
      {/* ── Page header ── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3d1209 0%, #5e1e12 50%, #6D5840 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #FAF7F2 1px, transparent 0)`, backgroundSize: '28px 28px' }}
          aria-hidden="true"
        />
        <div className="relative z-10 container-hotel text-center">
          <p className="text-label text-[#C9A96E] mb-3">Accommodation</p>
          <h1 className="text-display text-white mb-4">Rooms &amp; Rates</h1>
          <div className="w-16 h-0.5 bg-[#C9A96E] mx-auto mb-5" />
          <p className="max-w-xl mx-auto text-white/75 font-sans leading-relaxed">
            Twenty rooms across four categories, each designed with natural materials, warm tones, and everything you need for a comfortable stay in Sri Lanka&apos;s Deep South.
          </p>
        </div>
      </section>

      {/* ── Board plan legend ── */}
      <section className="bg-white border-b border-[#E5DDD3]">
        <div className="container-hotel py-6 flex flex-wrap gap-4 items-center">
          <span className="text-sm font-sans font-semibold text-[#2C1A12] mr-2">Board plans:</span>
          {Object.entries(PLAN_LABELS).map(([code, { label, desc }]) => (
            <div key={code} className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-sans font-bold text-[#5e1e12] bg-[#5e1e12]/10">{code}</span>
              <span className="text-sm text-[#5a3d2b]"><strong>{label}</strong> — {desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Room cards ── */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="container-hotel space-y-10">
          {roomTypes.map((room, idx: number) => {
            const features = ROOM_FEATURES[room.slug] ?? []
            const description = ROOM_DESCRIPTIONS[room.slug] ?? room.description ?? ''
            const bbPlan = room.ratePlans.find((p: { mealPlan: string }) => p.mealPlan === 'BB')
            const hbPlan = room.ratePlans.find((p: { mealPlan: string }) => p.mealPlan === 'HB')

            return (
              <article
                key={room.id}
                id={room.slug}
                className="bg-white rounded-xl border border-[#E5DDD3] overflow-hidden shadow-[0_2px_20px_rgba(94,30,18,0.06)] hover:shadow-[0_8px_40px_rgba(94,30,18,0.10)] transition-shadow duration-300"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${idx % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Image panel */}
                  <div
                    className={`relative min-h-72 lg:min-h-full bg-gradient-to-br from-[#5e1e12]/15 to-[#6D5840]/25 flex items-center justify-center ${idx % 2 === 1 ? 'lg:col-start-2' : ''}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <Users size={80} className="text-[#6D5840]" />
                    </div>
                    {/* Capacity badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                      <Users size={13} className="text-[#5e1e12]" />
                      <span className="text-xs font-sans font-semibold text-[#5e1e12]">Up to {room.maxOccupancy} guests</span>
                    </div>
                    {/* Room count */}
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#2C1A12]/70 backdrop-blur-sm rounded-full">
                      <span className="text-xs font-sans text-white/80">{room._count.units} rooms available</span>
                    </div>
                  </div>

                  {/* Content panel */}
                  <div className="p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#2C1A12] mb-3">{room.displayName}</h2>
                      <div className="w-10 h-0.5 bg-[#C9A96E] mb-5" />
                      <p className="text-[#5a3d2b]/80 font-sans leading-relaxed mb-6">{description}</p>

                      {/* Features */}
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-8">
                        {features.map(f => (
                          <li key={f} className="flex items-center gap-2 text-sm text-[#5a3d2b]">
                            <Check size={13} className="text-[#C9A96E] shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Rates + CTA */}
                    <div>
                      <div className="flex flex-wrap gap-3 mb-6">
                        {bbPlan && (
                          <div className="flex-1 min-w-32 rounded-lg border border-[#E5DDD3] p-4 bg-[#FAF7F2]">
                            <p className="text-xs font-sans font-semibold text-[#6D5840] mb-1">BB — Bed &amp; Breakfast</p>
                            <p className="font-serif text-2xl font-semibold text-[#5e1e12]">
                              ${Number(bbPlan.priceUsd).toFixed(0)}
                              <span className="text-sm font-sans font-normal text-[#6D5840]">/night</span>
                            </p>
                          </div>
                        )}
                        {hbPlan && (
                          <div className="flex-1 min-w-32 rounded-lg border border-[#5e1e12]/20 p-4 bg-[#5e1e12]/5">
                            <p className="text-xs font-sans font-semibold text-[#6D5840] mb-1">HB — Half Board</p>
                            <p className="font-serif text-2xl font-semibold text-[#5e1e12]">
                              ${Number(hbPlan.priceUsd).toFixed(0)}
                              <span className="text-sm font-sans font-normal text-[#6D5840]">/night</span>
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                      href={`/book?room=${room.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded bg-[#5e1e12] text-white font-sans font-semibold text-sm hover:bg-[#7a2a1c] hover:shadow-[0_4px_20px_rgba(94,30,18,0.35)] transition-all duration-200 group"
                        >
                          Book This Room
                          <ArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-1" />
                        </Link>
                        <Link
                      href={`/rooms/${room.slug}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded border border-[#5e1e12]/30 text-[#5e1e12] font-sans font-semibold text-sm hover:bg-[#5e1e12]/5 transition-colors duration-200"
                        >
                          Room Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── Policies strip ── */}
      <section className="bg-white border-t border-[#E5DDD3] py-10">
        <div className="container-hotel">
          <h2 className="font-serif text-lg font-semibold text-[#2C1A12] mb-5">Booking Policies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm font-sans text-[#5a3d2b]">
            <div>
              <p className="font-semibold text-[#2C1A12] mb-1">Check-in / Check-out</p>
              <p>Check-in from <strong>2:00 PM</strong></p>
              <p>Check-out by <strong>11:00 AM</strong></p>
            </div>
            <div>
              <p className="font-semibold text-[#2C1A12] mb-1">Children</p>
              <p>Children of all ages are welcome.</p>
              <p>Extra beds available on request.</p>
            </div>
            <div>
              <p className="font-semibold text-[#2C1A12] mb-1">Payments</p>
              <p>All major cards accepted.</p>
              <p>USD, LKR, and EUR accepted.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
