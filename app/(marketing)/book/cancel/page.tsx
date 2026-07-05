import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail } from 'lucide-react'
import { SITE_NAME, SITE_EMAIL, SITE_PHONE } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Booking Cancelled | ${SITE_NAME}`,
  description: 'Your booking was not completed. Try again or contact us for assistance.',
}

export default function BookCancelPage() {
  return (
    <>
      <section
        className="relative pt-32 pb-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3d1209 0%, #5e1e12 50%, #6D5840 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #FAF7F2 1px, transparent 0)`, backgroundSize: '28px 28px' }} aria-hidden="true" />
        <div className="relative z-10 container-hotel text-center">
          <p className="text-label text-[#C9A96E] mb-3">Reservations</p>
          <h1 className="text-display text-white mb-4">Payment Cancelled</h1>
          <div className="w-16 h-0.5 bg-[#C9A96E] mx-auto" />
        </div>
      </section>

      <section className="py-20 bg-[#FAF7F2]">
        <div className="container-hotel max-w-xl text-center">
          <div className="text-6xl mb-6">😌</div>
          <h2 className="font-serif text-2xl font-semibold text-[#2C1A12] mb-3">No problem at all.</h2>
          <p className="text-[#5a3d2b]/80 font-sans leading-relaxed mb-10">
            Your payment was cancelled and no charge was made. Your room hold has been released. Whenever you&apos;re ready, you can try again or contact us directly.
          </p>

          <div className="bg-white rounded-xl border border-[#E5DDD3] shadow-[0_2px_20px_rgba(94,30,18,0.06)] p-8 mb-8 text-left">
            <h3 className="font-serif text-lg font-semibold text-[#2C1A12] mb-4">Prefer to book directly with us?</h3>
            <div className="space-y-3">
              <a href={`mailto:${SITE_EMAIL}`} className="flex items-center gap-3 text-sm text-[#5a3d2b] font-sans hover:text-[#5e1e12] transition-colors">
                <Mail size={16} className="text-[#5e1e12] shrink-0" />
                {SITE_EMAIL}
              </a>
              <a href={`tel:${SITE_PHONE}`} className="flex items-center gap-3 text-sm text-[#5a3d2b] font-sans hover:text-[#5e1e12] transition-colors">
                <Phone size={16} className="text-[#5e1e12] shrink-0" />
                {SITE_PHONE}
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#5e1e12] text-white font-sans font-semibold text-sm rounded hover:bg-[#7a2a1c] transition-all duration-200"
            >
              <ArrowLeft size={14} /> Try Again
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#5e1e12]/30 text-[#5e1e12] font-sans font-semibold text-sm rounded hover:bg-[#5e1e12]/5 transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
