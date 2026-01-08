import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * This API route is required for Sanity's Visual Editing to work properly.
 * It handles communication between the Sanity Studio Presentation view and the preview iframe.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    // Enable CORS for Sanity Studio
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    // Return presentation config
    res.status(200).json({
        version: '1.0',
        enabled: true,
    })
}
