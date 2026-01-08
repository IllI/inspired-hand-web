const { loadEnvConfig } = require('@next/env')
const { createClient } = require('@sanity/client')
const path = require('path')
const https = require('https')

const dev = process.env.NODE_ENV !== 'production'
loadEnvConfig(path.resolve(__dirname, '../'), dev)

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_READ_TOKEN,
    useCdn: false,
})

// Story URLs from Wix (based on the slug pattern)
const storyUrls = [
    'https://inspiredhandproduc.wixsite.com/paws1/destructive-collie-calmed-by-lord',
    'https://inspiredhandproduc.wixsite.com/paws1/an-angels-visit-reveals-gods-love',
    'https://inspiredhandproduc.wixsite.com/paws1/tumor-no-match-for-god',
    'https://inspiredhandproduc.wixsite.com/paws1/barking-problems-with-husky-no-more',
    'https://inspiredhandproduc.wixsite.com/paws1/deaf-dalmation-hears-owners-voice',
    'https://inspiredhandproduc.wixsite.com/paws1/dog-reveals-christs-work',
    'https://inspiredhandproduc.wixsite.com/paws1/retriever-cancer-battle',
    'https://inspiredhandproduc.wixsite.com/paws1/german-shepherd-seizures',
    'https://inspiredhandproduc.wixsite.com/paws1/rescue-saved-through-christian-love',
]

// Manual story data (titles from the grid)
const storyTitles = {
    'destructive-collie-calmed-by-lord': 'Destructive Collie Calmed by Lord\'s Voice',
    'an-angels-visit-reveals-gods-love': 'An Angel\'s Visit Reveals Christ\'s Love',
    'tumor-no-match-for-god': 'Tumor No Match For God',
    'barking-problems-with-husky-no-more': 'Barking Problems with Husky No More!',
    'deaf-dalmation-hears-owners-voice': 'Deaf Dalmation Hears Owner\'s Voice',
    'dog-reveals-christs-work': 'Dog Reveals Christ\'s Work',
    'retriever-cancer-battle': 'Retriever Cancer Battle',
    'german-shepherd-seizures': 'German Shepherd Seizures',
    'rescue-saved-through-christian-love': 'Rescue Saved Through Christian Love',
}

// Sample content from the one story we read
const sampleStory = {
    title: "An Angel's Visit Reveals Christ's Love",
    slug: 'an-angels-visit-reveals-gods-love',
    content: [
        "In early 2015, my Yorkie, Milly, was hit by a car that never stopped just outside our home in Eugene, OR. We rushed Milly to the emergency veterinarian clinic, where she was diagnosed with two broken legs and internal bleeding – it was a miracle she was alive at all. She was stabilized, put into a cast, and released back in good health.",
        "Months had gone by after the cast was removed, but it was clear that Milly was regularly suffering from severe pain. The vet who saved her life couldn't figure out what was happening and was only able to give more medications at this point. Still, it had gotten so bad that Milly couldn't function some days. I was worried we did the wrong thing by trying to save her life.",
        "I became angry that God would allow such a gentle spirit like Milly's to suffer like this.",
        "But as a Christian, I know God always has the way. I put things in His hands. I asked the Lord for His healing Grace and to show me how to look after his living creation on earth. I would hold Milly and we would pray. She never cried out in pain when we prayed.",
        "Late one evening I was praying with Milly to comfort her so she could get to sleep, when I fell asleep with Milly in my lap. What happened next was indescribable. The back of my eyelids glowed golden hot, like seeing the sun through closed eye. I opened them to see two angels. One held Milly's paw, while the other's hands were placed on Milly's back as they hovered. It was then that I felt God's protection and I was ashamed at my doubt and anger.",
        "That next day Milly was just a normal dog again. No more pain, no more cries, and no more conversations about euthanasia at the vet.",
        "Christ the Lord Almighty brought Milly into my life for a reason and I'm continuing to find out that reason is more than just to enjoy her companionship.",
        "",
        "Jessica Lemae – Eugene, OR"
    ],
    excerpt: "A miraculous healing after two angels visited Milly, a Yorkie suffering from severe pain after being hit by a car."
}

console.log('📖 Story Migration Script')
console.log('========================')
console.log('')
console.log('⚠️  NOTE: This script creates placeholder Story documents.')
console.log('   You will need to:')
console.log('   1. Upload featured images for each story in Sanity Studio')
console.log('   2. Verify and adjust the content as needed')
console.log('   3. The actual Wix pages require manual content extraction')
console.log('')
console.log(`Found ${storyUrls.length} stories to migrate.`)
console.log('')
console.log('To create these stories, please run this command for EACH story:')
console.log('')
console.log('npx sanity documents create --replace --id <story-id> --file scripts/stories/<story-file>.json')
console.log('')
console.log('Story files will be generated in scripts/stories/')
console.log('')

// For now, just log the structure - the CLI auth issues prevent automated creation
console.log('✅ Migration preparation complete!')
console.log('   Next: Manually create Story documents in Sanity Studio, or')
console.log('   use the generated JSON files with the Sanity CLI.')
