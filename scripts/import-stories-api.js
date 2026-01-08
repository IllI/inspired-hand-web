const { loadEnvConfig } = require('@next/env')
const { createClient } = require('@sanity/client')
const fs = require('fs')
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

const storiesDir = path.join(__dirname, 'stories')
const storyFiles = fs.readdirSync(storiesDir).filter(f => f.endsWith('.json'))

console.log(`📚 Found ${storyFiles.length} story files to import using HTTP API\n`)

async function importStories() {
    const createdStories = []

    for (const file of storyFiles) {
        const filePath = path.join(storiesDir, file)
        const storyData = JSON.parse(fs.readFileSync(filePath, 'utf8'))

        console.log(`Creating: ${storyData.title}`)

        try {
            const result = await client.create(storyData)
            console.log(`   ✅ Created with ID: ${result._id}\n`)
            createdStories.push({ id: result._id, title: storyData.title, slug: storyData.slug.current })
        } catch (error) {
            console.error(`   ❌ Failed: ${error.message}\n`)
        }
    }

    console.log('\n✅ Story import complete!')
    console.log(`\nCreated ${createdStories.length} stories:`)
    createdStories.forEach(s => console.log(`  - ${s.title} (${s.id})`))

    return createdStories
}

importStories().catch(console.error)
