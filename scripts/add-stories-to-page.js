// Run with: npx sanity exec scripts/add-stories-to-page.js --with-user-token
const { getCliClient } = require('sanity/cli')

const client = getCliClient()

async function addStoriesToPage() {
    console.log('📝 Adding stories to Success Stories page...\n')

    // Find the Success Stories page
    const page = await client.fetch(
        `*[_type == "page" && slug.current == "success-stories"][0]{_id, _rev, modules}`
    )

    if (!page) {
        console.error('❌ Success Stories page not found!')
        return
    }

    console.log(`✅ Found page: ${page._id}\n`)

    // Find all story documents
    const stories = await client.fetch(
        `*[_type == "story"] | order(_createdAt asc) {_id, title, slug}`
    )

    console.log(`✅ Found ${stories.length} stories:\n`)
    stories.forEach(s => console.log(`  - ${s.title}`))

    // Find or create the storiesGrid module
    let modules = page.modules || []
    let storiesGridIndex = modules.findIndex(m => m._type === 'storiesGrid')

    if (storiesGridIndex === -1) {
        console.log('\n📦 Creating new Stories Grid module...')
        modules.push({
            _type: 'storiesGrid',
            _key: Math.random().toString(36).substr(2, 9),
            heading: 'Success Stories',
            description: 'Read them now',
            stories: stories.map(s => ({
                _type: 'reference',
                _ref: s._id,
                _key: Math.random().toString(36).substr(2, 9)
            }))
        })
    } else {
        console.log('\n📝 Updating existing Stories Grid module...')
        modules[storiesGridIndex].stories = stories.map(s => ({
            _type: 'reference',
            _ref: s._id,
            _key: Math.random().toString(36).substr(2, 9)
        }))
    }

    // Update the page
    const result = await client
        .patch(page._id)
        .set({ modules })
        .commit()

    console.log('\n✅ Successfully added stories to Success Stories page!')
    console.log(`   Page ID: ${result._id}`)
    console.log(`   Total modules: ${result.modules.length}`)
    console.log('\n👉 Refresh your Sanity Studio to see the changes!')
}

addStoriesToPage().catch(console.error)
