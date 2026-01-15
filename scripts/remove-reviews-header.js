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

async function removeReviewsHeader() {
    console.log('🗑️  Removing reviews-header section\n');

    try {
        const page = await client.fetch(`
      *[_type == "page" && slug.current == "success-stories"][0]{
        _id,
        modules
      }
    `);

        const updatedModules = page.modules.filter(m => m._key !== 'reviews-header');

        console.log(`Removing section with key "reviews-header"`);
        console.log(`Before: ${page.modules.length} modules`);
        console.log(`After: ${updatedModules.length} modules`);

        await client
            .patch(page._id)
            .set({ modules: updatedModules })
            .commit();

        console.log('\n✅ "What Our Readers Say" heading removed!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

removeReviewsHeader().catch(console.error);
