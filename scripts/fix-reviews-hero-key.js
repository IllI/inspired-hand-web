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

async function fixReviewsHeroKey() {
    console.log('🔧 Fixing ReviewsHero _key for Sanity Visual Editing\n');

    try {
        const page = await client.fetch(`
      *[_type == "page" && slug.current == "success-stories"][0]{
        _id,
        modules
      }
    `);

        console.log('Finding reviewsHero module...');

        const updatedModules = page.modules.map(module => {
            if (module._type === 'reviewsHero' && module._key === 'reviews-hero-section') {
                console.log('  ✓ Found module with problematic _key');
                console.log('  → Changing "reviews-hero-section" to "reviewsHeroSection"');
                return {
                    ...module,
                    _key: 'reviewsHeroSection'
                };
            }
            return module;
        });

        await client
            .patch(page._id)
            .set({ modules: updatedModules })
            .commit();

        console.log('\n✅ Fixed! The _key is now "reviewsHeroSection"');
        console.log('This should resolve the CSS selector error in Sanity Presentation mode.');
        console.log('\nPlease refresh your Sanity Studio to see the changes.');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

fixReviewsHeroKey().catch(console.error);
