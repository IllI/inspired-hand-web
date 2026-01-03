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
        // Primary brand colors (gold/amber tones)
        gold: {
          50: '#fdf9ed',
          100: '#f9f0d3',
          200: '#f2dea3',
          300: '#e9c66a',
          400: '#e2ae3e',
          500: '#d4942a',
          600: '#b8860b', // Primary gold - DarkGoldenrod
          700: '#8b6914',
          800: '#6d5315',
          900: '#5a4517',
          950: '#332408',
        },
        // Secondary/accent colors (warm browns)
        brown: {
          50: '#faf5eb',
          100: '#f2e8d5',
          200: '#e5cfad',
          300: '#d4a574',
          400: '#c58a54',
          500: '#b67240',
          600: '#9d5835',
          700: '#7d432d',
          800: '#3d2914',
          900: '#2a1d0f',
          950: '#1a1008',
        },
        // Cream/warm backgrounds
        cream: {
          50: '#fefdfb',
          100: '#fdfaf5',
          200: '#faf5eb',
          300: '#f5edd9',
          400: '#eddfc0',
          500: '#e2cfa3',
        },
        // Inspired Hand specific colors
        'ih-primary': '#b8860b',
        'ih-primary-dark': '#8b6914',
        'ih-primary-light': '#d4a574',
        'ih-secondary': '#3d2914',
        'ih-background': '#faf5eb',
        'ih-text': '#1a1a1a',
        'ih-text-muted': '#6b7280',
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
