import { urlForImage } from 'lib/sanity.image'
import Link from 'next/link'
import type { HeroModule } from 'types'

interface HeroProps {
  module: HeroModule
}

export function Hero({ module }: HeroProps) {
  const { heading, subheading, backgroundImage, cta } = module

  const backgroundUrl = backgroundImage?.asset
    ? urlForImage(backgroundImage)?.width(1920).height(1080).url()
    : null

  return (
    <section
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-brown-800"
      style={
        backgroundUrl
          ? {
              backgroundImage: `linear-gradient(rgba(26, 16, 8, 0.6), rgba(26, 16, 8, 0.6)), url(${backgroundUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center text-white">
        {heading && (
          <h1 className="mb-6 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {heading}
          </h1>
        )}

        {subheading && (
          <p className="mb-8 font-body text-lg text-cream-200 sm:text-xl md:text-2xl">
            {subheading}
          </p>
        )}

        {cta?.label && cta?.link && (
          <Link
            href={cta.link}
            className="inline-block rounded-lg bg-gold-600 px-8 py-4 font-body text-lg font-semibold text-white shadow-lg transition-all hover:bg-gold-700 hover:shadow-xl"
          >
            {cta.label}
          </Link>
        )}
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="h-16 w-full fill-white md:h-24"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" />
        </svg>
      </div>
    </section>
  )
}

export default Hero
