const { loadEnvConfig } = require('@next/env')
const { createClient } = require('@sanity/client')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
loadEnvConfig(path.resolve(__dirname, '../'), dev)

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_READ_TOKEN,
    useCdn: false,
})

async function run() {
    const page = await client.fetch(`*[_type == "page" && slug.current == "success-stories"][0]{_id}`)
    if (page) console.log(page._id)
    else console.log('NOT FOUND')
}
run()
