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

async function updateHeroToImageOverlay() {
    console.log('🎨 Updating Success Stories Hero to Image Overlay Style\n');
    console.log('='.repeat(60));

    try {
        // Find the Success Stories page (published version)
        console.log('📄 Finding Success Stories page...');
        const page = await client.fetch(`
      *[_id == "V0GRC4Tle9y4FQBL5RRWSq"][0]{ _id, modules }
    `);

        if (!page) {
            console.error('   ✗ Page not found!');
            return;
        }
        console.log(`   ✓ Found page (${page._id})`);

        // Update the first module (hero) to use imageOverlay style
        console.log('\n✏️  Updating hero style...');

        const updatedModules = page.modules.map((module, index) => {
            if (index === 0 && module._type === 'hero') {
                return {
                    ...module,
                    style: 'imageOverlay',
                    // These values will be used by the component but ignored for display
                    // The component hard-codes "Inspire Hand" and "Discover Inspired Hand"
                    heading: 'SUCCESS STORIES',
                    subheading: 'Discover Inspired Hand',
                };
            }
            return module;
        });

        await client
            .patch(page._id)
            .set({ modules: updatedModules })
            .commit();

        console.log('   ✓ Hero style updated to "imageOverlay"!');

        console.log('\n' + '='.repeat(60));
        console.log('✅ Hero updated!\n');
        console.log('The hero will now display:');
        console.log('  - Full-width background image');
        console.log('  - Centered white overlay box');
        console.log('  - "Inspired Hand" logo text');
        console.log('  - "Discover Inspired Hand" subheading');
        console.log('  - "SUCCESS STORIES" main heading');
        console.log('  - Yellow "READ THEM NOW" button');
        console.log('  - Down arrow scroll indicator');
        console.log('\nNext steps:');
        console.log('1. Refresh your Vercel site to see the changes');
        console.log('2. Compare with the Wix design');
        console.log('3. Adjust if needed');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

updateHeroToImageOverlay().catch(console.error);
