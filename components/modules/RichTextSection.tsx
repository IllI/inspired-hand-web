import { PortableText } from '@portabletext/react'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import type { RichTextSectionModule } from 'types'

interface RichTextSectionProps {
  module: RichTextSectionModule
}

// Custom components for Portable Text rendering
export const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset) return null

      const imageUrl = urlForImage(value)?.width(800).height(600).url()

      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={value.alt || ''}
                fill
                className="object-cover"
              />
            )}
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-600">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 mt-8 text-2xl font-bold text-gray-900">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 mt-6 text-xl font-semibold text-gray-900">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mb-2 mt-4 text-lg font-semibold text-gray-900">
        {children}
      </h4>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-6 border-l-4 border-amber-600 pl-4 italic text-gray-600">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    underline: ({ children }: { children?: React.ReactNode }) => (
      <span className="underline">{children}</span>
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
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 text-gray-700">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
  },
}

export function RichTextSection({ module }: RichTextSectionProps) {
  const { heading, content, cta, centered } = module

  if (!heading && (!content || content.length === 0) && !cta) {
    return null
  }

  return (
    <section className="py-0 md:py-0">
      <div className="mx-auto max-w-3xl px-6">
        {heading && (
          <h2
            className={`mb-8 text-3xl font-bold text-gray-900 md:text-4xl font-heading ${centered ? 'text-center' : ''
              }`}
          >
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
          <div className={`mt-8 ${centered ? 'text-center' : ''}`}>
            <Link
              href={cta.link}
              className="inline-block rounded-md bg-ih-primary px-8 py-3 text-lg font-bold uppercase tracking-widest text-ih-text-dark transition-transform hover:scale-105"
            >
              {cta.label}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default RichTextSection
