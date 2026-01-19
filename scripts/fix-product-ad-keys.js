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

async function fixProductAdImageKeys() {
    console.log('🔧 Fixing Product Ad Image _key Properties\n');

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

        // Find the product ad module
        const productAdIndex = homepage.modules.findIndex(
            m => m._type === 'productAd' && m._key === 'alpha-omega-fido-product-ad'
        );

        if (productAdIndex === -1) {
            console.log('❌ Product ad module not found!');
            return;
        }

        console.log('✓ Found product ad module');

        // Fix the images array by adding _key to each image
        const updatedModules = [...homepage.modules];
        const productAd = updatedModules[productAdIndex];

        if (productAd.images && Array.isArray(productAd.images)) {
            productAd.images = productAd.images.map((img, index) => ({
                ...img,
                _key: `product-image-${index + 1}`,
                _type: 'image'
            }));

            console.log(`✓ Added _key to ${productAd.images.length} images`);

            // Update the modules
            updatedModules[productAdIndex] = productAd;

            // Commit the changes
            await client.patch(homepage._id).set({ modules: updatedModules }).commit();

            console.log('\n✅ Successfully fixed image keys!');
            console.log('\nFixed images:');
            productAd.images.forEach((img, i) => {
                console.log(`  ${i + 1}. ${img._key} - ${img.alt}`);
            });
        } else {
            console.log('⚠️  No images found in product ad');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

fixProductAdImageKeys().catch(console.error);
