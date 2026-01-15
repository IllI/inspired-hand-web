import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import { useState } from 'react'
import type { ReviewsHeroModule } from 'types'

interface ReviewsHeroProps {
    module: ReviewsHeroModule
}

export function ReviewsHero({ module }: ReviewsHeroProps) {
    const { backgroundImage, defaultText, hoverText, sectionTitle } = module
    const [isHovered, setIsHovered] = useState(false)

    const backgroundUrl = backgroundImage?.asset
        ? urlForImage(backgroundImage)?.width(1920).url()
        : null

    const displayText = isHovered && hoverText ? hoverText : (defaultText || 'WHAT ARE PEOPLE SAYING?')

    return (
        <section className="relative overflow-hidden">
            {/* Full-width background */}
            <div
                className="relative h-[400px] md:h-[450px] flex items-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                role="region"
                aria-label="content changes on hover"
            >
                {/* Background Image */}
                {backgroundUrl && (
                    <Image
                        src={backgroundUrl}
                        alt={backgroundImage?.alt || 'Reviews background'}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                    />
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />

                {/* Content - Left aligned */}
                <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-12">
                    <div className="max-w-xs md:max-w-sm">
                        {/* SVG-based speech bubble exactly from Wix */}
                        <div className="relative" style={{ width: '280px', height: '240px' }}>
                            {/* Background SVG shape with exact Wix path */}
                            <svg
                                viewBox="15 10 170 180"
                                className="absolute inset-0 w-full h-full"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                {/* Main shape - filled with gold and dots */}
                                <defs>
                                    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.3)" />
                                    </pattern>
                                </defs>
                                <path
                                    d="M140.847 10L15 22.189v116.923L83.472 190v-19.053L185 161.479V44.438L140.847 10zm39.431 147.101L78.75 166.568v14.083l-59.028-43.787V26.45L139.43 14.852l40.847 31.953v110.296z"
                                    fill="#BDBF37"
                                    stroke="#000010"
                                    strokeWidth="8"
                                />
                                <rect x="15" y="10" width="170" height="180" fill="url(#dots)" />
                                <path
                                    d="M140.847 10L15 22.189v116.923L83.472 190v-19.053L185 161.479V44.438L140.847 10zm39.431 147.101L78.75 166.568v14.083l-59.028-43.787V26.45L139.43 14.852l40.847 31.953v110.296z"
                                    fill="none"
                                    stroke="#000010"
                                    strokeWidth="8"
                                />
                            </svg>

                            {/* Text overlay - centered in the shape */}
                            <div className="absolute inset-0 flex items-center justify-center px-8">
                                <h3 className="font-sans text-lg md:text-xl lg:text-2xl font-bold text-white uppercase text-center leading-tight tracking-wide">
                                    {displayText}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Title */}
            {sectionTitle && (
                <div className="bg-white py-12 md:py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-center font-serif text-3xl md:text-4xl lg:text-5xl text-ih-text-dark italic">
                            {sectionTitle}
                        </h2>
                        <div className="mt-6 mx-auto w-32 h-1 bg-gray-300" />
                    </div>
                </div>
            )}
        </section>
    )
}

export default ReviewsHero
