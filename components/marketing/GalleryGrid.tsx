'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryGridProps {
  images: string[]
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const closeLightbox = () => {
    setIsOpen(false)
  }

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, nextImage, prevImage])

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (images.length === 0) {
    return <p className="text-center text-[#5a3d2b] font-sans">No images found in the gallery.</p>
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="relative group overflow-hidden rounded-xl bg-white border border-[#E5DDD3] break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => openLightbox(idx)}
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
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                <ZoomIn className="text-white w-6 h-6 drop-shadow-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300" onClick={closeLightbox}>
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white hover:scale-110 transition-all z-50"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            aria-label="Close lightbox"
          >
            <X className="w-10 h-10 drop-shadow-lg" />
          </button>

          {/* Navigation Buttons */}
          <button
            className="absolute left-4 sm:left-8 text-white/70 hover:text-white hover:scale-110 transition-all p-2 z-50"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-12 h-12 drop-shadow-lg" />
          </button>

          <button
            className="absolute right-4 sm:right-8 text-white/70 hover:text-white hover:scale-110 transition-all p-2 z-50"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Next image"
          >
            <ChevronRight className="w-12 h-12 drop-shadow-lg" />
          </button>

          {/* Image */}
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto px-20 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[currentIndex]}
              alt={`Gallery Image ${currentIndex + 1} zoomed`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          
          {/* Image Counter */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 font-sans text-sm tracking-widest font-medium drop-shadow-md">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
