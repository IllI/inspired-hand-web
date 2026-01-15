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

async function findDuplicateSlugs() {
    console.log('🔍 Finding duplicate slugs...\n');

    // Find all pages with success-stories slug
    const pages = await client.fetch(`
    *[_type == "page" && slug.current == "success-stories"]{
      _id,
      _createdAt,
      _updatedAt,
      title,
      "slug": slug.current,
      modules
    } | order(_createdAt asc)
  `);

    console.log(`Found ${pages.length} page(s) with slug "success-stories":\n`);

    pages.forEach((page, index) => {
        console.log(`${index + 1}. ${page.title}`);
        console.log(`   ID: ${page._id}`);
        console.log(`   Created: ${new Date(page._createdAt).toLocaleString()}`);
        console.log(`   Updated: ${new Date(page._updatedAt).toLocaleString()}`);
        console.log(`   Modules: ${page.modules?.length || 0}`);
        console.log('');
    });

    if (pages.length > 1) {
        console.log('⚠️  DUPLICATE SLUG DETECTED!\n');
        console.log('Recommendation: Keep the page with the most recent updates');
        console.log('                and delete or rename the duplicate(s).\n');

        // Find the most recently updated one
        const mostRecent = pages.reduce((prev, current) =>
            new Date(current._updatedAt) > new Date(prev._updatedAt) ? current : prev
        );

        console.log(`✅ Most recently updated: ${mostRecent.title} (${mostRecent._id})`);
        console.log(`   This should be the one to keep.\n`);

        // Show which ones to delete
        const toDelete = pages.filter(p => p._id !== mostRecent._id);
        if (toDelete.length > 0) {
            console.log('🗑️  Pages to delete or rename:');
            toDelete.forEach((page, index) => {
                console.log(`   ${index + 1}. ${page.title} (${page._id})`);
            });
        }
    } else if (pages.length === 1) {
        console.log('✅ No duplicates found. The slug issue might be resolved.');
    } else {
        console.log('⚠️  No pages found with this slug!');
    }
}

findDuplicateSlugs().catch(console.error);
