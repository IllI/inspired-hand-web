import { ModuleRenderer } from 'components/modules'
import { Layout } from 'components/shared/Layout'
import { homePageQuery, settingsQuery } from 'lib/sanity.queries'
import Head from 'next/head'
import { useLiveQuery } from 'next-sanity/preview'
import type { HomePagePayload, SettingsPayload } from 'types'

interface PreviewIndexPageProps {
    page: HomePagePayload | null
    settings: SettingsPayload | null
}

export default function PreviewIndexPage(props: PreviewIndexPageProps) {
    const [page] = useLiveQuery(props.page || null, homePageQuery)
    const [settings] = useLiveQuery(props.settings || null, settingsQuery)

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
