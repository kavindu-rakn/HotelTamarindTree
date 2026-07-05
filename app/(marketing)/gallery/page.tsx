import type { Metadata } from 'next'
import Image from 'next/image'
import fs from 'fs'
import path from 'path'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Gallery | ${SITE_NAME}`,
  description: 'Explore the serene beauty of Hotel Tamarind Tree, from our tranquil pool and lush gardens to our elegant rooms.',
}

export default function GalleryPage() {
  // Read all images from public/gallery dynamically at build/request time
  const galleryDir = path.join(process.cwd(), 'public', 'gallery')
  let images: string[] = []
  try {
    const files = fs.readdirSync(galleryDir)
    images = files.filter(f => f.endsWith('.jpg') || f.endsWith('.png')).map(f => `/gallery/${f}`)
  } catch (e) {
    console.error('Failed to read gallery directory', e)
  }

  return (
    <>
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3d1209 0%, #5e1e12 50%, #6D5840 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #FAF7F2 1px, transparent 0)`, backgroundSize: '28px 28px' }}
          aria-hidden="true"
        />
        <div className="relative z-10 container-hotel text-center">
          <p className="text-label text-[#C9A96E] mb-3">Our Space</p>
          <h1 className="text-display text-[#C9A96E] mb-4">Gallery</h1>
          <div className="w-16 h-0.5 bg-[#C9A96E] mx-auto mb-5" />
          <p className="max-w-xl mx-auto text-white/75 font-sans leading-relaxed">
            Take a visual journey through Hotel Tamarind Tree. From our inviting pool and lush tropical gardens to our beautifully designed rooms and dining spaces.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#FAF7F2] min-h-screen">
        <div className="container-hotel">
          {images.length === 0 ? (
            <p className="text-center text-[#5a3d2b] font-sans">No images found in the gallery.</p>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {images.map((src, idx) => (
                <div
                  key={idx}
                  className="relative group overflow-hidden rounded-xl bg-white border border-[#E5DDD3] break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <Image
                    src={src}
                    alt={`Hotel Tamarind Tree Gallery Image ${idx + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
