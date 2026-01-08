import { apiVersion, basePath, dataset, projectId } from 'lib/sanity.api'
import { createClient } from 'next-sanity'

export function getClient(preview?: { token: string }) {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: 'published',
    stega: {
      enabled:
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ||
        process.env.NODE_ENV === 'development' ||
        typeof preview?.token === 'string',
      studioUrl: basePath,
      logger: console,
    },
  })
  if (preview) {
    if (!preview.token) {
      throw new Error('You must provide a token to preview drafts')
    }
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
  return client
}
