import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Users, BedDouble } from 'lucide-react'
import { db } from '@/lib/db'
import { urlSlugToEnum, getRoomImagePath } from '@/lib/utils'
import { SITE_NAME } from '@/lib/constants'
import type { RoomEnumSlug } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

// Render on-demand rather than prerendering at build time, so the build never
// depends on the database being reachable and admin room edits appear
// immediately. Invalid slugs are rejected below via urlSlugToEnum → notFound().
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const enumSlug = urlSlugToEnum(slug) as RoomEnumSlug | null
  if (!enumSlug) return {}
  const room = await db.roomType.findUnique({ where: { slug: enumSlug } })
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
    'A private en-suite bathroom comes fully equipped, and the room is kept cool and comfortable with air conditioning throughout — essential after long hours exploring Yala National Park.',
    'The Deluxe Twin enjoys easy garden access, making it the most convenient choice for safari mornings when early departures are key.',
  ],
  'deluxe-double': [
    'The Deluxe Double is our most popular room — a serene retreat for couples. A generous double bed sits at the heart of the room, framed by warm earthy tones and hand-crafted Sri Lankan decorative accents.',
    'The private en-suite bathroom offers hot and cold water, and the room is kept pleasantly cool with air conditioning. Soft lighting and a writing desk complete the picture for a relaxed stay.',
    'Ideal for a romantic getaway or a quiet retreat, the Deluxe Double puts you just minutes from the Tissamaharama tank and the gateway to Yala National Park.',
  ],
  'deluxe-triple': [
    'The Deluxe Triple is built for three — whether it\'s a family of three, a group of friends, or simply guests who prefer extra space. Three comfortable single beds are arranged spaciously, with ample storage and natural light.',
    'All the comforts of a Deluxe room are present: private en-suite bathroom, air conditioning, free Wi-Fi, and daily housekeeping. The Triple configuration is the most versatile room for guests with varying needs.',
    'Located in a quiet wing of the hotel, the Deluxe Triple offers a peaceful night\'s rest after the day\'s adventures.',
  ],
  'family': [
    'Our largest and most feature-rich room, the Family Room is designed to accommodate four guests in comfort. Four beds ensure everyone has their own space without compromise.',
    'The room features a dedicated seating area, generous wardrobe space, and a private en-suite bathroom with hot and cold water. Air conditioning keeps things comfortable in all seasons.',
    'Families love the Family Room for its thoughtful child-friendly layout and proximity to the hotel gardens. It\'s the ideal home base for a multi-day Yala safari.',
  ],
}

export default async function RoomDetailPage({ params }: Props) {
  const { slug } = await params
  const enumSlug = urlSlugToEnum(slug) as RoomEnumSlug | null

  if (!enumSlug) notFound()

  const room = await db.roomType.findUnique({
    where: { slug: enumSlug },
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
  const imagePath = getRoomImagePath(slug)

  return (
    <>
      {/* ── Hero banner ── */}
      <section className="relative h-[55vh] min-h-80 overflow-hidden">
        <Image
          src={imagePath}
          alt={`${room.displayName} at Hotel Tamarind Tree`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A12]/80 via-[#2C1A12]/30 to-transparent" />

        {/* Content on top of image */}
        <div className="absolute inset-0 flex flex-col justify-end container-hotel pb-12">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-5 font-sans w-fit"
          >
            <ArrowLeft size={14} />
            All Rooms
          </Link>
          <h1 className="text-display text-[#C9A96E] mb-3" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}>
            {room.displayName}
          </h1>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center gap-2 text-white/80 text-sm font-sans">
              <Users size={14} className="text-[#C9A96E]" />
              Up to {room.maxOccupancy} guests
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm font-sans">
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
              <div className="p-6 bg-[#5e1e12]">
                <h3 className="font-serif text-xl font-semibold text-white">Rates &amp; Booking</h3>
                <p className="text-sm text-white/60 font-sans mt-1">Per room, per night (USD)</p>
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
                  <p>✓ Best rate guarantee — book direct</p>
                  <p>✓ Flexible enquiry &amp; cancellation</p>
                  <p>✓ No payment required now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Other rooms ── */}
      <section className="py-14 bg-white border-t border-[#E5DDD3]">
        <div className="container-hotel flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#2C1A12]">Explore Other Rooms</h2>
            <p className="text-[#5a3d2b]/70 font-sans mt-1 text-sm">20 rooms across 4 types — something for every group.</p>
          </div>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded border-2 border-[#5e1e12] text-[#5e1e12] font-sans font-semibold text-sm hover:bg-[#5e1e12] hover:text-white transition-all duration-200"
          >
            View All Rooms <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  )
}
