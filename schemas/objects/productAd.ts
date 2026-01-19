import { PackageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'productAd',
    title: 'Product Advertisement',
    type: 'object',
    icon: PackageIcon,
    fields: [
        defineField({
            name: 'productTitle',
            title: 'Product Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'string',
            description: 'e.g., "Ministry Set"',
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'string',
            description: 'e.g., "$79.99 USD"',
        }),
        defineField({
            name: 'rating',
            title: 'Star Rating',
            type: 'number',
            description: 'Out of 5 stars',
            validation: (rule) => rule.min(0).max(5),
        }),
        defineField({
            name: 'reviewCount',
            title: 'Number of Reviews',
            type: 'number',
        }),
        defineField({
            name: 'description',
            title: 'Product Description',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'images',
            title: 'Product Images',
            type: 'array',
            description: 'Add multiple images for the carousel',
            of: [
                {
                    type: 'image',
                    options: {
                        hotspot: true,
                    },
                    fields: [
                        defineField({
                            name: 'alt',
                            title: 'Alt Text',
                            type: 'string',
                        }),
                    ],
                },
            ],
            validation: (rule) => rule.min(1).required(),
        }),
        defineField({
            name: 'video',
            title: 'Product Video (Optional)',
            type: 'url',
            description: 'YouTube, Vimeo, or direct video URL',
        }),
        defineField({
            name: 'ctaText',
            title: 'Call to Action Text',
            type: 'string',
            initialValue: 'SHOP NOW',
        }),
        defineField({
            name: 'ctaLink',
            title: 'Call to Action Link',
            type: 'string',
            description: 'Where the button should link to',
        }),
        defineField({
            name: 'layout',
            title: 'Layout Style',
            type: 'string',
            options: {
                list: [
                    { title: 'Image Left, Text Right', value: 'imageLeft' },
                    { title: 'Image Right, Text Left', value: 'imageRight' },
                    { title: 'Centered', value: 'centered' },
                ],
                layout: 'radio',
            },
            initialValue: 'imageLeft',
        }),
        defineField({
            name: 'backgroundColor',
            title: 'Background Color',
            type: 'string',
            options: {
                list: [
                    { title: 'White', value: 'white' },
                    { title: 'Light Gray', value: 'gray' },
                    { title: 'Cream', value: 'cream' },
                ],
            },
            initialValue: 'white',
        }),
        defineField({
            name: 'socialHashtags',
            title: 'Social Media Hashtags',
            type: 'array',
            description: 'For future social media integration',
            of: [{ type: 'string' }],
        }),
    ],
    preview: {
        select: {
            title: 'productTitle',
            subtitle: 'subtitle',
            media: 'images.0',
        },
        prepare({ title, subtitle, media }) {
            return {
                title: title || 'Product Ad',
                subtitle: subtitle || 'No subtitle',
                media,
            }
        },
    },
})
