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
