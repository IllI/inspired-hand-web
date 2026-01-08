import { ThListIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'storiesGrid',
  title: 'Stories Grid',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Main heading for the stories section (e.g., "What are people saying?")',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional description below the heading',
    }),
    defineField({
      name: 'stories',
      title: 'Stories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'story' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      stories: 'stories',
    },
    prepare({ stories }) {
      return {
        title: 'Stories Grid',
        subtitle: `${stories?.length || 0} stories`,
      }
    },
  },
})
