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
            {/* Full-width background with text overlay */}
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

                {/* Dark overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />

                {/* Content Container - Left aligned */}
                <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-12">
                    <div className="max-w-xs md:max-w-sm">
                        {/* Octagonal speech bubble */}
                        <div className="relative">
                            {/* Main octagon shape with exact Wix styling */}
                            <div
                                className="relative px-8 py-12 md:px-10 md:py-14"
                                style={{
                                    background: '#BDBF37',
                                    clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                                    border: '8px solid #1a1a1a',
                                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                }}
                            >
                                {/* Text content */}
                                <div className="text-center">
                                    <h3 className="font-sans text-xl md:text-2xl lg:text-3xl font-bold text-white uppercase leading-tight tracking-wide">
                                        {displayText}
                                    </h3>
                                </div>
                            </div>

                            {/* Speech bubble tail - triangle pointing down */}
                            <div className="absolute -bottom-10 left-10">
                                <svg width="60" height="60" viewBox="0 0 60 60">
                                    <polygon
                                        points="10,0 60,0 10,50"
                                        fill="#BDBF37"
                                        stroke="#1a1a1a"
                                        strokeWidth="8"
                                        strokeLinejoin="miter"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Title Below */}
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
