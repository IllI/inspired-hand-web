'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from 'lib/sanity.image'
import type { SanityImage } from 'types'

/**
 * CompositeFeatureSection
 * 
 * A freeform canvas-style section that composites text, icons, and images
 * with precise positioning, similar to Wix's vector block editor.
 * This is used for complex layouts like the "Brings comfort..." banner.
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
    const { variant = 'bringsComfort', heading, subheading, image, link } = module

    const imageUrl = image?.asset
        ? urlForImage(image)?.width(1200).height(1200).url()
        : 'https://static.wixstatic.com/media/1a14de_45745c1f2a964e7b8526a6dc1f89bf44~mv2.jpg/v1/crop/x_239,y_92,w_973,h_974/fill/w_591,h_590,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/1a14de_45745c1f2a964e7b8526a6dc1f89bf44~mv2.jpg'

    // "Brings Comfort" variant - matches the Wix Resources page banner
    if (variant === 'bringsComfort') {
        return (
            <section className="relative w-full overflow-hidden">
                {/* Main Container - Full Width Split */}
                <div className="flex flex-col lg:flex-row min-h-[550px] lg:min-h-[600px]">

                    {/* Left Column - Green Background with Content */}
                    <div className="relative flex-1 bg-ih-primary px-8 py-16 lg:py-24 lg:px-16">
                        {/* Content Container - Centered on mobile, left-aligned on desktop */}
                        <div className="relative z-10 flex h-full flex-col items-center lg:items-start justify-center max-w-md mx-auto lg:mx-0 lg:ml-auto lg:mr-16">

                            {/* Heart Icon in Circle - Top */}
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

                            {/* Subheading - "THE INSPIRED HAND MINISTRY" */}
                            <h3 className="mb-4 text-center lg:text-left text-xs font-bold uppercase tracking-[0.25em] text-ih-text-dark/70">
                                {subheading || 'The Inspired Hand Ministry'}
                            </h3>

                            {/* Main Heading */}
                            <h2 className="text-center lg:text-left font-heading text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight text-ih-text-dark">
                                {heading || 'Brings comfort and guidance to your pets lives'}
                            </h2>
                        </div>

                        {/* Logo/Paw Icon with Circle - Positioned in bottom area on desktop */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 lg:left-16 lg:translate-x-0 hidden lg:flex items-center justify-center">
                            <div className="relative">
                                {/* Outer Circle */}
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-ih-text-dark/10">
                                    {/* Paw Icon - Using the actual Inspired Hand paw logo */}
                                    <Image
                                        src="https://static.wixstatic.com/media/e75f0ceccc32d473b73b0cb1bac39f09.png"
                                        alt="Inspired Hand Logo"
                                        width={50}
                                        height={68}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Photo */}
                    <div className="relative flex-1 min-h-[350px] lg:min-h-0">
                        <Image
                            src={imageUrl}
                            alt={image?.alt || 'Child playing with dog'}
                            fill
                            className="object-cover"
                            priority
                        />

                        {/* Handshake Icon - Overlapping between columns */}
                        <div className="absolute -left-20 bottom-8 z-20 hidden lg:block">
                            <div className="relative h-48 w-48">
                                <Image
                                    src="https://static.wixstatic.com/media/094b4537b0542968f67acafa194c1351.png"
                                    alt="Handshake"
                                    fill
                                    className="object-contain drop-shadow-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Handshake Icon - Centered below on small screens */}
                <div className="flex justify-center py-8 lg:hidden bg-white">
                    <div className="relative h-32 w-32">
                        <Image
                            src="https://static.wixstatic.com/media/094b4537b0542968f67acafa194c1351.png"
                            alt="Handshake"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </section>
        )
    }

    // Default variant - simpler version
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
