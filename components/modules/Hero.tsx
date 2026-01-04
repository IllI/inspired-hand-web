import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import type { HeroModule } from 'types'

interface HeroProps {
  module: HeroModule
}

export function Hero({ module }: HeroProps) {
  const { heading, subheading, backgroundImage, cta } = module

  const backgroundUrl = backgroundImage?.asset
    ? urlForImage(backgroundImage)?.width(1000).url()
    : null

  return (
    <section className="bg-white overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

          {/* Image Column */}
          <div className="relative order-1 lg:order-1 h-[400px] w-full lg:h-[600px]">
            {backgroundUrl ? (
              <Image
                src={backgroundUrl}
                alt={heading || "Hero Image"}
                fill
                priority
                className="object-cover object-center rounded-sm shadow-sm"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Content Column */}
          <div className="order-2 lg:order-2 flex flex-col justify-center text-center lg:text-left">
            <div className="mx-auto lg:mx-0 max-w-xl">
              {heading && (
                <h1 className="mb-6 font-heading text-4xl font-bold leading-tight text-ih-text-dark sm:text-5xl md:text-6xl lg:text-7xl">
                  {heading}
                </h1>
              )}

              {subheading && (
                <p className="mb-8 font-body text-lg text-ih-text-dark opacity-80 sm:text-xl leading-relaxed">
                  {subheading}
                </p>
              )}

              {cta?.label && cta?.link && (
                <Link
                  href={cta.link}
                  className="inline-block rounded-none bg-ih-primary px-10 py-4 font-sans text-sm font-bold uppercase tracking-widest text-ih-text-dark shadow-sm transition-all hover:bg-ih-primary-dark hover:shadow-md"
                >
                  {cta.label}
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
