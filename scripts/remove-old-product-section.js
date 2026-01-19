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

async function removeOldProductSection() {
    console.log('🗑️  Removing Old Product Section\n');

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

        console.log('📄 Found homepage');
        console.log(`   Current modules: ${homepage.modules.length}\n`);

        // Find the old twoColumnSection with "The Alpha, The Omega, And Fido" heading
        const oldSectionIndex = homepage.modules.findIndex(
            m => m._type === 'twoColumnSection' &&
                m.heading === 'The Alpha, The Omega, And Fido'
        );

        if (oldSectionIndex === -1) {
            console.log('ℹ️  Old product section not found (may have been already removed)');
            return;
        }

        console.log(`✓ Found old product section at index ${oldSectionIndex}`);
        console.log(`   _key: ${homepage.modules[oldSectionIndex]._key}`);
        console.log(`   _type: ${homepage.modules[oldSectionIndex]._type}`);
        console.log(`   heading: ${homepage.modules[oldSectionIndex].heading}\n`);

        // Remove the old section
        const updatedModules = homepage.modules.filter((_, index) => index !== oldSectionIndex);

        // Update homepage
        await client.patch(homepage._id).set({ modules: updatedModules }).commit();

        console.log('✅ Successfully removed old product section!');
        console.log(`   Modules before: ${homepage.modules.length}`);
        console.log(`   Modules after: ${updatedModules.length}\n`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

removeOldProductSection().catch(console.error);
