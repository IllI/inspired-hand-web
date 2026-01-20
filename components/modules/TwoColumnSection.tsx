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
  const {
    layout = 'image-right',
    heading,
    content,
    image,
    cta,
    style,
    backgroundColor,
    textColor = 'default'
  } = module

  const imageUrl = image?.asset
    ? urlForImage(image)?.width(1200).height(1000).url()
    : null

  const isImageLeft = layout === 'image-left'

  // Determine text color classes
  const textColorClass = textColor === 'white' ? 'text-white' : 'text-ih-text-dark'
  const headingColorClass = textColor === 'white' ? 'text-white' : 'text-ih-text-dark'

  // Custom background color style
  const bgStyle = backgroundColor ? { backgroundColor } : {}

  // Full-width Split Style
  if (style && style !== 'transparent') {
    // Determine background based on custom backgroundColor or default style
    const customBg = backgroundColor
    const bgClass = customBg
      ? '' // We'll use inline style
      : style === 'primary'
        ? 'bg-ih-primary'
        : style === 'accent'
          ? 'bg-ih-accent'
          : 'bg-gray-100'

    const isBringsComfort = heading?.includes('Brings comfort')
    const isOurStoryWix = backgroundColor === '#335168'
    const isNeedPrayer = heading?.includes('Need prayer')

    return (
      <section
        className="w-full"
        style={{
          margin: '0px 0px 10px calc((100% - 980px) * 0.5)',
          padding: 0
        }}
      >
        <div
          className="flex flex-col lg:flex-row"
          style={{
            height: 'auto',
            margin: 0,
            padding: 0,
            gap: 10,
            margin: '0px 0px 10px calc((100% - 980px) * 0.5)',
            columnGap: 10,
            rowGap: 10,
          }}
        >
          {/* Image Column */}
          <div
            className={`relative lg:w-1/2 ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}
            style={{
              height: '450px',
              minHeight: '450px',
              margin: 0,
              padding: 0,
            }}
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

            {/* Handshake Icon Overlay (Specific to Brings Comfort) */}
            {isBringsComfort && (
              <div className="absolute -bottom-16 -left-16 hidden lg:block z-10 w-48 h-48">
                {/* This would be the handshake image if we had the asset, for now using the layout placeholder or the one from the script if provided via some other means.
                     Actually, better to hardcode the layout here. */}
                <div className="relative w-full h-full">
                  <Image
                    src="https://static.wixstatic.com/media/094b4537b0542968f67acafa194c1351.png"
                    alt="Handshake"
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content Column */}
          <div
            className={`flex flex-col justify-center lg:w-1/2 ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}
            style={{
              backgroundColor: customBg || (isNeedPrayer ? '#ffffff' : undefined),
              padding: '4rem 4rem',
              minHeight: '450px',
              margin: 0,
            }}
          >
            {/* Top Heart Icon (Specific to Brings Comfort) */}
            {isBringsComfort && (
              <div className="mb-8 flex justify-center lg:justify-start">
                <div className="rounded-full border-2 border-white p-3 text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              </div>
            )}

            <div className={`mx-auto max-w-sm ${isBringsComfort || isOurStoryWix ? 'lg:mx-0 text-center lg:text-left' : 'text-center'}`}>

              {/* Special "Our Story" Wix rendering */}
              {isOurStoryWix && content && content.length >= 3 ? (
                <>
                  {/* "OUR STORY" Label */}
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/90 mb-6">
                    {content[0]?.children?.[0]?.text || 'OUR STORY'}
                  </p>

                  {/* Quote */}
                  <blockquote className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-[1.15] mb-6">
                    {content[1]?.children?.[0]?.text || ''}
                  </blockquote>

                  {/* Bible Verse in Script Font */}
                  <p className="text-2xl md:text-3xl text-white/90 mb-8" style={{
                    fontFamily: 'var(--font-script)',
                    fontStyle: 'italic'
                  }}>
                    {content[2]?.children?.[0]?.text || ''}
                  </p>
                </>
              ) : (
                <>
                  {/* Special Layout for Brings Comfort: Subheading above Heading */}
                  {isBringsComfort ? (
                    <>
                      <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-ih-text-dark/80">
                        THE INSPIRED HAND MINISTRY
                      </h3>
                      {heading && (
                        <h2 className="mb-6 font-heading text-4xl font-bold leading-tight text-ih-text-dark md:text-5xl lg:text-6xl">
                          {heading}
                        </h2>
                      )}
                    </>
                  ) : (
                    <>
                      {heading && (
                        <h2 className={`mb-6 text-3xl md:text-4xl lg:text-5xl font-bold ${textColorClass} font-heading leading-tight`}>
                          {heading}
                        </h2>
                      )}
                    </>
                  )}

                  {content && content.length > 0 && !isOurStoryWix && (
                    <div className={`prose prose-base max-w-none ${textColorClass} ${isBringsComfort ? 'hidden' : ''} mb-8`}>
                      <PortableText
                        value={content}
                        components={portableTextComponents}
                      />
                    </div>
                  )}
                </>
              )}

              {cta?.label && cta?.link && (
                <div className="mt-2">
                  <Link
                    href={cta.link}
                    className={`inline-block rounded-none px-12 py-4 text-sm font-bold uppercase tracking-wider transition-colors shadow-sm ${isNeedPrayer
                      ? 'bg-[#5DA1D4] text-white hover:bg-[#4a8bb8]' // Blue for prayer
                      : textColor === 'white'
                        ? 'bg-white text-ih-text-dark hover:bg-gray-100' // White for Our Story
                        : 'bg-ih-text-dark text-white hover:bg-gray-900' // Default
                      }`}
                  >
                    {cta.label}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Handshake Icon (Visible only on small screens) */}
            {isBringsComfort && (
              <div className="mt-12 flex justify-center lg:hidden">
                <div className="relative w-32 h-32">
                  <Image
                    src="https://static.wixstatic.com/media/094b4537b0542968f67acafa194c1351.png"
                    alt="Handshake"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    )
  }

  // Special "Our Story" Wix Style (dark background with specific typography)
  const isOurStory = backgroundColor === '#335168' && textColor === 'white'

  if (isOurStory && content && content.length >= 3) {
    // Extract the three text blocks: label, quote, verse
    const labelText = content[0]?.children?.[0]?.text || 'OUR STORY'
    const quoteText = content[1]?.children?.[0]?.text || ''
    const verseText = content[2]?.children?.[0]?.text || ''

    return (
      <section className="py-12 md:py-20" style={bgStyle}>
        <div className="container mx-auto px-4 md:px-6">
          <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-24 ${isImageLeft ? '' : 'lg:[&>*:first-child]:order-2'
            }`}>
            {/* Image Column */}
            <div className="relative aspect-[4/3] overflow-hidden shadow-sm">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={image?.alt || 'Our Story'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-700">
                  <span className="text-gray-400 font-mono text-sm">No Image</span>
                </div>
              )}
            </div>

            {/* Content Column - Wix "Our Story" Style */}
            <div className="flex flex-col justify-center text-center lg:text-left px-6 lg:px-12">
              {/* "OUR STORY" Label */}
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/80 mb-6">
                {labelText}
              </p>

              {/* Quote */}
              <blockquote className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight mb-6">
                {quoteText}
              </blockquote>

              {/* Bible Verse in Script Font */}
              <p className="text-xl md:text-2xl text-white/90 mb-8" style={{
                fontFamily: 'var(--font-script)',
                fontStyle: 'italic'
              }}>
                {verseText}
              </p>

              {/* CTA Button */}
              {cta?.label && cta?.link && (
                <div className="mt-4">
                  <Link
                    href={cta.link}
                    className="inline-block rounded-none bg-white px-8 py-3 text-sm font-bold uppercase tracking-widest text-ih-text-dark transition-colors hover:bg-gray-100 shadow-sm"
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
    <section className="py-12 md:py-20" style={bgStyle}>
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
              <h2 className={`mb-6 text-3xl font-bold ${headingColorClass} font-heading md:text-4xl lg:text-5xl`}>
                {heading}
              </h2>
            )}

            {content && content.length > 0 && (
              <div className={`prose prose-lg max-w-none ${textColorClass}`}>
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
                  className={`inline-block rounded-none px-8 py-3 text-sm font-bold uppercase tracking-widest transition-colors shadow-sm ${textColor === 'white'
                    ? 'bg-white text-ih-text-dark hover:bg-gray-100'
                    : 'bg-ih-primary text-ih-text-dark hover:bg-ih-primary-light'
                    }`}
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
