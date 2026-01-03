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
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 text-2xl font-bold text-gray-900">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 text-xl font-semibold text-gray-900">{children}</h3>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold">{children}</strong>
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
          className="text-amber-700 underline hover:text-amber-800"
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
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16 ${
            isImageLeft ? '' : 'md:[&>*:first-child]:order-2'
          }`}
        >
          {/* Image Column */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={image?.alt || heading || ''}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>

          {/* Content Column */}
          <div className="flex flex-col justify-center">
            {heading && (
              <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                {heading}
              </h2>
            )}

            {content && content.length > 0 && (
              <div className="prose prose-lg max-w-none">
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
                  className="inline-block rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-700"
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
