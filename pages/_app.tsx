import 'styles/index.css'

import { VisualEditing } from '@sanity/visual-editing/next-pages-router'
import { AppProps } from 'next/app'
import { IBM_Plex_Mono, Open_Sans, Playfair_Display } from 'next/font/google'
import { lazy, useSyncExternalStore } from 'react'

export interface SharedPageProps {
  draftMode: boolean
  token: string
}

const PreviewProvider = lazy(() => import('components/preview/PreviewProvider'))

const mono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['500', '700'],
})

const sans = Open_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const serif = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const subscribe = () => () => { }

export default function App({
  Component,
  pageProps,
}: AppProps<SharedPageProps>) {
  const { draftMode, token } = pageProps
  const isMaybeInsidePresentation = useSyncExternalStore(
    subscribe,
    () =>
      window !== parent ||
      !!opener ||
      process.env.NEXT_PUBLIC_SANITY_VISUAL_EDITING === 'true',
    () => process.env.NEXT_PUBLIC_SANITY_VISUAL_EDITING === 'true',
  )
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-mono: ${mono.style.fontFamily};
            --font-sans: ${sans.style.fontFamily};
            --font-serif: ${serif.style.fontFamily};
            --color-primary: #b8860b;
            --color-primary-dark: #8b6914;
            --color-primary-light: #d4a574;
            --color-secondary: #3d2914;
            --color-background: #ffffff;
            --color-background-warm: #faf5eb;
            --color-text: #1a1a1a;
            --color-text-muted: #6b7280;
          }

          html {
            scroll-behavior: smooth;
          }

          body {
            font-family: var(--font-sans);
            color: var(--color-text);
            background-color: var(--color-background);
          }

          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            font-family: var(--font-serif);
          }
        `}
      </style>

      {draftMode ? (
        <PreviewProvider token={token}>
          <Component {...pageProps} />
          <VisualEditing zIndex={999999} />
        </PreviewProvider>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  )
}
