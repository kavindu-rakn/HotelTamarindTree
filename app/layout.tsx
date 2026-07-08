import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/constants'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Hotel Tamarind Tree is a 4-star boutique hotel in Tissamaharama, Sri Lanka — the gateway to Yala National Park. Experience warm Sri Lankan hospitality with Deluxe and Family rooms, set amid the natural beauty of the Deep South.',
  keywords: [
    'Hotel Tamarind Tree',
    'Tissamaharama hotel',
    'Yala safari hotel',
    'Sri Lanka hotel',
    'boutique hotel Sri Lanka',
    'hotel near Yala National Park',
    '4 star hotel Tissamaharama',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      'A 4-star boutique hotel in Tissamaharama, Sri Lanka — your sanctuary before the Yala safari.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      'A 4-star boutique hotel in Tissamaharama, Sri Lanka — your sanctuary before the Yala safari.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-[#FAF7F2] text-[#2C1A12]">
        {children}
      </body>
    </html>
  )
}
