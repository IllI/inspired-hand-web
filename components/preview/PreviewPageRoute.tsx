import { ModuleRenderer } from 'components/modules'
import { Layout } from 'components/shared/Layout'
import { pagesBySlugQuery, settingsQuery } from 'lib/sanity.queries'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useLiveQuery } from 'next-sanity/preview'
import type { PagePayload, SettingsPayload } from 'types'

interface PreviewPageRouteProps {
    page: PagePayload | null
    settings: SettingsPayload | null
}

export default function PreviewPageRoute(props: PreviewPageRouteProps) {
    const [page] = useLiveQuery(props.page || null, pagesBySlugQuery, {
        slug: props.page?.slug || '',
    })
    const [settings] = useLiveQuery(props.settings || null, settingsQuery)

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
