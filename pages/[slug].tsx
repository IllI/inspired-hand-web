import { ModuleRenderer } from 'components/modules'
import { Layout } from 'components/shared/Layout'
import { readToken } from 'lib/sanity.api'
import { getClient } from 'lib/sanity.client'
import { pagePaths, pagesBySlugQuery, settingsQuery } from 'lib/sanity.queries'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import type { PagePayload, SettingsPayload } from 'types'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from 'components/modules/RichTextSection'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'

import type { SharedPageProps } from './_app'

const PreviewPageRoute = dynamic(() => import('components/preview/PreviewPageRoute'))

interface PageProps extends SharedPageProps {
  page: PagePayload | null
  settings: SettingsPayload | null
}

interface Query {
  [key: string]: string
}

export default function PageRoute(props: PageProps) {
  const router = useRouter()

  // Use the preview component when in draft mode to enable live queries
  if (props.draftMode) {
    return <PreviewPageRoute page={props.page} settings={props.settings} />
  }

  // Static rendering for production
  const { page, settings } = props

  // Show loading state for fallback pages
  if (router.isFallback) {
    return (
      <Layout settings={settings}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-amber-600 border-t-transparent mx-auto" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Handle 404 if page is not found
  if (!page) {
    return (
      <Layout settings={settings}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">404</h1>
            <p className="text-gray-600">Page not found</p>
          </div>
        </div>
      </Layout>
    )
  }

  const title = page.title
    ? `${page.title} | ${settings?.siteTitle || 'Inspired Hand Ministries'}`
    : settings?.siteTitle || 'Inspired Hand Ministries'
  const description = page.seoDescription || settings?.tagline || ''

  // Render Story Layout
  if (page._type === 'story') {
    const imageUrl = page.featuredImage
      ? urlForImage(page.featuredImage)?.width(1200).height(600).url()
      : null

    return (
      <>
        <Head>
          <title>{title}</title>
          {description && <meta name="description" content={description} />}
          <meta property="og:title" content={title} />
          {description && (
            <meta property="og:description" content={description} />
          )}
        </Head>

        <Layout settings={settings}>
          <article>
            {/* Hero / Header */}
            <div className="bg-gray-50 py-12 md:py-20">
              <div className="container mx-auto px-4 max-w-4xl text-center">
                <h1 className="mb-6 font-heading text-3xl font-bold text-gray-900 md:text-5xl">
                  {page.title}
                </h1>
                {page.excerpt && (
                  <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
                    {page.excerpt}
                  </p>
                )}
              </div>
            </div>

            {/* Featured Image */}
            {imageUrl && (
              <div className="container mx-auto px-4 max-w-4xl -mt-8 mb-12">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={imageUrl}
                    alt={page.title || ''}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="container mx-auto px-4 max-w-3xl mb-20">
              <div className="prose prose-lg mx-auto text-gray-700">
                {page.content && (
                  <PortableText value={page.content} components={portableTextComponents} />
                )}
              </div>

              {/* Back Link */}
              <div className="mt-12 border-t pt-8 text-center">
                <Link href="/success-stories" className="text-ih-primary hover:text-ih-accent font-semibold transition-colors">
                  ← Back to Success Stories
                </Link>
              </div>
            </div>
          </article>
        </Layout>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={title} />
        {description && (
          <meta property="og:description" content={description} />
        )}
      </Head>

      <Layout settings={settings}>
        <ModuleRenderer modules={page.modules} />
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false, params = {} } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, page] = await Promise.all([
    client.fetch<SettingsPayload | null>(settingsQuery),
    client.fetch<PagePayload | null>(pagesBySlugQuery, {
      slug: params.slug,
    }),
  ])

  // Don't return 404 for home slug - that's handled by index.tsx
  if (!page && params.slug === 'home') {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    }
  }

  if (!page) {
    return {
      notFound: true,
      revalidate: 60, // Recheck in 60 seconds in case page is created
    }
  }

  return {
    props: {
      page,
      settings: settings ?? null,
      draftMode,
      token: draftMode ? readToken : null,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient()
  const paths = await client.fetch<string[]>(pagePaths)

  return {
    paths:
      paths
        ?.filter((slug) => slug !== 'home') // Home is handled by index.tsx
        .map((slug) => ({ params: { slug } })) || [],
    fallback: true,
  }
}
