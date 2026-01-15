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

async function deleteDuplicatePage() {
    console.log('🗑️  Deleting duplicate Success Stories page...\n');

    const duplicateId = 'page-success-stories';

    try {
        // First, check if it exists
        const page = await client.fetch(`*[_id == $id][0]{ _id, title, slug }`, { id: duplicateId });

        if (!page) {
            console.log('⚠️  Page not found. May have already been deleted.');
            return;
        }

        console.log(`Found duplicate page:`);
        console.log(`  ID: ${page._id}`);
        console.log(`  Title: ${page.title}`);
        console.log(`  Slug: ${page.slug?.current}`);
        console.log('');

        // Delete it
        console.log('Deleting...');
        await client.delete(duplicateId);

        console.log('✅ Successfully deleted duplicate page!\n');
        console.log('You should now be able to publish your Success Stories page.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

deleteDuplicatePage().catch(console.error);
