import { BlockquoteIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'quoteSection',
  title: 'Quote Section',
  type: 'object',
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      description: 'Who said this quote (e.g., "John 3:16" or "Reverend Smith")',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Source of the quote (e.g., "The Bible", "Sunday Sermon")',
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Large', value: 'large' },
          { title: 'With Background', value: 'background' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Optional background image for the "With Background" style',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }) => parent?.style !== 'background',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'quote',
      subtitle: 'attribution',
      media: 'backgroundImage',
    },
    prepare({ title, subtitle, media }) {
      // Truncate quote for preview
      const truncatedQuote = title?.length > 50 ? `${title.slice(0, 50)}...` : title
      return {
        title: truncatedQuote || 'Quote Section',
        subtitle: subtitle || 'No attribution',
        media,
      }
    },
  },
})
