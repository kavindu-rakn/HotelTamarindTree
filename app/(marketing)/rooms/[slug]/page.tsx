import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Users, BedDouble } from 'lucide-react'
import { db } from '@/lib/db'
import { SITE_NAME } from '@/lib/constants'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const rooms = await db.roomType.findMany({ select: { slug: true } })
  return rooms.map((r: { slug: string }) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const room = await db.roomType.findUnique({
    where: { slug: slug as 'DELUXE_TWIN' | 'DELUXE_DOUBLE' | 'DELUXE_TRIPLE' | 'FAMILY' },
    include: {
      ratePlans: {
        where: { isVisible: true },
        orderBy: { priceUsd: 'asc' },
      },
    },
  })
  if (!room) return {}
  return {
    title: `${room.displayName} | ${SITE_NAME}`,
    description: `Book the ${room.displayName} at Hotel Tamarind Tree, Tissamaharama. ${room.description ?? ''}`,
  }
}

const ROOM_FEATURES: Record<string, string[]> = {
  'deluxe-twin':   ['2 single beds', 'En-suite bathroom', 'Air conditioning', 'Free Wi-Fi', 'Wardrobe & mirror', 'Daily housekeeping', 'Hot & cold water', 'Writing desk'],
  'deluxe-double': ['1 double bed', 'En-suite bathroom', 'Air conditioning', 'Free Wi-Fi', 'Wardrobe & mirror', 'Daily housekeeping', 'Hot & cold water', 'Writing desk'],
  'deluxe-triple': ['3 single beds', 'En-suite bathroom', 'Air conditioning', 'Free Wi-Fi', 'Wardrobe & mirror', 'Daily housekeeping', 'Hot & cold water', 'Extra storage'],
  'family':        ['4 beds', 'En-suite bathroom', 'Air conditioning', 'Free Wi-Fi', 'Wardrobe & mirror', 'Daily housekeeping', 'Hot & cold water', 'Seating area', 'Child-friendly layout'],
}

const ROOM_LONG_DESCRIPTIONS: Record<string, string[]> = {
  'deluxe-twin': [
    'Designed with a thoughtful layout for two guests travelling together, the Deluxe Twin room features two comfortable single beds dressed in crisp white linens, accented by warm Sri Lankan batik textiles and teak wood furniture.',
    'A private en-suite bathroom comes fully equipped, and the room is kept cool and comfortable with air conditioning throughout the day and night — essential after long hours exploring Yala National Park.',
    'The Deluxe Twin is located on the ground floor and enjoys easy garden access, making it the most convenient choice for safari mornings when early departures are key.',
  ],
  'deluxe-double': [
    'The Deluxe Double is our most popular room — a serene retreat for couples. A generous double bed sits at the heart of the room, framed by warm earthy tones and hand-crafted Sri Lankan decorative accents.',
    'The private en-suite bathroom offers hot and cold water, and the room is kept pleasantly cool with air conditioning. Soft lighting and a writing desk complete the picture for a relaxed, unhurried stay.',
    'Ideal for a romantic getaway or a quiet retreat, the Deluxe Double puts you just minutes from the Tissamaharama tank and the gateway to the famed Yala National Park.',
  ],
  'deluxe-triple': [
    'The Deluxe Triple is built for three — whether it\'s a family of three, a group of friends, or simply guests who prefer the extra space. Three comfortable single beds are arranged spaciously, with ample storage and natural light.',
    'All the comforts of a Deluxe room are present: private en-suite bathroom, air conditioning, free Wi-Fi, and daily housekeeping. The Triple configuration also makes it the most versatile room for guests with varying needs.',
    'Located in a quiet wing of the hotel, the Deluxe Triple offers a peaceful night\'s rest after the day\'s adventures.',
  ],
  'family': [
    'Our largest and most feature-rich room, the Family Room is designed to accommodate four guests in comfort. Four beds — two doubles and two singles, or four singles depending on configuration — ensure everyone has their own space.',
    'The room features a dedicated seating area, generous wardrobe space, and a private en-suite bathroom with hot and cold water. Air conditioning keeps things comfortable in all seasons.',
    'Families love the Family Room for its thoughtful child-friendly layout and its proximity to the hotel gardens, where children can safely play between meals. It\'s the ideal home base for a multi-day Yala safari.',
  ],
}

export default async function RoomDetailPage({ params }: Props) {
  const { slug } = await params

  const room = await db.roomType.findUnique({
    where: { slug: slug as 'DELUXE_TWIN' | 'DELUXE_DOUBLE' | 'DELUXE_TRIPLE' | 'FAMILY' },
    include: {
      ratePlans: {
        where: { isVisible: true },
        orderBy: { priceUsd: 'asc' },
      },
      _count: { select: { units: true } },
    },
  })

  if (!room) notFound()

  const features = ROOM_FEATURES[slug] ?? []
  const paragraphs = ROOM_LONG_DESCRIPTIONS[slug] ?? []
  const bbPlan = room.ratePlans.find((p: { mealPlan: string }) => p.mealPlan === 'BB')
  const hbPlan = room.ratePlans.find((p: { mealPlan: string }) => p.mealPlan === 'HB')

  return (
    <>
      {/* ── Hero banner ── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3d1209 0%, #5e1e12 50%, #6D5840 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #FAF7F2 1px, transparent 0)`, backgroundSize: '28px 28px' }}
          aria-hidden="true"
        />
        <div className="relative z-10 container-hotel">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6 font-sans"
          >
            <ArrowLeft size={14} />
            All Rooms
          </Link>
          <h1 className="text-display text-white mb-3">{room.displayName}</h1>
          <div className="w-16 h-0.5 bg-[#C9A96E] mb-5" />
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-white/70 text-sm font-sans">
              <Users size={14} className="text-[#C9A96E]" />
              Up to {room.maxOccupancy} guests
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm font-sans">
              <BedDouble size={14} className="text-[#C9A96E]" />
              {room._count.units} rooms available
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="container-hotel grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: Description + Features */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image placeholder */}
            <div className="relative h-80 rounded-xl bg-gradient-to-br from-[#5e1e12]/10 to-[#6D5840]/20 border border-[#E5DDD3] overflow-hidden flex items-center justify-center">
              <div className="opacity-20 flex flex-col items-center gap-3">
                <BedDouble size={72} className="text-[#6D5840]" />
                <p className="text-sm font-sans text-[#6D5840]">Room photos — coming soon</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-[#E5DDD3] p-8">
              <h2 className="font-serif text-2xl font-semibold text-[#2C1A12] mb-5">About This Room</h2>
              <div className="space-y-4">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-[#5a3d2b]/80 font-sans leading-relaxed">{p}</p>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl border border-[#E5DDD3] p-8">
              <h2 className="font-serif text-2xl font-semibold text-[#2C1A12] mb-5">Room Features</h2>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[#5a3d2b] font-sans">
                    <Check size={14} className="text-[#C9A96E] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Rates sticky card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl border border-[#E5DDD3] shadow-[0_4px_24px_rgba(94,30,18,0.08)] overflow-hidden">
              <div className="p-6 border-b border-[#E5DDD3] bg-[#5e1e12]">
                <h3 className="font-serif text-xl font-semibold text-white">Rates &amp; Booking</h3>
                <p className="text-sm text-white/60 font-sans mt-1">Per room, per night</p>
              </div>

              <div className="p-6 space-y-4">
                {bbPlan && (
                  <div className="rounded-lg border border-[#E5DDD3] p-4 bg-[#FAF7F2]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-sans font-bold text-[#5e1e12] bg-[#5e1e12]/10 px-2 py-0.5 rounded">BB</span>
                      <p className="font-serif text-2xl font-semibold text-[#5e1e12]">${Number(bbPlan.priceUsd).toFixed(0)}</p>
                    </div>
                    <p className="text-xs text-[#6D5840] font-sans">Bed &amp; Breakfast included</p>
                  </div>
                )}
                {hbPlan && (
                  <div className="rounded-lg border border-[#5e1e12]/20 p-4 bg-[#5e1e12]/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-sans font-bold text-[#5e1e12] bg-[#5e1e12]/10 px-2 py-0.5 rounded">HB</span>
                      <p className="font-serif text-2xl font-semibold text-[#5e1e12]">${Number(hbPlan.priceUsd).toFixed(0)}</p>
                    </div>
                    <p className="text-xs text-[#6D5840] font-sans">Breakfast &amp; lunch included</p>
                  </div>
                )}

                <div className="pt-2 space-y-3">
                  <Link
                    href={`/book?room=${slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded bg-[#5e1e12] text-white font-sans font-semibold text-sm hover:bg-[#7a2a1c] hover:shadow-[0_4px_20px_rgba(94,30,18,0.35)] transition-all duration-200 group"
                  >
                    Book This Room
                    <ArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center px-6 py-3 rounded border border-[#5e1e12]/25 text-[#5e1e12] font-sans font-semibold text-sm hover:bg-[#5e1e12]/5 transition-colors duration-200"
                  >
                    Ask a Question
                  </Link>
                </div>

                <div className="pt-4 border-t border-[#E5DDD3] space-y-2 text-xs text-[#6D5840] font-sans">
                  <p>✓ Best rate guarantee</p>
                  <p>✓ Secure direct booking</p>
                  <p>✓ Free cancellation enquiry</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Other rooms CTA ── */}
      <section className="py-14 bg-white border-t border-[#E5DDD3]">
        <div className="container-hotel flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#2C1A12]">Explore Other Rooms</h2>
            <p className="text-[#5a3d2b]/70 font-sans mt-1 text-sm">We have {4} room types across 20 total rooms.</p>
          </div>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded border-2 border-[#5e1e12] text-[#5e1e12] font-sans font-semibold text-sm hover:bg-[#5e1e12] hover:text-white transition-all duration-200"
          >
            View All Rooms
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  )
}
