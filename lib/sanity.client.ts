import { apiVersion, basePath, dataset, projectId } from 'lib/sanity.api'
import { createClient } from 'next-sanity'

export function getClient(preview?: { token: string }) {
  // Debug: Log environment and token status
  const stegaEnabled =
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ||
    process.env.NODE_ENV === 'development' ||
    typeof preview?.token === 'string'

  console.log('[Sanity Client Debug]', {
    env: process.env.NODE_ENV,
    vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV,
    hasPreviewToken: !!preview?.token,
    tokenLength: preview?.token?.length || 0,
    stegaEnabled,
    basePath,
  })

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: 'published',
    stega: {
      enabled: stegaEnabled,
      studioUrl: basePath,
      logger: console,
    },
  })
  if (preview) {
    if (!preview.token) {
      throw new Error('You must provide a token to preview drafts')
    }
    console.log('[Sanity Client] Creating preview client with Stega ENABLED')
    return client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: 'previewDrafts',
      resultSourceMap: true,
      stega: {
        enabled: true,
        studioUrl: basePath,
        logger: console,
      },
    })
  }
  console.log('[Sanity Client] Returning standard client (no preview)')
  return client
}
