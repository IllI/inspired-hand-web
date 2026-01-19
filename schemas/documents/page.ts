import { DocumentIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
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
        'The URL path for this page (e.g., "about-us" becomes /about-us)',
      options: {
        source: 'title',
        maxLength: 96,
      },
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
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Image displayed when sharing on social media',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'modules',
      title: 'Page Sections',
      description: 'Build your page by adding and arranging content sections',
      type: 'array',
      of: [
        defineArrayMember({ type: 'hero' }),
        defineArrayMember({ type: 'richTextSection' }),
        defineArrayMember({ type: 'slideshow' }),
        defineArrayMember({ type: 'twoColumnSection' }),
        defineArrayMember({ type: 'formSection' }),
        defineArrayMember({ type: 'ctaSection' }),
        defineArrayMember({ type: 'quoteSection' }),
        defineArrayMember({ type: 'storiesGrid' }),
        defineArrayMember({ type: 'compositeFeatureSection' }),
        defineArrayMember({ type: 'testimonialSection' }),
        defineArrayMember({ type: 'reviewsHero' }),
        defineArrayMember({ type: 'productAd' }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      media: 'ogImage',
    },
    prepare({ title, slug, media }) {
      return {
        title: title || 'Untitled Page',
        subtitle: slug ? `/${slug}` : 'No slug set',
        media,
      }
    },
  },
})
