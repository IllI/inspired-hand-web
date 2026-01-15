const { loadEnvConfig } = require('@next/env');
const { createClient } = require('@sanity/client');
const path = require('path');
const https = require('https');

const dev = process.env.NODE_ENV !== 'production';
loadEnvConfig(path.resolve(__dirname, '../'), dev);

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

// Background image from Wix
const HERO_IMAGE_URL = 'https://static.wixstatic.com/media/2316d87f77b94ed7bb76f8998afbc696.jpg/v1/fill/w_1920,h_640,al_c,q_90,enc_avif,quality_auto/2316d87f77b94ed7bb76f8998afbc696.jpg';

function downloadImage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }

            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        }).on('error', reject);
    });
}

async function updateSuccessStoriesHero() {
    console.log('🎨 Updating Success Stories Hero Section\n');
    console.log('='.repeat(60));

    try {
        // Step 1: Download and upload the hero background image
        console.log('\n📸 Downloading hero background image...');
        const imageBuffer = await downloadImage(HERO_IMAGE_URL);
        console.log(`   ✓ Downloaded (${(imageBuffer.length / 1024).toFixed(2)} KB)`);

        console.log('   ↑ Uploading to Sanity...');
        const uploadedAsset = await client.assets.upload('image', imageBuffer, {
            filename: 'success-stories-hero.jpg',
        });
        console.log(`   ✓ Uploaded (${uploadedAsset._id})`);

        // Step 2: Find the Success Stories page
        console.log('\n📄 Finding Success Stories page...');
        const page = await client.fetch(`
      *[_type == "page" && slug.current == "success-stories"][0]{ _id, modules }
    `);

        if (!page) {
            console.error('   ✗ Page not found!');
            return;
        }
        console.log(`   ✓ Found page (${page._id})`);

        // Step 3: Update the hero section
        console.log('\n✏️  Updating hero section...');

        // Create the new hero module that matches Wix
        const updatedHero = {
            _type: 'hero',
            _key: 'hero-success-stories',
            heading: 'SUCCESS STORIES',
            subheading: 'Discover Inspired Hand',
            style: 'default',
            backgroundImage: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: uploadedAsset._id,
                },
                alt: 'Woman with dogs in a park',
            },
            cta: {
                label: 'Read them now',
                link: '#stories-grid',
            },
        };

        // Replace the first module (hero) with the updated one
        const updatedModules = page.modules.map((module, index) => {
            if (index === 0 && module._type === 'hero') {
                return updatedHero;
            }
            return module;
        });

        // If there's no hero at the beginning, add it
        if (!updatedModules[0] || updatedModules[0]._type !== 'hero') {
            updatedModules.unshift(updatedHero);
        }

        await client
            .patch(page._id)
            .set({ modules: updatedModules })
            .commit();

        console.log('   ✓ Hero section updated!');

        console.log('\n' + '='.repeat(60));
        console.log('✅ Success Stories hero updated!\n');
        console.log('Changes made:');
        console.log('  - Background image: Woman with dogs (from Wix)');
        console.log('  - Heading: "SUCCESS STORIES"');
        console.log('  - Subheading: "Discover Inspired Hand"');
        console.log('  - CTA button: "Read them now"');
        console.log('\nNext steps:');
        console.log('1. Refresh Sanity Studio');
        console.log('2. Publish the Success Stories page');
        console.log('3. Check the live site to verify the hero looks correct');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

updateSuccessStoriesHero().catch(console.error);
