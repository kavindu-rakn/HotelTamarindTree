import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Mail } from 'lucide-react'
import { SITE_NAME, SITE_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Booking Confirmed | ${SITE_NAME}`,
  description: 'Your booking at Hotel Tamarind Tree is confirmed. We look forward to welcoming you.',
}

interface Props {
  searchParams: Promise<{ ref?: string }>
}

export default async function BookSuccessPage({ searchParams }: Props) {
  const { ref } = await searchParams

  return (
    <>
      <section
        className="relative pt-32 pb-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3d1209 0%, #5e1e12 50%, #6D5840 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #FAF7F2 1px, transparent 0)`, backgroundSize: '28px 28px' }} aria-hidden="true" />
        <div className="relative z-10 container-hotel text-center">
          <p className="text-label text-[#C9A96E] mb-3">Reservation</p>
          <h1 className="text-display text-white mb-4">Booking Confirmed</h1>
          <div className="w-16 h-0.5 bg-[#C9A96E] mx-auto" />
        </div>
      </section>

      <section className="py-20 bg-[#FAF7F2]">
        <div className="container-hotel max-w-2xl text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>

          <h2 className="font-serif text-3xl font-semibold text-[#2C1A12] mb-3">Thank You!</h2>
          <p className="text-[#5a3d2b]/80 font-sans leading-relaxed mb-8">
            Your reservation at Hotel Tamarind Tree is confirmed. A confirmation email with full details has been sent to your inbox.
          </p>

          {ref && (
            <div className="bg-white rounded-xl border border-[#E5DDD3] shadow-[0_2px_20px_rgba(94,30,18,0.06)] p-8 mb-8">
              <p className="text-xs font-sans font-semibold text-[#6D5840] tracking-widest uppercase mb-2">Your Booking Reference</p>
              <p className="font-mono text-3xl font-bold text-[#5e1e12] tracking-widest">{ref}</p>
              <p className="text-sm text-[#6D5840] font-sans mt-3">Please save this reference and present it at check-in.</p>
            </div>
          )}

          {/* What's next */}
          <div className="bg-white rounded-xl border border-[#E5DDD3] shadow-[0_2px_20px_rgba(94,30,18,0.06)] p-8 mb-10 text-left">
            <h3 className="font-serif text-xl font-semibold text-[#2C1A12] mb-4">What&apos;s next?</h3>
            <ul className="space-y-4">
              {[
                { icon: Mail,         text: 'Check your email — a detailed confirmation has been sent to your inbox.' },
                { icon: CheckCircle2, text: 'Check-in is from 2:00 PM. Check-out by 11:00 AM. Need a different time? Email us.' },
                { icon: CheckCircle2, text: 'Yala National Park safaris can be arranged directly through us — just let us know when you arrive.' },
                { icon: CheckCircle2, text: `Questions? Contact us at ${SITE_EMAIL} — we're happy to help.` },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#5a3d2b] font-sans">
                  <Icon size={16} className="text-[#C9A96E] shrink-0 mt-0.5" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#5e1e12] text-white font-sans font-semibold text-sm rounded hover:bg-[#7a2a1c] transition-all duration-200"
            >
              Back to Home
            </Link>
            <Link
              href="/rooms"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#5e1e12]/30 text-[#5e1e12] font-sans font-semibold text-sm rounded hover:bg-[#5e1e12]/5 transition-all duration-200"
            >
              Explore Rooms <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
