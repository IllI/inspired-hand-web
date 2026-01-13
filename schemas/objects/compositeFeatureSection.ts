import { ComponentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'compositeFeatureSection',
    title: 'Composite Feature Section',
    type: 'object',
    icon: ComponentIcon,
    description: 'A freeform canvas-style section with positioned text, icons, and images',
    fields: [
        defineField({
            name: 'variant',
            title: 'Variant',
            type: 'string',
            options: {
                list: [
                    { title: 'Brings Comfort (Resources Page)', value: 'bringsComfort' },
                    { title: 'Default', value: 'default' },
                ],
                layout: 'radio',
            },
            initialValue: 'bringsComfort',
            description: 'Choose the layout variant for this section',
        }),
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
            description: 'Main heading text',
        }),
        defineField({
            name: 'subheading',
            title: 'Subheading',
            type: 'string',
            description: 'Small text above the heading (e.g., "THE INSPIRED HAND MINISTRY")',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'link',
            title: 'Link',
            type: 'string',
            description: 'Optional link URL',
        }),
    ],
    preview: {
        select: {
            title: 'heading',
            variant: 'variant',
            media: 'image',
        },
        prepare({ title, variant, media }) {
            const variantLabel = variant === 'bringsComfort' ? 'Brings Comfort' : 'Default'
            return {
                title: title || 'Composite Feature Section',
                subtitle: variantLabel,
                media,
            }
        },
    },
})
