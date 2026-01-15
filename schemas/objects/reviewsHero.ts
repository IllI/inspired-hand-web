import { DocumentTextIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'reviewsHero',
    title: 'Reviews Hero Section',
    type: 'object',
    icon: DocumentTextIcon,
    description: 'Interactive hero section for reviews with hover effect',
    fields: [
        defineField({
            name: 'backgroundImage',
            title: 'Background Image',
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
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'defaultText',
            title: 'Default Text (Before Hover)',
            type: 'string',
            initialValue: 'What are people saying?',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'hoverText',
            title: 'Hover Text',
            type: 'text',
            rows: 2,
            initialValue: 'Reviews from people just like you.',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'sectionTitle',
            title: 'Section Title (Below Hero)',
            type: 'string',
            initialValue: 'The Alpha, The Omega, And Fido Reviews',
        }),
    ],
    preview: {
        select: {
            title: 'defaultText',
            media: 'backgroundImage',
        },
        prepare({ title, media }) {
            return {
                title: title || 'Reviews Hero',
                subtitle: 'Interactive reviews section',
                media,
            }
        },
    },
})
