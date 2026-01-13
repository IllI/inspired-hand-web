import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import type { QuoteSectionModule } from 'types'

interface QuoteSectionProps {
  module: QuoteSectionModule
}

export function QuoteSection({ module }: QuoteSectionProps) {
  const {
    quote,
    authorName: attribution,
    bookTitle: source,
    style = 'default',
    backgroundImage,
    authorImage,
  } = module

  if (!quote) {
    return null
  }

  const backgroundUrl = backgroundImage?.asset
    ? urlForImage(backgroundImage)?.width(1920).height(800).url()
    : null

  const authorImageUrl = authorImage?.asset
    ? urlForImage(authorImage)?.width(200).height(200).url()
    : null

  // Simple style (Light Grey - Wix Match)
  if (style === 'simple') {
    return (
      <section className="bg-gray-100 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <svg
            className="mx-auto mb-6 h-10 w-10 text-ih-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          <blockquote className="mb-6 text-xl font-medium italic text-gray-800 md:text-2xl lg:text-3xl font-heading">
            &quot;{quote}&quot;
          </blockquote>

          {(attribution || source) && (
            <div className="flex flex-col items-center gap-1">
              {attribution && (
                <cite className="block text-lg font-semibold not-italic text-gray-900 font-body">
                  — {attribution}
                </cite>
              )}
              {source && (
                <span className="text-sm text-gray-500 font-body">{source}</span>
              )}
            </div>
          )}
        </div>
      </section>
    )
  }

  // Large style
  if (style === 'large') {
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <svg
            className="mx-auto mb-6 h-12 w-12 text-amber-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          <blockquote className="mb-6 text-2xl font-medium italic text-gray-900 md:text-3xl lg:text-4xl">
            &quot;{quote}&quot;
          </blockquote>

          <div className="flex flex-col items-center justify-center gap-4">
            {authorImageUrl && (
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-amber-200">
                <Image
                  src={authorImageUrl}
                  alt={attribution || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {(attribution || source) && (
              <div className="text-gray-600">
                {attribution && (
                  <cite className="block text-lg font-semibold not-italic text-amber-700">
                    — {attribution}
                  </cite>
                )}
                {source && (
                  <span className="text-sm text-gray-500">{source}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Background style
  if (style === 'background' || backgroundUrl) {
    return (
      <section
        className="relative overflow-hidden py-16 md:py-24"
        style={
          backgroundUrl
            ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${backgroundUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
            : undefined
        }
      >
        {!backgroundUrl && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
        )}

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <svg
            className="mx-auto mb-6 h-10 w-10 text-amber-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          <blockquote className="mb-6 text-xl font-medium italic text-white md:text-2xl lg:text-3xl">
            &quot;{quote}&quot;
          </blockquote>

          <div className="flex flex-col items-center justify-center gap-4">
            {authorImageUrl && (
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-amber-500/50">
                <Image
                  src={authorImageUrl}
                  alt={attribution || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {(attribution || source) && (
              <div>
                {attribution && (
                  <cite className="block text-lg font-semibold not-italic text-amber-400">
                    — {attribution}
                  </cite>
                )}
                {source && (
                  <span className="text-sm text-gray-400">{source}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Default style (with image support)
  const { role } = module // Ensure role is destructured if not already

  return (
    <section className="bg-amber-50 py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
          {authorImageUrl && (
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-white shadow-md md:h-32 md:w-32">
              <Image
                src={authorImageUrl}
                alt={attribution || 'Author'}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className={`text-center ${authorImageUrl ? 'md:text-left' : ''}`}>
            <svg
              className={`mb-4 h-8 w-8 text-amber-600/60 ${authorImageUrl ? 'mx-auto md:mx-0' : 'mx-auto'}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <blockquote className="mb-4 text-lg italic text-gray-800 md:text-xl">
              &quot;{quote}&quot;
            </blockquote>

            {(attribution || source || role) && (
              <div className="text-gray-600">
                <div className="text-lg">
                  {attribution && (
                    <cite className="inline font-semibold not-italic text-amber-700">
                      — {attribution}
                    </cite>
                  )}
                  {source && (
                    <>
                      <span className="text-amber-700 mr-1">, </span>
                      <span className="text-amber-700 italic font-semibold">{source}</span>
                    </>
                  )}
                  {role && (
                    <span className="text-amber-700 font-semibold ml-1">
                      {role}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuoteSection
