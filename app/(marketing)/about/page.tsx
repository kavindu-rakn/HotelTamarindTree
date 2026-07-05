import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, ArrowRight, TreePine, Star, Heart } from 'lucide-react'
import { SITE_NAME, SITE_EMAIL, SITE_PHONE, SITE_ADDRESS } from '@/lib/constants'

export const metadata: Metadata = {
  title: `About Us | ${SITE_NAME}`,
  description:
    'Discover the story behind Hotel Tamarind Tree — a boutique hotel in Tissamaharama, Sri Lanka, built on a love of the land and warm Sri Lankan hospitality.',
}

const values = [
  {
    icon: Heart,
    title: 'Sri Lankan Hospitality',
    desc: 'We believe in the ancient art of Atithi Devo Bhava — the guest is God. Every member of our team is dedicated to making you feel genuinely at home.',
  },
  {
    icon: TreePine,
    title: 'Rooted in Nature',
    desc: 'Named for the ancient tamarind trees that shelter this corner of Sri Lanka, our hotel takes its design cues from the land itself — earthy, warm, and honest.',
  },
  {
    icon: Star,
    title: 'Authentic Experiences',
    desc: 'From arranging early-morning Yala safaris to guiding you to hidden temples and local markets, we help you experience Sri Lanka the way it was meant to be seen.',
  },
]

const team = [
  { name: 'The Perera Family', role: 'Founders & Owners', initials: 'PF' },
  { name: 'Reception Team',    role: 'Guest Services',   initials: 'RT' },
  { name: 'Kitchen Team',      role: 'Culinary',         initials: 'KT' },
]

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative pt-32 pb-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3d1209 0%, #5e1e12 50%, #6D5840 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #FAF7F2 1px, transparent 0)`, backgroundSize: '28px 28px' }} aria-hidden="true" />
        <div className="relative z-10 container-hotel text-center">
          <p className="text-label text-[#C9A96E] mb-3">Our Story</p>
          <h1 className="text-display text-[#C9A96E] mb-4">About Hotel Tamarind Tree</h1>
          <div className="w-16 h-0.5 bg-[#C9A96E] mx-auto mb-5" />
          <p className="max-w-xl mx-auto text-white/75 font-sans leading-relaxed">
            A family-run boutique hotel in Tissamaharama, built on a deep love of Sri Lanka&apos;s southern landscape and a commitment to authentic, warm hospitality.
          </p>
        </div>
      </section>

      {/* ── Story section ── */}
      <section className="py-24 bg-[#FAF7F2]">
        <div className="container-hotel grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Real Photo */}
          <div className="relative h-96 rounded-2xl border border-[#E5DDD3] shadow-[0_8px_40px_rgba(94,30,18,0.06)] overflow-hidden">
            <Image
              src="/gallery/T001.jpg"
              alt="Hotel Tamarind Tree wooden sign"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {/* Location tag */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <MapPin size={13} className="text-white" />
              <span className="text-xs text-white font-sans font-medium">Tissamaharama, Sri Lanka</span>
            </div>
          </div>

          <div>
            <p className="text-label text-[#6D5840] mb-3">Where We Come From</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#2C1A12] mb-5 leading-tight">
              A Sanctuary in the Heart of the Deep South
            </h2>
            <div className="w-12 h-0.5 bg-[#C9A96E] mb-6" />
            <div className="space-y-4 text-[#5a3d2b]/80 font-sans leading-relaxed">
              <p>
                Hotel Tamarind Tree was born from a simple vision: to create a place where travellers could rest, reconnect with nature, and experience the genuine warmth of southern Sri Lankan life.
              </p>
              <p>
                Named for the ancient tamarind trees that have sheltered this land for centuries, our hotel stands as a quiet anchor in Tissamaharama — the town at the gateway to Yala National Park, one of the world&apos;s richest wildlife sanctuaries.
              </p>
              <p>
                Every detail — from the hand-carved furniture to the fresh local produce on your breakfast plate — reflects our commitment to authentic, unhurried hospitality. We are a family business, and we run it like one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-[#2C1A12]">
        <div className="container-hotel">
          <div className="text-center mb-14">
            <p className="text-label text-[#C9A96E] mb-3">What We Stand For</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4">Our Values</h2>
            <div className="w-12 h-0.5 bg-[#C9A96E] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(v => (
              <div key={v.title} className="bg-white/5 rounded-xl p-8 border border-white/10 hover:bg-white/8 transition-colors duration-200">
                <div className="w-12 h-12 rounded-full bg-[#5e1e12]/40 flex items-center justify-center mb-5">
                  <v.icon size={22} className="text-[#C9A96E]" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-white mb-3">{v.title}</h3>
                <p className="text-white/65 font-sans leading-relaxed text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location ── */}
      <section className="py-24 bg-[#FAF7F2]">
        <div className="container-hotel grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-label text-[#6D5840] mb-3">Getting Here</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#2C1A12] mb-5 leading-tight">
              Perfectly Located for Southern Sri Lanka
            </h2>
            <div className="w-12 h-0.5 bg-[#C9A96E] mb-6" />
            <div className="space-y-4 text-[#5a3d2b]/80 font-sans leading-relaxed mb-8">
              <p>
                Tissamaharama sits at the southern tip of Sri Lanka, around 250 km south of Colombo and just 20 km from Yala National Park&apos;s main entrance. It&apos;s also within easy reach of Bundala National Park, Kataragama, and the beaches of Tangalle and Mirissa.
              </p>
              <p>
                We are a 4–5 hour drive from Colombo or Bandaranaike International Airport via the Southern Expressway. Colombo to Matara by train (3.5 hours), then 45 minutes by tuk-tuk, is a popular scenic option.
              </p>
            </div>
            <div className="space-y-3 text-sm font-sans text-[#5a3d2b]">
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-[#5e1e12] mt-0.5 shrink-0" />
                <span>{SITE_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={15} className="text-[#5e1e12] shrink-0" />
                <a href={`tel:${SITE_PHONE}`} className="hover:text-[#5e1e12] transition-colors">{SITE_PHONE}</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={15} className="text-[#5e1e12] shrink-0" />
                <a href={`mailto:${SITE_EMAIL}`} className="hover:text-[#5e1e12] transition-colors">{SITE_EMAIL}</a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="relative h-96 rounded-2xl border border-[#E5DDD3] overflow-hidden shadow-[0_8px_40px_rgba(94,30,18,0.06)]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126938.83446862081!2d81.21590462706346!3d6.286395123902319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae69956d773fb23%3A0xe5f9ed084e36abef!2sTissamaharama%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1715000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hotel Tamarind Tree Location"
            />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-[#5e1e12]">
        <div className="container-hotel flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white">Ready to Experience It?</h2>
            <p className="text-white/65 font-sans mt-1">Book directly for the best rates and personal attention.</p>
          </div>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-8 py-4 rounded bg-white text-[#5e1e12] font-sans font-semibold text-sm hover:bg-[#FAF7F2] transition-colors duration-200 group shrink-0"
          >
            Check Availability
            <ArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  )
}
