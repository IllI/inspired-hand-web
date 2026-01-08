import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description: 'The name of the website',
      initialValue: 'Inspired Hand Ministries',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'A short tagline or slogan for the site',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          initialValue: 'Inspired Hand Ministries Logo',
        }),
      ],
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation',
      description: 'Main navigation links displayed in the header',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          title: 'Navigation Item',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'string',
              description:
                'URL path (e.g., "/about" or "https://external.com")',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'link',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        defineField({
          name: 'copyrightText',
          title: 'Copyright Text',
          type: 'string',
          description: 'Copyright notice displayed in the footer',
          initialValue: '© 2018 Reverend H. Smith All Rights Reserved.',
        }),
        defineField({
          name: 'quote',
          title: 'Footer Quote',
          type: 'string',
          description: 'Inspirational quote displayed in the footer',
        }),
        defineField({
          name: 'quoteAttribution',
          title: 'Quote Attribution',
          type: 'string',
          description: 'Source of the footer quote (e.g., "1 John 1:5")',
        }),
        defineField({
          name: 'newsletterHeading',
          title: 'Newsletter Heading',
          type: 'string',
          initialValue: 'Be Inspired',
          description: 'Heading for the newsletter section above the footer',
        }),
        defineField({
          name: 'newsletterSubtext',
          title: 'Newsletter Subtext',
          type: 'text',
          rows: 2,
          initialValue: 'Join our dedicated community and receive our weekly devotionals.',
          description: 'Subtext for the newsletter section',
        }),
        defineField({
          name: 'hideNewsletter',
          title: 'Hide Newsletter',
          type: 'boolean',
          initialValue: false,
          description: 'Hide the newsletter strip globally',
        }),
        defineField({
          name: 'links',
          title: 'Footer Links',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'footerLink',
              title: 'Footer Link',
              fields: [
                defineField({
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: 'link',
                  title: 'Link',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {
                select: {
                  title: 'label',
                  subtitle: 'link',
                },
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      description: 'Social media links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          title: 'Social Link',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Twitter/X', value: 'twitter' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'LinkedIn', value: 'linkedin' },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Default Social Share Image',
      type: 'image',
      description:
        'Default image displayed when sharing pages on social media (used when a page does not have its own image)',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global site configuration',
      }
    },
  },
})
