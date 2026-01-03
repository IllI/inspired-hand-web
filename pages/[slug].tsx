import { ModuleRenderer } from 'components/modules'
import { Layout } from 'components/shared/Layout'
import { readToken } from 'lib/sanity.api'
import { getClient } from 'lib/sanity.client'
import { pagePaths, pagesBySlugQuery, settingsQuery } from 'lib/sanity.queries'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { PagePayload, SettingsPayload } from 'types'

import type { SharedPageProps } from './_app'

// Debug: Log when module loads
console.log('[slug].tsx loaded')

interface PageProps extends SharedPageProps {
  page: PagePayload | null
  settings: SettingsPayload | null
}

interface Query {
  [key: string]: string
}

export default function PageRoute({ page, settings }: PageProps) {
  const router = useRouter()

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

  // Debug logging
  console.log('[slug] Page data:', {
    id: page._id,
    title: page.title,
    slug: page.slug,
    moduleCount: page.modules?.length || 0,
    moduleTypes: page.modules?.map((m) => m._type) || [],
  })

  // Debug: Render debug info FIRST before anything can error
  const debugInfo = (
    <div className="bg-yellow-100 border-4 border-yellow-500 p-6 m-4 text-black">
      <h2 className="text-2xl font-bold mb-4">🔍 DEBUG INFO</h2>
      <p>
        <strong>Page ID:</strong> {page._id || 'undefined'}
      </p>
      <p>
        <strong>Page Title:</strong> {page.title || 'undefined'}
      </p>
      <p>
        <strong>Page Slug:</strong> {page.slug || 'undefined'}
      </p>
      <p>
        <strong>Module Count:</strong> {page.modules?.length || 0}
      </p>
      <p>
        <strong>Module Types:</strong>
      </p>
      <ul className="list-disc ml-6">
        {page.modules?.map((m, i) => (
          <li key={i}>
            {i}: {m._type || 'UNDEFINED TYPE'} - {m.heading || '(no heading)'}
          </li>
        )) || <li>No modules</li>}
      </ul>
      <p className="mt-4">
        <strong>Raw modules data:</strong>
      </p>
      <pre className="bg-gray-800 text-green-400 p-4 text-xs overflow-auto max-h-64 mt-2">
        {JSON.stringify(page.modules, null, 2)}
      </pre>
    </div>
  )

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

      {/* Show debug BEFORE Layout to ensure it renders even if Layout errors */}
      {debugInfo}

      <Layout settings={settings}>
        <ModuleRenderer modules={page.modules} />
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false, params = {} } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  console.log('[slug] getStaticProps called for slug:', params.slug)

  const [settings, page] = await Promise.all([
    client.fetch<SettingsPayload | null>(settingsQuery),
    client.fetch<PagePayload | null>(pagesBySlugQuery, {
      slug: params.slug,
    }),
  ])

  console.log('[slug] Fetched page:', {
    found: !!page,
    id: page?._id,
    moduleCount: page?.modules?.length || 0,
  })

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
