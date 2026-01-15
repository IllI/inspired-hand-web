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

async function fixSuccessStoriesHero() {
    console.log('🔧 Fixing Success Stories Hero Style\n');
    console.log('='.repeat(60));

    try {
        // Find the Success Stories page
        console.log('\n📄 Finding Success Stories page...');
        const page = await client.fetch(`
      *[_type == "page" && slug.current == "success-stories"][0]{ _id, modules }
    `);

        if (!page) {
            console.error('   ✗ Page not found!');
            return;
        }
        console.log(`   ✓ Found page (${page._id})`);

        // Find and fix the hero module
        console.log('\n✏️  Updating hero module style...');

        const updatedModules = page.modules.map((module, index) => {
            if (index === 0 && module._type === 'hero') {
                console.log(`   Current style: ${module.style || 'default'}`);
                return {
                    ...module,
                    style: 'imageOverlay',
                };
            }
            return module;
        });

        await client
            .patch(page._id)
            .set({ modules: updatedModules })
            .commit();

        console.log('   ✓ Hero style set to "imageOverlay"!');

        console.log('\n' + '='.repeat(60));
        console.log('✅ Hero fixed!\n');
        console.log('The hero should now display with:');
        console.log('  - Full-width background image');
        console.log('  - Centered white overlay box');
        console.log('  - "SUCCESS STORIES" heading');
        console.log('  - Yellow button');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

fixSuccessStoriesHero().catch(console.error);
