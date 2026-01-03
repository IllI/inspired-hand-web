import { ModuleRenderer } from 'components/modules'
import { Layout } from 'components/shared/Layout'
import { readToken } from 'lib/sanity.api'
import { getClient } from 'lib/sanity.client'
import { homePageQuery, settingsQuery } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import type { HomePagePayload, SettingsPayload } from 'types'

import type { SharedPageProps } from './_app'

interface PageProps extends SharedPageProps {
  page: HomePagePayload | null
  settings: SettingsPayload | null
}

export default function IndexPage({ page, settings }: PageProps) {
  const title = page?.title || settings?.siteTitle || 'Inspired Hand Ministries'
  const description = page?.seoDescription || settings?.tagline || ''

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
        <ModuleRenderer modules={page?.modules} />
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps<PageProps> = async (ctx) => {
  const { draftMode = false } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, page] = await Promise.all([
    client.fetch<SettingsPayload | null>(settingsQuery),
    client.fetch<HomePagePayload | null>(homePageQuery),
  ])

  return {
    props: {
      page: page ?? null,
      settings: settings ?? null,
      draftMode,
      token: draftMode ? readToken : null,
    },
    revalidate: 10,
  }
}
