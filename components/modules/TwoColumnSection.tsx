import { PortableText } from '@portabletext/react'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import type { TwoColumnSectionModule } from 'types'

interface TwoColumnSectionProps {
  module: TwoColumnSectionModule
}

// Simple portable text components for the two-column section
const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 text-ih-text-dark opacity-80 leading-relaxed font-body">
        {children}
      </p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 text-2xl font-bold text-ih-text-dark font-heading">
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
          className="text-ih-primary underline hover:text-ih-primary-dark"
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
  const { layout = 'image-right', heading, content, image, cta } = module

  const imageUrl = image?.asset
    ? urlForImage(image)?.width(800).height(600).url()
    : null

  const isImageLeft = layout === 'image-left'

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-24 ${
            isImageLeft ? '' : 'lg:[&>*:first-child]:order-2'
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
