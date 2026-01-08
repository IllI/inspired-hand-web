import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { readToken } from 'lib/sanity.api'
import { getClient } from 'lib/sanity.client'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const client = getClient({ token: readToken })

    const { isValid, redirectTo = '/' } = await validatePreviewUrl(
        client,
        req.url!,
    )

    if (!isValid) {
        return res.status(401).send('Invalid secret')
    }

    // Enable Draft Mode by setting the cookie
    res.setDraftMode({ enable: true })

    // Redirect to the path from the fetched post
    res.writeHead(307, { Location: redirectTo })
    res.end()
}
