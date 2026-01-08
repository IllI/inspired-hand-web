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

// The quotes from the Wix Success Stories page
const quotes = [
    {
        quote: "I firmly recommend to anyone interested in developing an intimacy between the animals God put in their care and the Lord. There is a great deal of useful lessons and excellent advice found in its clear, straightforward approach. God Bless.",
        authorName: "Theresa",
        bookTitle: "Inspired Hand",
        role: "reader"
    },
    {
        quote: "Dear Rev Hunter, I would like to thank you for your work and for making this knowledge available. My relationship with the Lord and my dogs has changed forever. My friends have noticed too - I've given away two copies as gifts.",
        authorName: "James",
        bookTitle: "Inspired Hand",
        role: "reader"
    },
    {
        quote: "This is an inspiration to people who want to make a change in their pet's lives. After following your advice, I now know what the Lord wants from me.",
        authorName: "Jeff",
        bookTitle: "Inspired Hand",
        role: "reader"
    },
    {
        quote: "We have used The Alpha, The Omega, And Fido extensively with our pit-bull mix. Every issue that came up, TATOAF directed us to solid biblical wisdom on how to best deal with it. This has completely changed how we deal with our dog and how she sees us. We don't have her obedience out of fear - we have it out of love.",
        authorName: "Mark",
        bookTitle: "Inspired Hand",
        role: "reader"
    },
    {
        quote: "By using The Alpha, The Omega, And Fido I've never felt the love of God more radiantly than when I'm at prayer with my pet. The Alpha, The Omega, And Fido has shown me how. I am truly amazed.",
        authorName: "Rebecca",
        bookTitle: "Inspired Hand",
        role: "reader"
    },
    // Additional short testimonials
    {
        quote: "The biggest tool I've used to help me build routine has been The Alpha, the Omega, and Fido.",
        authorName: "Elena",
        bookTitle: "Inspired Hand",
        role: "reader"
    },
    {
        quote: "I always take time in the morning to journal because I feel empowered to set up my day—to choose who I want to be and create the mindset that will carry me through.",
        authorName: "Natalie",
        bookTitle: "Inspired Hand",
        role: "reader"
    },
    {
        quote: "This journal has helped me focus and re-focus on what's important in my life and my day...and continually helps me remain in a place of gratitude.",
        authorName: "Josh",
        bookTitle: "Inspired Hand",
        role: "reader"
    },
    {
        quote: "I've learned to see joy in the littlest things, and actually enjoy looking back at my day and writing about how it went each night.",
        authorName: "Geri",
        bookTitle: "Inspired Hand",
        role: "reader"
    },
    {
        quote: "My whole week/day has been revamped as a bi-product of the journal.",
        authorName: "Dan",
        bookTitle: "Inspired Hand",
        role: "reader"
    }
]

async function migrateSuccessStories() {
    console.log('📝 Migrating Success Stories content...')

    try {
        // Find the Success Stories page
        const page = await client.fetch(
            `*[_type == "page" && slug.current == "success-stories"][0]{_id, _rev}`
        )

        if (!page) {
            console.error('❌ Success Stories page not found!')
            return
        }

        console.log(`✅ Found Success Stories page (ID: ${page._id})`)

        // Create the modules array with quote sections
        const modules = quotes.map(quote => ({
            _type: 'quoteSection',
            _key: Math.random().toString(36).substr(2, 9), // Generate random key
            quote: quote.quote,
            authorName: quote.authorName,
            bookTitle: quote.bookTitle,
            role: quote.role,
            style: 'default'
        }))

        console.log(`📦 Prepared ${modules.length} quote modules`)

        // Update the page with the modules
        const result = await client
            .patch(page._id)
            .set({ modules })
            .commit()

        console.log('✅ Successfully migrated Success Stories content!')
        console.log('👉 Open the page in Sanity Studio to review and adjust as needed.')
        console.log('👉 You may want to add author images for some quotes.')

    } catch (err) {
        console.error('❌ Error migrating content:', err.message)
    }
}

migrateSuccessStories()
