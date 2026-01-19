import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import { useState } from 'react'
import type { ProductAdModule } from 'types'

interface ProductAdProps {
    module: ProductAdModule
}

export function ProductAd({ module }: ProductAdProps) {
    const {
        productTitle,
        subtitle,
        price,
        rating,
        reviewCount,
        description,
        images,
        ctaText = 'SHOP NOW',
        ctaLink,
        layout = 'imageLeft',
        backgroundColor = 'white',
    } = module

    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    if (!images || images.length === 0) {
        return null
    }

    const currentImageUrl = images[currentImageIndex]?.asset
        ? urlForImage(images[currentImageIndex])?.width(800).height(800).url()
        : null

    const thumbnailUrls = images.map((img) =>
        img.asset ? urlForImage(img)?.width(120).height(120).url() : null
    )

    const bgColorClasses = {
        white: 'bg-white',
        gray: 'bg-gray-100',
        cream: 'bg-amber-50',
    }

    const renderStars = (rating: number) => {
        const stars = []
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                </span>
            )
        }
        return stars
    }

    const ProductImage = () => (
        <div className="flex-1">
            {/* Main Image */}
            {currentImageUrl && (
                <div className="relative aspect-square w-full max-w-md mx-auto">
                    <Image
                        src={currentImageUrl}
                        alt={images[currentImageIndex]?.alt || productTitle}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            )}

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
                <div className="mt-4 flex gap-2 justify-center">
                    {thumbnailUrls.map((url, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative h-16 w-16 border-2 rounded overflow-hidden transition-all ${index === currentImageIndex ? 'border-gray-800' : 'border-gray-300'
                                }`}
                        >
                            {url && (
                                <Image src={url} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Previous image"
                    >
                        ❮
                    </button>
                    <button
                        onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Next image"
                    >
                        ❯
                    </button>
                </div>
            )}
        </div>
    )

    const ProductInfo = () => (
        <div className="flex-1 flex flex-col justify-center">
            {/* Paw Icon */}
            <div className="mb-4">
                <svg className="h-10 w-10 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C10.9 2 10 2.9 10 4s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM9 14c-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.6-.3 2.1-.9.5.6 1.3.9 2.1.9 1.7 0 3-1.3 3-3s-1.3-3-3-3c-.8 0-1.6.3-2.1.9-.5-.6-1.3-.9-2.1-.9z" />
                </svg>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                {productTitle}
            </h2>

            {subtitle && (
                <p className="text-lg md:text-xl font-serif italic text-gray-700 mb-4">{subtitle}</p>
            )}

            {price && <p className="text-xl md:text-2xl font-semibold text-gray-900
 mb-2">{price}</p>}

            {rating !== undefined && (
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex">{renderStars(rating)}</div>
                    {reviewCount !== undefined && (
                        <span className="text-sm text-gray-600">{reviewCount} reviews</span>
                    )}
                </div>
            )}

            {ctaLink && (
                <div className="mb-6">
                    <a
                        href={ctaLink}
                        className="inline-block px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-wide transition-colors rounded"
                    >
                        {ctaText}
                    </a>
                </div>
            )}

            {description && (
                <div className="text-gray-700 leading-relaxed">
                    <p className="text-base md:text-lg first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                        {description}
                    </p>
                </div>
            )}
        </div>
    )

    return (
        <section className={`py-16 md:py-24 ${bgColorClasses[backgroundColor]}`}>
            <div className="container mx-auto px-6">
                {layout === 'imageLeft' && (
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <ProductImage />
                        <ProductInfo />
                    </div>
                )}

                {layout === 'imageRight' && (
                    <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                        <ProductImage />
                        <ProductInfo />
                    </div>
                )}

                {layout === 'centered' && (
                    <div className="max-w-4xl mx-auto text-center">
                        <ProductInfo />
                        <div className="mt-8">
                            <ProductImage />
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default ProductAd
