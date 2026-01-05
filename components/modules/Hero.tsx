import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import type { HeroModule } from 'types'

interface HeroProps {
  module: HeroModule
}

export function Hero({ module }: HeroProps) {
  const { heading, subheading, backgroundImage, cta, style = 'default' } = module

  const backgroundUrl = backgroundImage?.asset
    ? urlForImage(backgroundImage)?.width(1000).url()
    : null

  // Speech Bubble Style (for Success Stories)
  if (style === 'speechBubble') {
    return (
      <section className="bg-white overflow-hidden py-12 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            {/* Image (Centered) */}
            <div className="relative mb-8 h-[200px] w-[200px] md:h-[250px] md:w-[250px]">
              {backgroundUrl ? (
                <div className="h-full w-full overflow-hidden rounded-full border-4 border-ih-primary shadow-lg">
                  <Image
                    src={backgroundUrl}
                    alt={heading || 'Hero Image'}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 200px, 250px"
                  />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-400 border-4 border-gray-200">
                  No Image
                </div>
              )}
            </div>

            {/* Speech Bubble Content */}
            <div className="group relative max-w-2xl">
              {/* Bubble Tail */}
              <div className="absolute -top-4 left-1/2 -ml-4 h-8 w-8 rotate-45 border-l border-t border-gray-200 bg-white transition-colors group-hover:border-ih-primary group-hover:bg-ih-primary" />
              
              <div className="relative rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-md transition-all group-hover:-translate-y-1 group-hover:border-ih-primary group-hover:bg-ih-primary group-hover:shadow-xl">
                {heading && (
                  <h1 className="mb-4 font-heading text-3xl font-bold text-ih-text-dark transition-colors group-hover:text-white sm:text-4xl md:text-5xl">
                    {heading}
                  </h1>
                )}

                {subheading && (
                  <p className="font-body text-lg text-gray-600 transition-colors group-hover:text-white/90 sm:text-xl">
                    {subheading}
                  </p>
                )}
              </div>
            </div>

            {cta?.label && cta?.link && (
              <div className="mt-8">
                <Link
                  href={cta.link}
                  className="inline-block rounded-full bg-ih-text-dark px-8 py-3 font-sans text-sm font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-ih-primary hover:text-ih-text-dark hover:shadow-md"
                >
                  {cta.label}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Default Style
  return (
    <section className="bg-white overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image Column */}
          <div className="relative order-1 lg:order-1 h-[400px] w-full lg:h-[600px]">
            {backgroundUrl ? (
              <Image
                src={backgroundUrl}
                alt={heading || 'Hero Image'}
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
