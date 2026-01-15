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

    return (
        <section className="relative overflow-hidden">
            {/* Reviews Hero with Hover Effect - Full Width Background */}
            <div
                className="relative h-[400px] md:h-[450px] flex items-center overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                role="region"
                aria-label="content changes on hover"
            >
                {/* Background Image */}
                {backgroundUrl && (
                    <>
                        <Image
                            src={backgroundUrl}
                            alt={backgroundImage?.alt || 'Reviews background'}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority
                        />
                        {/* Darker overlay for better contrast */}
                        <div className="absolute inset-0 bg-black/30" />
                    </>
                )}

                {/* Left-aligned hexagonal bubble container */}
                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-xs">
                        {/* Hexagonal Speech Bubble */}
                        <div className="relative">
                            {/* Main hexagon shape with border */}
                            <div
                                className={`relative px-8 py-12 border-4 border-black transition-all duration-500 ${isHovered
                                        ? 'bg-yellow-600/95'
                                        : 'bg-yellow-500/95'
                                    }`}
                                style={{
                                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 25%, 100% 75%, 85% 100%, 15% 100%, 0% 75%, 0% 25%)'
                                }}
                            >
                                {/* Text Content */}
                                <div className="text-center">
                                    <h6 className="font-sans text-2xl md:text-3xl font-bold text-white uppercase leading-tight">
                                        {isHovered && hoverText ? hoverText : (defaultText || 'What are people saying?')}
                                    </h6>
                                </div>
                            </div>

                            {/* Speech bubble tail */}
                            <div className="absolute -bottom-6 left-8">
                                <svg width="40" height="40" viewBox="0 0 40 40" className="text-yellow-500">
                                    <polygon points="0,0 40,0 0,40" fill="currentColor" stroke="black" strokeWidth="4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Title Below Hero */}
            {sectionTitle && (
                <div className="bg-white py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-center font-serif text-3xl md:text-4xl text-ih-text-dark italic">
                            {sectionTitle}
                        </h2>
                        <div className="mt-4 mx-auto w-24 h-1 bg-ih-primary" />
                    </div>
                </div>
            )}
        </section>
    )
}

export default ReviewsHero
