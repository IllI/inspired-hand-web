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

async function removeDuplicateProductAds() {
    console.log('🔍 Finding and Removing Duplicate Product Ads\n');

    try {
        // Fetch current homepage
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
        console.log(`   Total modules: ${homepage.modules.length}\n`);

        // Find all product ad modules
        const productAdIndices = [];
        homepage.modules.forEach((module, index) => {
            if (module._type === 'productAd') {
                productAdIndices.push(index);
                console.log(`   Found productAd at index ${index}:`);
                console.log(`     _key: ${module._key}`);
                console.log(`     Title: ${module.productTitle}\n`);
            }
        });

        if (productAdIndices.length === 0) {
            console.log('⚠️  No product ads found');
            return;
        }

        if (productAdIndices.length === 1) {
            console.log('✓ Only one product ad found - no duplicates to remove');
            return;
        }

        console.log(`⚠️  Found ${productAdIndices.length} product ads - removing duplicates...\n`);

        // Keep only the first one (the one we want with _key: 'alpha-omega-fido-product-ad')
        const updatedModules = homepage.modules.filter((module, index) => {
            if (module._type === 'productAd') {
                // Keep only if it's the first product ad OR has our specific key
                const isFirst = index === productAdIndices[0];
                const hasOurKey = module._key === 'alpha-omega-fido-product-ad';

                if (isFirst || hasOurKey) {
                    console.log(`   ✓ Keeping: ${module._key || 'unnamed'} at index ${index}`);
                    return true;
                } else {
                    console.log(`   ✗ Removing: ${module._key || 'unnamed'} at index ${index}`);
                    return false;
                }
            }
            return true;
        });

        // Update homepage
        await client.patch(homepage._id).set({ modules: updatedModules }).commit();

        console.log(`\n✅ Updated homepage!`);
        console.log(`   Modules before: ${homepage.modules.length}`);
        console.log(`   Modules after: ${updatedModules.length}`);
        console.log(`   Removed: ${homepage.modules.length - updatedModules.length} module(s)`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

removeDuplicateProductAds().catch(console.error);
