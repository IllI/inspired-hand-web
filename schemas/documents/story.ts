import { DocumentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'story',
    title: 'Story',
    type: 'document',
    icon: DocumentIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description:
                'The URL path for this story (e.g., "destructive-collie-calmed-by-lord" becomes /destructive-collie-calmed-by-lord)',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'featuredImage',
            title: 'Featured Image',
            type: 'image',
            description: 'Main image displayed in the story grid and at the top of the story page',
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
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
            description: 'Short preview text shown on the story grid card',
        }),
        defineField({
            name: 'content',
            title: 'Story Content',
            type: 'array',
            of: [
                {
                    type: 'block',
                    marks: {
                        decorators: [
                            { title: 'Bold', value: 'strong' },
                            { title: 'Italic', value: 'em' },
                        ],
                    },
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'H2', value: 'h2' },
                        { title: 'H3', value: 'h3' },
                        { title: 'Quote', value: 'blockquote' },
                    ],
                },
            ],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'seoDescription',
            title: 'SEO Description',
            type: 'text',
            rows: 3,
            description:
                'Description for search engines (recommended: 150-160 characters)',
            validation: (rule) => rule.max(160),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'slug.current',
            media: 'featuredImage',
        },
        prepare({ title, subtitle, media }) {
            return {
                title: title || 'Untitled Story',
                subtitle: subtitle ? `/${subtitle}` : 'No slug set',
                media,
            }
        },
    },
})
