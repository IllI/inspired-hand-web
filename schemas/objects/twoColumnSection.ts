import { InlineIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'twoColumnSection',
  title: 'Two Column Section',
  type: 'object',
  icon: InlineIcon,
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Image Left', value: 'image-left' },
          { title: 'Image Right', value: 'image-right' },
        ],
        layout: 'radio',
      },
      initialValue: 'image-right',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for accessibility',
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Button Label',
          type: 'string',
        }),
        defineField({
          name: 'link',
          title: 'Button Link',
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
          { title: 'Transparent', value: 'transparent' },
          { title: 'Primary (Full-width Split)', value: 'primary' },
          { title: 'Accent', value: 'accent' },
          { title: 'Secondary', value: 'secondary' },
        ],
        layout: 'radio',
      },
      initialValue: 'transparent',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Hex color for section background (e.g., #335168)',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      options: {
        list: [
          { title: 'Default (Black)', value: 'default' },
          { title: 'White', value: 'white' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      layout: 'layout',
      media: 'image',
    },
    prepare({ title, layout, media }) {
      return {
        title: title || 'Two Column Section',
        subtitle: layout === 'image-left' ? 'Image Left' : 'Image Right',
        media,
      }
    },
  },
})
