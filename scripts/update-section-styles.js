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

async function updateSectionStyles() {
    console.log('🎨 Updating Section Styles to Match Wix\n');

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
            // Update "Need prayer?" section
            if (module._type === 'twoColumnSection' && module._key === 'c00778c4b0c7') {
                console.log('✏️  Updating "Need prayer?" section styles\n');

                return {
                    ...module,
                    style: 'primary', // Use full-width split style
                    ctaColor: '#5DA1D4' // Blue button color from Wix
                };
            }

            // Update "Our Story" section
            if (module._type === 'twoColumnSection' && module._key === '549993ff6ddc') {
                console.log('✏️  Updating "Our Story" section to full-width split\n');

                return {
                    ...module,
                    style: 'primary', // Use full-width split style (we'll handle color separately)
                };
            }

            return module;
        });

        await client.patch(homepage._id).set({ modules: updatedModules }).commit();

        console.log('✅ Successfully updated section styles!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

updateSectionStyles().catch(console.error);
