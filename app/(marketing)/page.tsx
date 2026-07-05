import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, ArrowRight, Wifi, Utensils, TreePine, Shield } from 'lucide-react'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `${SITE_NAME} | Boutique Hotel in Tissamaharama, Sri Lanka`,
  description:
    'Hotel Tamarind Tree — a 4-star boutique hotel in Tissamaharama, Sri Lanka. Your perfect base for Yala National Park safaris. Book Deluxe and Family rooms with Bed & Breakfast or Half Board packages.',
  openGraph: {
    title: `${SITE_NAME} | Boutique Hotel in Tissamaharama`,
    description: 'A 4-star boutique hotel in the heart of Tissamaharama — your gateway to Yala National Park.',
  },
}

// ── Testimonials placeholder ────────────────────────────────
const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    country: 'United Kingdom',
    rating: 5,
    text: 'An absolutely magical stay. The rooms were beautiful and the staff went out of their way to make us feel at home. The perfect base for our Yala safari!',
  },
  {
    id: 2,
    name: 'Lucas B.',
    country: 'Germany',
    rating: 5,
    text: 'Warm Sri Lankan hospitality at its finest. The breakfast spread was wonderful and the location couldn\'t be better for exploring the south.',
  },
  {
    id: 3,
    name: 'Priya K.',
    country: 'Australia',
    rating: 5,
    text: 'The family room was spacious and immaculate. Our kids loved the garden and the staff arranged everything for our safari without any fuss.',
  },
]

// ── Room Highlights ─────────────────────────────────────────
const roomHighlights = [
  {
    slug:         'deluxe-twin',
    name:         'Deluxe Twin',
    description:  'Two comfortable beds in a stylishly appointed room — perfect for friends exploring southern Sri Lanka.',
    priceFrom:    50,
    maxGuests:    2,
  },
  {
    slug:         'deluxe-double',
    name:         'Deluxe Double',
    description:  'A romantic retreat with a plush double bed, warm teak accents, and private en-suite — just minutes from Yala.',
    priceFrom:    50,
    maxGuests:    2,
  },
  {
    slug:         'deluxe-triple',
    name:         'Deluxe Triple',
    description:  'Spacious and versatile with three beds — ideal for families or a trio of safari adventurers.',
    priceFrom:    70,
    maxGuests:    3,
  },
  {
    slug:         'family',
    name:         'Family Room',
    description:  'Generous floor space, four beds, and all the comforts of home — designed for families who travel together.',
    priceFrom:    100,
    maxGuests:    4,
  },
]

// ── Features ────────────────────────────────────────────────
const features = [
  { icon: Wifi,      title: 'Free Wi-Fi',     desc: 'High-speed internet throughout the hotel' },
  { icon: Utensils,  title: 'In-House Dining', desc: 'Sri Lankan and international cuisine daily' },
  { icon: TreePine,  title: 'Yala Safari',     desc: 'Easy access to Yala & Bundala National Parks' },
  { icon: Shield,    title: 'Safe & Secure',   desc: '24-hour security and front desk service' },
]

export default function HomePage() {
  return (
    <>
      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        aria-label="Hero"
      >
        {/* Background — placeholder gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #3d1209 0%, #5e1e12 30%, #6D5840 70%, #4e3f2d 100%)',
          }}
          aria-hidden="true"
        />

        {/* Decorative pattern overlay */}
        <div
          className="absolute inset-0 z-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FAF7F2 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 container-hotel pt-32 pb-24 flex flex-col items-center text-center">

          {/* Location badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in">
            <MapPin size={14} className="text-[#C9A96E]" />
            <span className="text-sm font-sans text-white/90 tracking-wide">Tissamaharama, Sri Lanka</span>
          </div>

          {/* Hotel name */}
          <h1 className="text-display text-[#C9A96E] mb-2 animate-fade-up" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.3)' }}>
            Hotel Tamarind Tree
          </h1>

          {/* Tagline */}
          <p className="font-serif text-xl md:text-2xl text-[#C9A96E] italic mb-6 animate-fade-up animation-delay-100">
            A Sanctuary in the Heart of Sri Lanka
          </p>

          {/* Description */}
          <p className="max-w-xl text-white/80 font-sans text-base md:text-lg leading-relaxed mb-10 animate-fade-up animation-delay-200">
            A 4-star boutique hotel just minutes from Yala National Park. Discover warm Sri Lankan hospitality, comfortable rooms, and unforgettable safari experiences.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-300">
            <Link
              href="/book"
              id="hero-book-now-btn"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded bg-[#5e1e12] text-white font-sans font-semibold text-base hover:bg-[#7a2a1c] hover:shadow-[0_8px_32px_rgba(94,30,18,0.5)] transition-all duration-250 group"
            >
              Check Availability
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/rooms"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded border border-white/30 text-white font-sans font-medium text-base hover:bg-white/10 transition-all duration-250 backdrop-blur-sm"
            >
              Explore Rooms
            </Link>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1.5 mt-10 animate-fade-up animation-delay-400">
            {Array.from({ length: 4 }).map((_, i) => (
              <Star key={i} size={16} className="fill-[#C9A96E] text-[#C9A96E]" />
            ))}
            <span className="ml-2 text-sm text-white/60 font-sans">4-Star Boutique Hotel</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce" aria-hidden="true">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES STRIP
      ════════════════════════════════════════ */}
      <section className="bg-white border-y border-[#E5DDD3]" aria-label="Hotel features">
        <div className="container-hotel py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3 group">
              <div className="mt-0.5 p-2 rounded bg-[#FAF7F2] group-hover:bg-[#5e1e12] transition-colors duration-250 shrink-0">
                <f.icon size={18} className="text-[#5e1e12] group-hover:text-white transition-colors duration-250" />
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-[#2C1A12]">{f.title}</p>
                <p className="font-sans text-xs text-[#5a3d2b]/70 leading-snug">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          ROOMS SECTION
      ════════════════════════════════════════ */}
      <section className="py-24 bg-[#FAF7F2]" aria-labelledby="rooms-heading">
        <div className="container-hotel">
          {/* Section header */}
          <div className="text-center mb-14">
            <p className="text-label text-[#6D5840] mb-3">Accommodation</p>
            <h2 id="rooms-heading" className="text-heading text-[#2C1A12] mb-4">Our Rooms &amp; Suites</h2>
            <div className="section-divider mb-5" />
            <p className="max-w-xl mx-auto text-[#5a3d2b]/80 font-sans leading-relaxed">
              Twenty thoughtfully appointed rooms across four categories, each designed to bring the warmth and natural beauty of Tissamaharama inside.
            </p>
          </div>

          {/* Room cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roomHighlights.map((room) => (
              <article
                key={room.slug}
                className="group bg-white rounded-lg overflow-hidden border border-[#E5DDD3] hover:shadow-[0_8px_40px_rgba(94,30,18,0.12)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Room image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={`/rooms/${room.slug}.png`}
                    alt={`${room.name} at Hotel Tamarind Tree`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A12]/30 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-sans font-semibold text-[#5e1e12]">
                      Up to {room.maxGuests} guests
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold text-[#2C1A12] mb-2">{room.name}</h3>
                  <p className="text-sm text-[#5a3d2b]/75 leading-relaxed mb-4 line-clamp-3">{room.description}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs text-[#6D5840] font-sans">From</span>
                      <p className="font-serif text-2xl font-semibold text-[#5e1e12]">${room.priceFrom}<span className="text-sm font-sans font-normal text-[#6D5840]">/night</span></p>
                    </div>
                    <Link
                      href={`/rooms/${room.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-[#5e1e12] hover:text-[#7a2a1c] transition-colors duration-150 group/link"
                    >
                      View room
                      <ArrowRight size={14} className="transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* All rooms CTA */}
          <div className="text-center mt-10">
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded border-2 border-[#5e1e12] text-[#5e1e12] font-sans font-semibold text-sm hover:bg-[#5e1e12] hover:text-white transition-all duration-250"
            >
              View All Rooms
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ABOUT / LOCATION TEASER
      ════════════════════════════════════════ */}
      <section className="py-24 bg-[#2C1A12]" aria-labelledby="about-heading">
        <div className="container-hotel grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-label text-[#C9A96E] mb-3">Our Story</p>
            <h2 id="about-heading" className="text-heading text-white mb-5">Where Nature Meets Comfort</h2>
            <div className="section-divider-left mb-6" />
            <p className="text-white/70 font-sans leading-relaxed mb-4">
              Nestled in Tissamaharama — the gateway town to the famous Yala National Park — Hotel Tamarind Tree offers a peaceful retreat that honours the natural landscape of Sri Lanka's Deep South.
            </p>
            <p className="text-white/70 font-sans leading-relaxed mb-8">
              Named for the ancient tamarind trees that grace the region, our hotel blends warm Sri Lankan hospitality with thoughtfully designed rooms, making it the ideal base for wildlife safaris, temple visits, and coastal exploration.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded border border-[#C9A96E]/40 text-[#C9A96E] font-sans text-sm font-semibold hover:bg-[#C9A96E]/10 transition-colors duration-250"
            >
              Learn More About Us
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Real Photo */}
          <div className="relative h-80 lg:h-96 rounded-xl overflow-hidden border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
            <Image
              src="/gallery/T013.jpg"
              alt="Pool side relaxation at Hotel Tamarind Tree"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle inner dark gradient for text pill legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Location pill */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <MapPin size={14} className="text-[#C9A96E]" />
              <span className="text-sm text-white font-sans">Tissamaharama, Sri Lanka</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════ */}
      <section className="py-24 bg-[#F0EAE0]" aria-labelledby="testimonials-heading">
        <div className="container-hotel">
          <div className="text-center mb-14">
            <p className="text-label text-[#6D5840] mb-3">Guest Reviews</p>
            <h2 id="testimonials-heading" className="text-heading text-[#2C1A12] mb-4">What Our Guests Say</h2>
            <div className="section-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <blockquote
                key={t.id}
                className="bg-white rounded-lg p-6 border border-[#E5DDD3] shadow-[0_2px_12px_rgba(94,30,18,0.06)] flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-[#C9A96E] text-[#C9A96E]" />
                  ))}
                </div>
                <p className="font-sans text-sm text-[#5a3d2b] leading-relaxed mb-5 flex-1 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <footer className="flex items-center gap-2 pt-4 border-t border-[#E5DDD3]">
                  <div className="w-8 h-8 rounded-full bg-[#5e1e12]/10 flex items-center justify-center">
                    <span className="text-xs font-sans font-semibold text-[#5e1e12]">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <cite className="not-italic font-sans text-sm font-semibold text-[#2C1A12]">{t.name}</cite>
                    <p className="text-xs text-[#6D5840]">{t.country}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BOOK CTA SECTION
      ════════════════════════════════════════ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #5e1e12 0%, #6D5840 100%)' }}
        aria-labelledby="cta-heading"
      >
        {/* Decorative dots */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FAF7F2 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 container-hotel text-center">
          <p className="text-label text-[#C9A96E] mb-3">Plan Your Visit</p>
          <h2 id="cta-heading" className="text-heading text-white mb-5">Ready for Your Sri Lanka Adventure?</h2>
          <p className="max-w-lg mx-auto text-white/75 font-sans leading-relaxed mb-8">
            Book directly with us for the best rates. Breakfast, Half Board, and Full Board packages available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              id="cta-book-btn"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded bg-white text-[#5e1e12] font-sans font-semibold text-base hover:bg-[#FAF7F2] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-250 group"
            >
              Book Your Stay
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded border border-white/40 text-white font-sans font-medium text-base hover:bg-white/10 transition-all duration-250"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
