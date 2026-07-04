import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <p className="font-serif text-8xl font-semibold text-[#5e1e12]/20 leading-none">404</p>
      </div>
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#2C1A12] mb-4">
        Page Not Found
      </h1>
      <div className="w-12 h-0.5 bg-[#C9A96E] mx-auto mb-5" />
      <p className="text-[#5a3d2b]/80 font-sans max-w-md leading-relaxed mb-8">
        The page you are looking for does not exist or may have been moved. Let us help you find your way back.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded bg-[#5e1e12] text-white font-sans font-semibold text-sm hover:bg-[#7a2a1c] transition-colors duration-200"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>
    </div>
  )
}
