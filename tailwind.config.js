const { theme } = require('@sanity/demo/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './intro-template/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ...theme,
    // Overriding fontFamily to use @next/font loaded families
    fontFamily: {
      mono: 'var(--font-mono)',
      sans: 'var(--font-sans)',
      serif: 'var(--font-serif)',
      heading: ['Playfair Display', 'Georgia', 'serif'],
      body: ['Open Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        // Original Wix Site Palette
        'ih-primary': '#bada55', // Fresh Green (Shop Now, User Highlights)
        'ih-accent': '#d32300', // Orange-Red (Donate Button)
        'ih-secondary': '#335168', // Dark Slate Blue (Our Story Box)
        'ih-footer': '#4c7a9c', // Steel Blue (Footer Background)
        'ih-text-dark': '#000000',
        'ih-text-light': '#ffffff',

        // Semantic overrides
        gold: {
          500: '#bada55', // Mapping "gold" calls to our primary green for instant retrofitting
          600: '#a0bd40',
        },
        brown: {
          900: '#335168', // Mapping "brown" backgrounds to slate blue
        },
      },
      backgroundColor: {
        warm: '#faf5eb',
      },
      textColor: {
        warm: '#3d2914',
      },
      borderColor: {
        warm: '#d4a574',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#1a1a1a',
            '--tw-prose-headings': '#3d2914',
            '--tw-prose-lead': '#4a4a4a',
            '--tw-prose-links': '#b8860b',
            '--tw-prose-bold': '#1a1a1a',
            '--tw-prose-counters': '#6b7280',
            '--tw-prose-bullets': '#d4a574',
            '--tw-prose-hr': '#e5e7eb',
            '--tw-prose-quotes': '#3d2914',
            '--tw-prose-quote-borders': '#b8860b',
            '--tw-prose-captions': '#6b7280',
            '--tw-prose-code': '#1a1a1a',
            '--tw-prose-pre-code': '#e5e7eb',
            '--tw-prose-pre-bg': '#1a1a1a',
            '--tw-prose-th-borders': '#d1d5db',
            '--tw-prose-td-borders': '#e5e7eb',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
