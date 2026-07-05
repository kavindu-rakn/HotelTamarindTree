import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Users, Check } from 'lucide-react'
import { db } from '@/lib/db'
import { enumToUrlSlug, getRoomImagePath } from '@/lib/utils'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Rooms & Rates | ${SITE_NAME}`,
  description:
    'Choose from Deluxe Twin, Deluxe Double, Deluxe Triple, and Family rooms at Hotel Tamarind Tree. Bed & Breakfast and Half Board packages available.',
}

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
  'family':        ['4 beds', 'En-suite bathroom', 'Air conditioning', 'Free Wi-Fi', 'Wardrobe & mirror', 'Seating area', 'Daily housekeeping'],
}

const ROOM_DESCRIPTIONS: Record<string, string> = {
  'deluxe-twin':
    'Two comfortable beds in a stylishly appointed room — perfect for friends or colleagues exploring southern Sri Lanka and Yala National Park.',
  'deluxe-double':
    'A romantic retreat with a plush double bed, warm teak accents, and a private en-suite — just minutes from Yala.',
  'deluxe-triple':
    'Spacious and versatile with three beds — ideal for families or a trio of safari adventurers who want room to breathe.',
  'family':
    'Generous floor space, four beds, and all the comforts of home — designed for families who explore together.',
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
        <div className="container-hotel py-5 flex flex-wrap gap-x-8 gap-y-2 items-center">
          <span className="text-sm font-sans font-semibold text-[#2C1A12]">Board plans:</span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold text-[#5e1e12] bg-[#5e1e12]/10">BB</span>
            <span className="text-sm text-[#5a3d2b]"><strong>Bed &amp; Breakfast</strong> — room + morning breakfast</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold text-[#5e1e12] bg-[#5e1e12]/10">HB</span>
            <span className="text-sm text-[#5a3d2b]"><strong>Half Board</strong> — room + breakfast + lunch</span>
          </div>
        </div>
      </section>

      {/* ── Room cards ── */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="container-hotel space-y-10">
          {roomTypes.map((room, idx: number) => {
            const urlSlug = enumToUrlSlug(room.slug) ?? 'family'
            const features = ROOM_FEATURES[urlSlug] ?? []
            const description = ROOM_DESCRIPTIONS[urlSlug] ?? room.description ?? ''
            const bbPlan = room.ratePlans.find((p: { mealPlan: string }) => p.mealPlan === 'BB')
            const hbPlan = room.ratePlans.find((p: { mealPlan: string }) => p.mealPlan === 'HB')
            const imagePath = getRoomImagePath(urlSlug)

            return (
              <article
                key={room.id}
                id={urlSlug}
                className="bg-white rounded-xl border border-[#E5DDD3] overflow-hidden shadow-[0_2px_20px_rgba(94,30,18,0.06)] hover:shadow-[0_8px_40px_rgba(94,30,18,0.10)] transition-shadow duration-300"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${idx % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Image panel */}
                  <div className={`relative min-h-72 lg:min-h-full ${idx % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <Image
                      src={imagePath}
                      alt={`${room.displayName} at Hotel Tamarind Tree`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {/* Capacity badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                      <Users size={13} className="text-[#5e1e12]" />
                      <span className="text-xs font-sans font-semibold text-[#5e1e12]">Up to {room.maxOccupancy} guests</span>
                    </div>
                    {/* Room count */}
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#2C1A12]/70 backdrop-blur-sm rounded-full">
                      <span className="text-xs font-sans text-white/90">{room._count.units} rooms available</span>
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
                          href={`/book?room=${urlSlug}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded bg-[#5e1e12] text-white font-sans font-semibold text-sm hover:bg-[#7a2a1c] hover:shadow-[0_4px_20px_rgba(94,30,18,0.35)] transition-all duration-200 group"
                        >
                          Book This Room
                          <ArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-1" />
                        </Link>
                        <Link
                          href={`/rooms/${urlSlug}`}
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
              <p>Children of all ages welcome.</p>
              <p>Extra beds on request.</p>
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
