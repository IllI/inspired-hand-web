// This script is meant to be run with: npx sanity exec scripts/import-with-cli.js --with-user-token
const { getCliClient } = require('sanity/cli')
const fs = require('fs')
const path = require('path')

const client = getCliClient()

const storiesDir = path.join(__dirname, 'stories')
const storyFiles = fs.readdirSync(storiesDir).filter(f => f.endsWith('.json'))

console.log(`📚 Found ${storyFiles.length} story files to import\n`)

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
