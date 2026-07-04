'use client'

import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 p-4 rounded-full bg-[#5e1e12]/10">
        <AlertTriangle size={40} className="text-[#5e1e12]" />
      </div>
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#2C1A12] mb-4">
        Something Went Wrong
      </h1>
      <div className="w-12 h-0.5 bg-[#C9A96E] mx-auto mb-5" />
      <p className="text-[#5a3d2b]/80 font-sans max-w-md leading-relaxed mb-8">
        We encountered an unexpected error. Please try again, or contact us if the problem persists.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded bg-[#5e1e12] text-white font-sans font-semibold text-sm hover:bg-[#7a2a1c] transition-colors duration-200"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded border border-[#5e1e12]/30 text-[#5e1e12] font-sans font-semibold text-sm hover:bg-[#5e1e12]/5 transition-colors duration-200"
        >
          <ArrowLeft size={15} />
          Back to Home
        </Link>
      </div>
      {process.env.NODE_ENV === 'development' && error.message && (
        <pre className="mt-8 p-4 bg-[#2C1A12]/5 rounded text-left text-xs text-[#5a3d2b] max-w-lg overflow-auto">
          {error.message}
        </pre>
      )}
    </div>
  )
}
