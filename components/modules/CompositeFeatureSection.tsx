'use client'

import Image from 'next/image'
import { urlForImage } from 'lib/sanity.image'
import type { SanityImage } from 'types'

/**
 * CompositeFeatureSection
 * 
 * A split-screen feature section with text on one side and image on the other.
 * All content comes from Sanity - no hardcoded assets.
 */

export interface CompositeFeatureSectionModule {
    _type: 'compositeFeatureSection'
    _key: string
    variant?: 'bringsComfort' | 'default'
    heading?: string
    subheading?: string
    image?: SanityImage
    link?: string
}

interface CompositeFeatureSectionProps {
    module: CompositeFeatureSectionModule
}

export function CompositeFeatureSection({ module }: CompositeFeatureSectionProps) {
    const { variant = 'bringsComfort', heading, subheading, image } = module

    // Try to get image URL with multiple fallback strategies
    let imageUrl: string | null = null

    if (image?.asset) {
        try {
            // Primary: Use urlForImage helper
            imageUrl = urlForImage(image)?.width(1200).height(1200).url() || null

            // Fallback: Direct URL from asset if available
            if (!imageUrl && typeof image.asset === 'object' && 'url' in image.asset) {
                imageUrl = (image.asset as any).url
            }
        } catch (error) {
            console.error('Error generating image URL:', error)
        }
    }

    // "Brings Comfort" variant - green background with split layout
    if (variant === 'bringsComfort') {
        return (
            <section className="relative w-full overflow-hidden">
                <div className="flex flex-col lg:flex-row min-h-[550px] lg:min-h-[600px]">

                    {/* Left Column - Green Background with Content */}
                    <div className="relative flex-1 bg-ih-primary px-8 py-16 lg:py-24 lg:px-16">
                        <div className="relative z-10 flex h-full flex-col items-center lg:items-start justify-center max-w-md mx-auto lg:mx-0 lg:ml-auto lg:mr-16">

                            {/* Heart Icon */}
                            <div className="mb-6">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80 bg-transparent">
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="opacity-90"
                                    >
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Subheading */}
                            {subheading && (
                                <h3 className="mb-4 text-center lg:text-left text-xs font-bold uppercase tracking-[0.25em] text-ih-text-dark/70">
                                    {subheading}
                                </h3>
                            )}

                            {/* Main Heading */}
                            {heading && (
                                <h2 className="text-center lg:text-left font-heading text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight text-ih-text-dark">
                                    {heading}
                                </h2>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Photo */}
                    <div className="relative flex-1 min-h-[350px] lg:min-h-0 bg-gray-100">
                        {imageUrl && (
                            <Image
                                src={imageUrl}
                                alt={image?.alt || heading || 'Feature image'}
                                fill
                                className="object-cover"
                                priority
                            />
                        )}
                    </div>
                </div>
            </section>
        )
    }

    // Default variant - simpler centered version
    return (
        <section className="relative w-full bg-ih-primary py-16 lg:py-24">
            <div className="container mx-auto px-6 text-center">
                {subheading && (
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-ih-text-dark/70">
                        {subheading}
                    </h3>
                )}
                {heading && (
                    <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-ih-text-dark">
                        {heading}
                    </h2>
                )}
            </div>
        </section>
    )
}

export default CompositeFeatureSection
