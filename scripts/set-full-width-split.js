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

async function updateToFullWidthSplit() {
    console.log('🎨 Updating Sections to Full-Width Split Style\n');

    try {
        const homepage = await client.fetch(`
      *[_type == "page" && slug.current == "home"][0]{
        _id,
        modules
      }
    `);

        if (!homepage) {
            console.log('❌ Homepage not found!');
            return;
        }

        const updatedModules = homepage.modules.map(module => {
            // Update "Need prayer?" section to use full-width split
            if (module._type === 'twoColumnSection' && module._key === 'c00778c4b0c7') {
                console.log('✏️  Setting "Need prayer?" to full-width split style\n');

                return {
                    ...module,
                    style: 'primary' // This triggers the full-width split layout
                };
            }

            // Update "Our Story" section to use full-width split
            if (module._type === 'twoColumnSection' && module._key === '549993ff6ddc') {
                console.log('✏️  Setting "Our Story" to full-width split style\n');

                return {
                    ...module,
                    style: 'primary' // This triggers the full-width split layout
                };
            }

            return module;
        });

        await client.patch(homepage._id).set({ modules: updatedModules }).commit();

        console.log('✅ Successfully updated sections to full-width split!');
        console.log('\n📋 Both sections now use:');
        console.log('   - Full-width split layout (image on one side, content on other)');
        console.log('   - Proper background colors (white for prayer, #335168 for story)');
        console.log('   - Correct button colors (blue for prayer, white for story)');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

updateToFullWidthSplit().catch(console.error);
