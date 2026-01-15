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

async function cleanupIncorrectStories() {
    console.log('🧹 Cleaning up incorrectly typed stories...\n');

    // Find all documents with _type 'successStory'
    const incorrectStories = await client.fetch(`*[_type == "successStory"]{ _id, title }`);

    if (incorrectStories.length === 0) {
        console.log('✓ No incorrectly typed stories found.');
        return;
    }

    console.log(`Found ${incorrectStories.length} stories with incorrect type 'successStory':`);
    incorrectStories.forEach(story => {
        console.log(`  - ${story.title} (${story._id})`);
    });

    console.log('\n🗑️  Deleting...');

    // Delete each one
    for (const story of incorrectStories) {
        try {
            await client.delete(story._id);
            console.log(`  ✓ Deleted: ${story.title}`);
        } catch (error) {
            console.error(`  ✗ Failed to delete ${story.title}:`, error.message);
        }
    }

    console.log('\n✅ Cleanup complete!');
}

cleanupIncorrectStories().catch(console.error);
