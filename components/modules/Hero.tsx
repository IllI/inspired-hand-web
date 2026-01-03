import { PortableText } from '@portabletext/react'
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
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gray-900"
      style={
        backgroundUrl
          ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center text-white">
        {heading && (
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {heading}
          </h1>
        )}

        {subheading && (
          <p className="mb-8 text-lg text-gray-200 sm:text-xl md:text-2xl">
            {subheading}
          </p>
        )}

        {cta?.label && cta?.link && (
          <Link
            href={cta.link}
            className="inline-block rounded-lg bg-amber-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-amber-700"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  )
}

export default Hero
