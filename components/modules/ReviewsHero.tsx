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
            {/* Reviews Hero with Hover Effect */}
            <div
                className="relative h-[400px] md:h-[450px] flex items-center justify-center overflow-hidden group"
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
                        />
                        {/* Overlay - darker on default, lighter on hover */}
                        <div className={`absolute inset-0 transition-colors duration-500 ${isHovered ? 'bg-amber-900/40' : 'bg-blue-900/50'
                            }`} />
                    </>
                )}

                {/* Content Container */}
                <div className="relative z-10 container mx-auto px-4">
                    {/* Speech Bubble / Hexagon Shape */}
                    <div className="relative mx-auto max-w-md">
                        {/* The shaped container */}
                        <div className="relative">
                            {/* Hexagonal/Speech Bubble Background */}
                            <div className={`relative px-12 py-16 transition-all duration-500 ${isHovered
                                ? 'bg-white/90 backdrop-blur-sm'
                                : 'bg-gradient-to-br from-yellow-400/95 to-yellow-500/95'
                                }`}
                                style={{
                                    clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 70%, 90% 100%, 30% 100%, 20% 85%, 0% 70%, 0% 10%)'
                                }}>

                                {/* Paw Print Icon - Only visible when not hovered */}
                                {!isHovered && (
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2">
                                        <svg className="w-16 h-16 text-amber-600" viewBox="0 0 200 200" fill="currentColor">
                                            <path d="M140.847 10L15 22.189v116.923L83.472 190v-19.053L185 161.479V44.438L140.847 10zm39.431 147.101L78.75 166.568v14.083l-59.028-43.787V26.45L139.43 14.852l40.847 31.953v110.296z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Text Content */}
                                <div className="text-center pt-20">
                                    {!isHovered ? (
                                        // Default State
                                        <h6 className={`font-sans text-3xl md:text-4xl font-bold uppercase tracking-wide transition-colors duration-500 ${isHovered ? 'text-black' : 'text-white'
                                            }`}>
                                            {defaultText}
                                        </h6>
                                    ) : (
                                        // Hover State
                                        <h2 className="font-sans text-2xl md:text-3xl text-black transition-opacity duration-500">
                                            {hoverText && (
                                                <>
                                                    <span className="font-bold">
                                                        {hoverText.includes(' just like you')
                                                            ? hoverText.split(' just like you')[0]
                                                            : hoverText}
                                                    </span>
                                                    {hoverText.includes(' just like you') && (
                                                        <>
                                                            {' '}
                                                            <span className="italic font-normal">just like you.</span>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </h2>
                                    )}
                                </div>

                                {/* Book Frame Icon - Only visible when hovered */}
                                {isHovered && (
                                    <div className="absolute bottom-4 right-4">
                                        <svg className="w-12 h-12 text-black" viewBox="15 10 170 180" fill="currentColor">
                                            <path d="M140.847 10L15 22.189v116.923L83.472 190v-19.053L185 161.479V44.438L140.847 10zm39.431 147.101L78.75 166.568v14.083l-59.028-43.787V26.45L139.43 14.852l40.847 31.953v110.296z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Speech Bubble Tail - Only visible when not hovered */}
                            {!isHovered && (
                                <div className="absolute -bottom-8 left-12">
                                    <svg className="w-16 h-16 text-yellow-500" viewBox="0 0 100 100">
                                        <polygon points="50,0 0,50 100,100" fill="currentColor" opacity="0.95" />
                                    </svg>
                                </div>
                            )}

                            {/* Arrow Icon - Only visible when hovered */}
                            {isHovered && (
                                <div className="absolute -bottom-4 right-8 animate-bounce">
                                    <svg className="w-10 h-10 text-green-600" viewBox="17 47 165 105" fill="currentColor">
                                        <path d="M175.5 148.8c-24.8 6.8-44.6 3.8-71.8-6.7-17.9-6.9-44.4-22.9-59.4-41.8.2 3.8.7 7.7 1.5 11.6 3.5 16.8-22.3 23.9-25.9 7.1-4.5-21.1-2.6-41.5 4.5-61.8 2.5-6.8 9.1-11.3 16.4-9.3 18.5 4.9 37.5 12.3 53.5 22.8 14.3 9.4.9 32.5-13.5 23-4.8-3.1-9.8-5.9-15.1-8.5 11.2 17 38.7 34.3 52.1 39.2 16 5.9 39 8.7 56.2 9.8 13.3 1 8.9 12.6 1.5 14.6z" />
                                    </svg>
                                </div>
                            )}
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
