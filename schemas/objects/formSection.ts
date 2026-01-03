import { EnvelopeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'formSection',
  title: 'Form Section',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'formType',
      title: 'Form Type',
      type: 'string',
      options: {
        list: [
          { title: 'Contact', value: 'contact' },
          { title: 'Newsletter', value: 'newsletter' },
          { title: 'Prayer Request', value: 'prayer-request' },
        ],
        layout: 'radio',
      },
      initialValue: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'formField',
          title: 'Form Field',
          fields: [
            defineField({
              name: 'name',
              title: 'Field Name',
              type: 'string',
              description: 'Internal field name (e.g., "email", "firstName")',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Display label for the field',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'type',
              title: 'Field Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Text', value: 'text' },
                  { title: 'Email', value: 'email' },
                  { title: 'Phone', value: 'tel' },
                  { title: 'Textarea', value: 'textarea' },
                  { title: 'Select', value: 'select' },
                  { title: 'Checkbox', value: 'checkbox' },
                ],
              },
              initialValue: 'text',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'placeholder',
              title: 'Placeholder',
              type: 'string',
            }),
            defineField({
              name: 'required',
              title: 'Required',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'type',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Untitled Field',
                subtitle: subtitle || 'text',
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'submitLabel',
      title: 'Submit Button Label',
      type: 'string',
      initialValue: 'Submit',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      description: 'Message shown after successful form submission',
      initialValue: 'Thank you for your submission!',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      formType: 'formType',
    },
    prepare({ title, formType }) {
      const typeLabels: Record<string, string> = {
        contact: 'Contact Form',
        newsletter: 'Newsletter Signup',
        'prayer-request': 'Prayer Request',
      }
      return {
        title: title || 'Form Section',
        subtitle: typeLabels[formType] || 'Form',
      }
    },
  },
})
