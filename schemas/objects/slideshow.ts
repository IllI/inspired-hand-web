import { ImagesIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'slideshow',
  title: 'Slideshow',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'slide',
          title: 'Slide',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'ctaLabel',
              title: 'Button Label',
              type: 'string',
            }),
            defineField({
              name: 'ctaLink',
              title: 'Button Link',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'heading',
              subtitle: 'caption',
              media: 'image',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Slide',
                subtitle: subtitle || '',
                media,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).error('At least one slide is required'),
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'interval',
      title: 'Slide Interval (seconds)',
      type: 'number',
      initialValue: 5,
      validation: (rule) => rule.min(1).max(30),
    }),
  ],
  preview: {
    select: {
      slides: 'slides',
    },
    prepare({ slides }) {
      const count = slides?.length || 0
      return {
        title: 'Slideshow',
        subtitle: `${count} slide${count === 1 ? '' : 's'}`,
      }
    },
  },
})
