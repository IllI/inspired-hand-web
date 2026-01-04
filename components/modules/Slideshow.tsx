'use client'

import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import type { SlideshowModule } from 'types'

interface SlideshowProps {
  module: SlideshowModule
}

export function Slideshow({ module }: SlideshowProps) {
  const { slides, autoplay = true, interval = 5 } = module
  const [currentIndex, setCurrentIndex] = useState(0)

  const slideCount = slides?.length || 0

  const goToNext = useCallback(() => {
    if (slideCount > 0) {
      setCurrentIndex((prev) => (prev + 1) % slideCount)
    }
  }, [slideCount])

  const goToPrev = useCallback(() => {
    if (slideCount > 0) {
      setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount)
    }
  }, [slideCount])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Autoplay effect
  useEffect(() => {
    if (!autoplay || slideCount <= 1) return

    const timer = setInterval(goToNext, interval * 1000)
    return () => clearInterval(timer)
  }, [autoplay, interval, slideCount, goToNext])

  if (!slides || slides.length === 0) {
    return null
  }

  const currentSlide = slides[currentIndex]

  return (
    <section className="relative overflow-hidden bg-gray-900">
      {/* Slides */}
      <div className="relative aspect-[16/9] md:aspect-[21/9]">
        {slides.map((slide, index) => {
          const imageUrl = slide.image?.asset
            ? urlForImage(slide.image)?.width(1920).height(1080).url()
            : null

          return (
            <div
              key={slide._key || index}
              className={`absolute inset-0 transition-opacity duration-700 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
            >
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={slide.image?.alt || slide.heading || ''}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              )}

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Slide content */}
              {(slide.heading || slide.caption || slide.ctaLabel) && (
                <div className="absolute inset-0 flex items-end justify-center pb-16 md:pb-24">
                  <div className="px-6 text-center text-white">
                    {slide.heading && (
                      <h2 className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl">
                        {slide.heading}
                      </h2>
                    )}
                    {slide.caption && (
                      <p className="mb-4 max-w-2xl text-sm text-gray-200 sm:text-base md:text-lg">
                        {slide.caption}
                      </p>
                    )}
                    {slide.ctaLabel && slide.ctaLink && (
                      <Link
                        href={slide.ctaLink}
                        className="inline-block rounded-none bg-ih-primary px-6 py-2 text-sm font-bold uppercase tracking-widest text-ih-text-dark transition-colors hover:bg-ih-primary-light sm:px-8 sm:py-3 sm:text-base border border-ih-text-dark"
                      >
                        {slide.ctaLabel}
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation arrows */}
      {slideCount > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 sm:p-3"
            aria-label="Previous slide"
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 sm:p-3"
            aria-label="Next slide"
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {slideCount > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all sm:h-3 sm:w-3 ${index === currentIndex
                  ? 'w-6 bg-white sm:w-8'
                  : 'bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Slideshow
