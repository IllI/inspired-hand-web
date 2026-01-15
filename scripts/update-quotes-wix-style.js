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

async function updateQuoteSectionsToWixStyle() {
    console.log('🎨 Updating Quote Sections to Wix Style\n');

    try {
        const page = await client.fetch(`
      *[_type == "page" && slug.current == "success-stories"][0]{
        _id,
        modules
      }
    `);

        console.log('Finding quote sections...');

        let quoteSectionsCount = 0;
        const updatedModules = page.modules.map(module => {
            if (module._type === 'quoteSection') {
                quoteSectionsCount++;
                console.log(`  ✓ Found quote section: "${module.quote?.substring(0, 50)}..."`);
                console.log(`    Setting style to 'wix'`);
                return {
                    ...module,
                    style: 'wix'
                };
            }
            return module;
        });

        console.log(`\n📝 Updating ${quoteSectionsCount} quote sections...`);

        await client
            .patch(page._id)
            .set({ modules: updatedModules })
            .commit();

        console.log('✅ All quote sections updated to Wix style!');
        console.log('\nThe quotes will now display with:');
        console.log('  - Circular author photos on the left');
        console.log('  - Italic attribution with bold "Inspired Hand"');
        console.log('  - Clean white background');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

updateQuoteSectionsToWixStyle().catch(console.error);
