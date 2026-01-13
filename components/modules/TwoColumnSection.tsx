import { PortableText } from '@portabletext/react'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import type { TwoColumnSectionModule } from 'types'

interface TwoColumnSectionProps {
  module: TwoColumnSectionModule
}

// Custom components for Portable Text rendering
const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset) return null
      const imageUrl = urlForImage(value)?.width(400).url()
      return (
        <div className="mb-6 flex justify-center">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={value.alt || ''}
              width={100}
              height={100}
              className="object-contain"
            />
          )}
        </div>
      )
    },
  },
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 text-ih-text-dark opacity-90 leading-relaxed font-body">
        {children}
      </p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 text-3xl font-bold text-ih-text-dark font-heading">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 text-xl font-semibold text-ih-text-dark font-heading">
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-ih-text-dark">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({
      value,
      children,
    }: {
      value?: { href?: string }
      children?: React.ReactNode
    }) => {
      const href = value?.href || '#'
      const isExternal = href.startsWith('http')

      return (
        <a
          href={href}
          className="text-ih-text-dark underline hover:opacity-80"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
  },
}

export function TwoColumnSection({ module }: TwoColumnSectionProps) {
  const { layout = 'image-right', heading, content, image, cta, style } = module

  const imageUrl = image?.asset
    ? urlForImage(image)?.width(1200).height(1000).url()
    : null

  const isImageLeft = layout === 'image-left'

  // Full-width Split Style
  if (style && style !== 'transparent') {
    const bgClass =
      style === 'primary'
        ? 'bg-ih-primary'
        : style === 'accent'
          ? 'bg-ih-accent'
          : 'bg-gray-100'

    return (
      <section className="w-full">
        <div className="flex flex-col lg:flex-row min-h-[500px] lg:h-[600px]">
          {/* Image Column */}
          <div
            className={`relative h-64 lg:h-full lg:w-1/2 ${isImageLeft ? 'lg:order-1' : 'lg:order-2'
              }`}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={image?.alt || heading || ''}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <span className="text-gray-400 font-mono text-sm">
                  No Image
                </span>
              </div>
            )}
          </div>

          {/* Content Column */}
          <div
            className={`flex flex-col justify-center px-8 py-12 lg:w-1/2 lg:p-24 text-center ${bgClass} ${isImageLeft ? 'lg:order-2' : 'lg:order-1'
              }`}
          >
            <div className="mx-auto max-w-lg">
              {heading && (
                <h2 className="mb-6 text-3xl font-bold text-ih-text-dark font-heading md:text-4xl lg:text-5xl">
                  {heading}
                </h2>
              )}

              {content && content.length > 0 && (
                <div className="prose prose-lg max-w-none text-ih-text-dark">
                  <PortableText
                    value={content}
                    components={portableTextComponents}
                  />
                </div>
              )}

              {cta?.label && cta?.link && (
                <div className="mt-8">
                  <Link
                    href={cta.link}
                    className="inline-block rounded-none bg-ih-text-dark px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-900 shadow-sm"
                  >
                    {cta.label}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Default Contained Style
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-24 ${isImageLeft ? '' : 'lg:[&>*:first-child]:order-2'
            }`}
        >
          {/* Image Column */}
          <div className="relative aspect-[4/3] overflow-hidden shadow-sm">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={image?.alt || heading || ''}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <span className="text-gray-400 font-mono text-sm">
                  No Image
                </span>
              </div>
            )}
          </div>

          {/* Content Column */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            {heading && (
              <h2 className="mb-6 text-3xl font-bold text-ih-text-dark font-heading md:text-4xl lg:text-5xl">
                {heading}
              </h2>
            )}

            {content && content.length > 0 && (
              <div className="prose prose-lg max-w-none text-ih-text-dark">
                <PortableText
                  value={content}
                  components={portableTextComponents}
                />
              </div>
            )}

            {cta?.label && cta?.link && (
              <div className="mt-8">
                <Link
                  href={cta.link}
                  className="inline-block rounded-none bg-ih-primary px-8 py-3 text-sm font-bold uppercase tracking-widest text-ih-text-dark transition-colors hover:bg-ih-primary-light shadow-sm"
                >
                  {cta.label}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TwoColumnSection
