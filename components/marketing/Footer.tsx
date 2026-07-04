import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Share2 } from 'lucide-react'
import { NAV_LINKS, SITE_NAME, SITE_ADDRESS, SITE_EMAIL, SITE_PHONE } from '@/lib/constants'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="bg-[#2C1A12] text-[#FAF7F2]">
      {/* ── Top section ── */}
      <div className="container-hotel py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

        {/* Brand column */}
        <div className="lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-3 mb-5 group" aria-label="Hotel Tamarind Tree">
            <Image
              src="/logo.jpeg"
              alt="Hotel Tamarind Tree logo"
              width={40}
              height={49}
              className="object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-200"
            />
            <div className="leading-tight">
              <span className="block text-[0.6rem] font-sans font-semibold tracking-[0.18em] uppercase text-[#C9A96E]">HOTEL</span>
              <span className="block font-serif text-lg font-semibold text-white">Tamarind Tree</span>
            </div>
          </Link>
          <p className="text-sm text-[#C9A96E]/80 leading-relaxed max-w-[220px]">
            A 4-star sanctuary in the heart of Tissamaharama — your gateway to Yala National Park.
          </p>
          {/* Social links */}
          <div className="flex gap-3 mt-5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 rounded bg-white/5 hover:bg-[#5e1e12] transition-colors duration-200 text-[#C9A96E] hover:text-white"
            >
              <Share2 size={16} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded bg-white/5 hover:bg-[#5e1e12] transition-colors duration-200 text-[#C9A96E] hover:text-white"
            >
              <Share2 size={16} />
            </a>
          </div>
        </div>

        {/* Navigation column */}
        <div>
          <h3 className="font-serif text-base font-semibold text-[#C9A96E] mb-4 tracking-wide">Explore</h3>
          <ul className="space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 hover:text-[#C9A96E] transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Rooms column */}
        <div>
          <h3 className="font-serif text-base font-semibold text-[#C9A96E] mb-4 tracking-wide">Rooms</h3>
          <ul className="space-y-2.5">
            {[
              { label: 'Deluxe Twin',   href: '/rooms/deluxe-twin' },
              { label: 'Deluxe Double', href: '/rooms/deluxe-double' },
              { label: 'Deluxe Triple', href: '/rooms/deluxe-triple' },
              { label: 'Family Room',   href: '/rooms/family' },
            ].map((room) => (
              <li key={room.href}>
                <Link
                  href={room.href}
                  className="text-sm text-white/70 hover:text-[#C9A96E] transition-colors duration-150"
                >
                  {room.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact column */}
        <div>
          <h3 className="font-serif text-base font-semibold text-[#C9A96E] mb-4 tracking-wide">Contact</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-[#C9A96E]" />
              <span className="text-sm text-white/70">{SITE_ADDRESS}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={15} className="shrink-0 text-[#C9A96E]" />
              <a href={`tel:${SITE_PHONE}`} className="text-sm text-white/70 hover:text-[#C9A96E] transition-colors duration-150">
                {SITE_PHONE}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={15} className="shrink-0 text-[#C9A96E]" />
              <a href={`mailto:${SITE_EMAIL}`} className="text-sm text-white/70 hover:text-[#C9A96E] transition-colors duration-150">
                {SITE_EMAIL}
              </a>
            </li>
          </ul>

          {/* Book CTA */}
          <Link
            href="/book"
            className="mt-6 inline-flex items-center px-5 py-2.5 rounded bg-[#5e1e12] text-white text-sm font-sans font-semibold hover:bg-[#7a2a1c] transition-colors duration-200"
          >
            Check Availability
          </Link>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-white/10">
        <div className="container-hotel py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {currentYear} {SITE_NAME}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white/70 transition-colors duration-150">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-white/70 transition-colors duration-150">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
