'use client'

import { useState } from 'react'
import type { FormSectionModule } from 'types'

interface FormSectionProps {
  module: FormSectionModule
}

export function FormSection({ module }: FormSectionProps) {
  const {
    heading,
    description,
    formType = 'contact',
    fields = [],
    submitLabel = 'Submit',
    successMessage = 'Thank you for your submission!',
  } = module

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'yes' : 'no') : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // In a real implementation, you would send this to an API endpoint
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log('Form submitted:', { formType, formData })
      setIsSubmitted(true)
      setFormData({})
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get background color based on form type
  const getBgColor = () => {
    switch (formType) {
      case 'prayer-request':
        return 'bg-amber-50'
      case 'newsletter':
        return 'bg-gray-50'
      default:
        return 'bg-white'
    }
  }

  if (isSubmitted) {
    return (
      <section className={`py-12 md:py-16 ${getBgColor()}`}>
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="rounded-xl bg-green-50 p-8 shadow-sm">
            <svg
              className="mx-auto mb-4 h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              {successMessage}
            </h3>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-4 text-amber-700 underline hover:text-amber-800"
            >
              Submit another request
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-12 md:py-16 ${getBgColor()}`}>
      <div className="mx-auto max-w-2xl px-6">
        {(heading || description) && (
          <div className="mb-8 text-center">
            {heading && (
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-lg text-gray-600">{description}</p>
            )}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow-lg md:p-8"
        >
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {fields.map((field) => (
              <div key={field._key || field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={5}
                    value={formData[field.name || ''] || ''}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={field.name}
                      name={field.name}
                      required={field.required}
                      checked={formData[field.name || ''] === 'yes'}
                      onChange={handleChange}
                      className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-3 text-gray-700">
                      {field.placeholder}
                    </span>
                  </div>
                ) : (
                  <input
                    type={field.type || 'text'}
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.name || ''] || ''}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-amber-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="mr-2 h-5 w-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                submitLabel
              )}
            </button>
          </div>

          {formType === 'prayer-request' && (
            <p className="mt-4 text-center text-sm text-gray-500">
              Your prayer request will be shared with our prayer chain. All
              requests are kept confidential.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default FormSection
