'use client'

/**
 * TestimonialSection
 * 
 * Displays a customer testimonial with a 5-star rating
 * Used for product reviews and customer feedback
 */

export interface TestimonialSectionModule {
    _type: 'testimonialSection'
    _key: string
    quote: string
    authorName?: string
    rating?: number // 1-5 stars
}

interface TestimonialSectionProps {
    module: TestimonialSectionModule
}

export function TestimonialSection({ module }: TestimonialSectionProps) {
    const { quote, authorName, rating = 5 } = module

    return (
        <section className="bg-gray-100 py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-6 text-center">
                {/* Star Rating */}
                <div className="mb-6 flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className={`h-8 w-8 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>

                {/* Quote */}
                <blockquote className="mb-6 text-xl font-medium italic text-gray-800 md:text-2xl lg:text-3xl font-heading">
                    &quot;{quote}&quot;
                </blockquote>

                {/* Author */}
                {authorName && (
                    <cite className="block text-lg font-semibold not-italic text-gray-900 font-body">
                        — {authorName}
                    </cite>
                )}
            </div>
        </section>
    )
}

export default TestimonialSection
