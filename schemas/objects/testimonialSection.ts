import { StarIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'testimonialSection',
    title: 'Testimonial Section',
    type: 'object',
    icon: StarIcon,
    description: 'A customer testimonial with star rating',
    fields: [
        defineField({
            name: 'quote',
            title: 'Quote',
            type: 'text',
            rows: 4,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'authorName',
            title: 'Author Name',
            type: 'string',
        }),
        defineField({
            name: 'rating',
            title: 'Star Rating',
            type: 'number',
            initialValue: 5,
            validation: (rule) => rule.min(1).max(5).integer(),
            description: 'Number of stars (1-5)',
        }),
    ],
    preview: {
        select: {
            quote: 'quote',
            author: 'authorName',
            rating: 'rating',
        },
        prepare({ quote, author, rating }) {
            const stars = '⭐'.repeat(rating || 5)
            return {
                title: quote ? `"${quote.substring(0, 60)}..."` : 'Testimonial',
                subtitle: `${stars} ${author ? `— ${author}` : ''}`,
            }
        },
    },
})
