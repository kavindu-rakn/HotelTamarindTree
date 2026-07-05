import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarSearch } from 'lucide-react'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Book a Room | ${SITE_NAME}`,
  description: 'Check availability and book your room at Hotel Tamarind Tree, Tissamaharama. Bed & Breakfast and Half Board packages available.',
}

export default function BookPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3d1209 0%, #5e1e12 50%, #6D5840 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #FAF7F2 1px, transparent 0)`, backgroundSize: '28px 28px' }} aria-hidden="true" />
        <div className="relative z-10 container-hotel text-center">
          <p className="text-label text-[#C9A96E] mb-3">Reservations</p>
          <h1 className="text-display text-white mb-4">Book Your Stay</h1>
          <div className="w-16 h-0.5 bg-[#C9A96E] mx-auto" />
        </div>
      </section>

      {/* ── Coming soon ── */}
      <section className="py-32 bg-[#FAF7F2] flex flex-col items-center text-center px-6">
        <div className="w-20 h-20 rounded-full bg-[#5e1e12]/10 flex items-center justify-center mb-8">
          <CalendarSearch size={36} className="text-[#5e1e12]" />
        </div>
        <h2 className="font-serif text-3xl font-semibold text-[#2C1A12] mb-4">Online Booking Coming Soon</h2>
        <div className="w-12 h-0.5 bg-[#C9A96E] mx-auto mb-6" />
        <p className="max-w-md text-[#5a3d2b]/80 font-sans leading-relaxed mb-10">
          Our online booking engine is currently being built. In the meantime, please contact us directly and we&apos;ll confirm your reservation within a few hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded bg-[#5e1e12] text-white font-sans font-semibold text-sm hover:bg-[#7a2a1c] hover:shadow-[0_4px_20px_rgba(94,30,18,0.35)] transition-all duration-200 group"
          >
            Contact Us to Book
            <ArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/rooms"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded border border-[#5e1e12]/30 text-[#5e1e12] font-sans font-semibold text-sm hover:bg-[#5e1e12]/5 transition-colors duration-200"
          >
            View Room Types & Rates
          </Link>
        </div>
      </section>
    </>
  )
}
