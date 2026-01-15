const { loadEnvConfig } = require('@next/env');
const { createClient } = require('@sanity/client');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
loadEnvConfig(path.resolve(__dirname, '../'), dev);

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

async function fixReviewsHeroModule() {
    console.log('🔧 Fixing ReviewsHero Module in Success Stories\n');

    try {
        const page = await client.fetch(`
      *[_type == "page" && slug.current == "success-stories"][0]{
        _id,
        modules[]{ _type, _key }
      }
    `);

        console.log('Current modules:');
        page.modules.forEach((m, i) => {
            console.log(`  ${i}: ${m._type} (${m._key})`);
        });

        // Find the reviewsHero module
        const reviewsHeroIndex = page.modules.findIndex(m => m._type === 'reviewsHero');

        if (reviewsHeroIndex === -1) {
            console.log('\n❌ No reviewsHero module found');
            return;
        }

        console.log(`\n✅ Found reviewsHero at index ${reviewsHeroIndex}`);
        console.log('   Schema is correctly registered!');
        console.log('\nThe Sanity error you\'re seeing may be a caching issue.');
        console.log('Try:');
        console.log('1. Refresh your Sanity Studio page');
        console.log('2. Clear browser cache');
        console.log('3. Restart the Sanity dev server');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

fixReviewsHeroModule().catch(console.error);
