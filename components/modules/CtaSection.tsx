import { urlForImage } from 'lib/sanity.image'
import Link from 'next/link'
import type { CtaSectionModule } from 'types'

interface CtaSectionProps {
  module: CtaSectionModule
}

export function CtaSection({ module }: CtaSectionProps) {
  const {
    heading,
    description,
    buttonLabel,
    buttonLink,
    style = 'primary',
    backgroundImage,
  } = module

  const backgroundUrl = backgroundImage?.asset
    ? urlForImage(backgroundImage)?.width(1920).height(800).url()
    : null

  // Style configurations based on the style prop
  const styleConfig = {
    primary: {
      bg: 'bg-ih-primary',
      text: 'text-ih-text-dark',
      subtext: 'text-ih-text-dark/90',
      button: 'bg-ih-accent text-white hover:bg-opacity-90',
    },
    secondary: {
      bg: 'bg-gray-100',
      text: 'text-gray-900',
      subtext: 'text-gray-600',
      button: 'bg-ih-text-dark text-white hover:bg-ih-primary hover:text-ih-text-dark',
    },
    accent: {
      bg: 'bg-ih-accent',
      text: 'text-white',
      subtext: 'text-white/90',
      button: 'bg-white text-ih-accent hover:bg-gray-100',
    },
  }

  const config = styleConfig[style] || styleConfig.primary

  return (
    <section
      className={`relative overflow-hidden py-16 md:py-24 ${backgroundUrl ? '' : config.bg
        }`}
      style={
        backgroundUrl
          ? {
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
          : undefined
      }
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        {heading && (
          <h2
            className={`mb-4 text-3xl font-bold md:text-4xl lg:text-5xl ${backgroundUrl ? 'text-white' : config.text
              }`}
          >
            {heading}
          </h2>
        )}

        {description && (
          <p
            className={`mx-auto mb-8 max-w-2xl text-lg md:text-xl ${backgroundUrl ? 'text-gray-200' : config.subtext
              }`}
          >
            {description}
          </p>
        )}

        {buttonLabel && buttonLink && (
          <Link
            href={buttonLink}
            className={`inline-block rounded-lg px-8 py-4 text-lg font-semibold transition-colors ${backgroundUrl
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : config.button
              }`}
          >
            {buttonLabel}
          </Link>
        )}
      </div>

      {/* Decorative elements for visual interest */}
      {!backgroundUrl && style === 'primary' && (
        <>
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/20" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/20" />
        </>
      )}
    </section>
  )
}

export default CtaSection
