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
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      description: 'Name of the person being quoted (e.g., "Theresa")',
    }),
    defineField({
      name: 'bookTitle',
      title: 'Book Title',
      type: 'string',
      description: 'Title of the book (e.g., "Inspired Hand")',
      initialValue: 'Inspired Hand',
    }),
    defineField({
      name: 'role',
      title: 'Role/Title',
      type: 'string',
      description: 'Their role or title (e.g., "reader")',
      initialValue: 'reader',
    }),
    defineField({
      name: 'authorImage',
      title: 'Author Image',
      type: 'image',
      description: 'Photo of the person quoted',
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
      authorName: 'authorName',
      media: 'backgroundImage',
    },
    prepare({ title, authorName, media }) {
      // Truncate quote for preview
      const truncatedQuote =
        title?.length > 50 ? `${title.slice(0, 50)}...` : title
      return {
        title: truncatedQuote || 'Quote Section',
        subtitle: authorName ? `- ${authorName}` : 'No attribution',
        media,
      }
    },
  },
})
