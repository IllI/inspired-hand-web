const { loadEnvConfig } = require('@next/env')
const { createClient } = require('@sanity/client')
const path = require('path')

// Load environment variables from .env.local
const dev = process.env.NODE_ENV !== 'production'
loadEnvConfig(path.resolve(__dirname, '../'), dev)

if (!process.env.SANITY_API_READ_TOKEN) {
    console.error('Error: SANITY_API_READ_TOKEN is missing in environment (check .env.local)')
    process.exit(1)
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_READ_TOKEN,
    useCdn: false,
})

async function fixSuccessStories() {
    console.log('🔍 Finding Success Stories page...')

    try {
        const page = await client.fetch(
            `*[_type == "page" && slug.current == "success-stories"][0]{_id, title}`
        )

        if (!page) {
            console.error('❌ Success Stories page not found!')
            return
        }

        console.log(`✅ Found page: "${page.title}"`)
        console.log(`🆔 DOCUMENT ID: ${page._id}`)
        console.log(`\n👇 RUN THIS COMMAND IN YOUR TERMINAL TO FIX THE CRASH:`)
        console.log(`npx sanity documents create --id ${page._id} --replace --json '{"_type": "page", "title": "Success Stories", "slug": {"_type": "slug", "current": "success-stories"}, "modules": []}'`)

    } catch (err) {
        console.error('❌ Error executing script:', err.message)
    }
}

fixSuccessStories()
