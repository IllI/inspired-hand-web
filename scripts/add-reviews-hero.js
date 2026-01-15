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

// Background image from Wix Reviews Hero
const REVIEWS_BG_URL = 'https://static.wixstatic.com/media/65c835162bd3410082e767338909fa54.jpeg/v1/fill/w_1920,h_450,al_c,q_90,enc_avif,quality_auto/65c835162bd3410082e767338909fa54.jpeg';

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

async function addReviewsHeroToSuccessStories() {
    console.log('🎨 Adding Reviews Hero to Success Stories Page\n');
    console.log('='.repeat(60));

    try {
        // Step 1: Download and upload the reviews background image
        console.log('\n📸 Downloading reviews background image...');
        const imageBuffer = await downloadImage(REVIEWS_BG_URL);
        console.log(`   ✓ Downloaded (${(imageBuffer.length / 1024).toFixed(2)} KB)`);

        console.log('   ↑ Uploading to Sanity...');
        const uploadedAsset = await client.assets.upload('image', imageBuffer, {
            filename: 'reviews-hero-background.jpg',
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

        // Step 3: Create the ReviewsHero module
        console.log('\n✏️  Creating Reviews Hero module...');

        const reviewsHeroModule = {
            _type: 'reviewsHero',
            _key: 'reviews-hero-section',
            backgroundImage: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: uploadedAsset._id,
                },
                alt: 'Person hugging dog - reviews section',
            },
            defaultText: 'What are people saying?',
            hoverText: 'Reviews from people just like you.',
            sectionTitle: 'The Alpha, The Omega, And Fido Reviews',
        };

        // Step 4: Insert after the stories grid
        // Find the storiesGrid index
        const storiesGridIndex = page.modules.findIndex(m => m._type === 'storiesGrid');

        let updatedModules;
        if (storiesGridIndex !== -1) {
            // Insert right after the stories grid
            updatedModules = [
                ...page.modules.slice(0, storiesGridIndex + 1),
                reviewsHeroModule,
                ...page.modules.slice(storiesGridIndex + 1),
            ];
            console.log(`   ✓ Inserting after stories grid (position ${storiesGridIndex + 1})`);
        } else {
            // If no stories grid found, add at the end
            updatedModules = [...page.modules, reviewsHeroModule];
            console.log('   ✓ Adding to end of page');
        }

        await client
            .patch(page._id)
            .set({ modules: updatedModules })
            .commit();

        console.log('   ✓ Reviews Hero added!');

        console.log('\n' + '='.repeat(60));
        console.log('✅ Reviews Hero successfully added!\n');
        console.log('The reviews hero will display:');
        console.log('  - Background: Person with dog');
        console.log('  - Default: "What are people saying?" (yellow box)');
        console.log('  - Hover: "Reviews from people just like you." (white box)');
        console.log('  - Section title: "The Alpha, The Omega, And Fido Reviews"');
        console.log('\nNext steps:');
        console.log('1. Commit and push the code changes');
        console.log('2. Deploy to Vercel');
        console.log('3. Check the Success Stories page');
        console.log('4. Test the hover interaction');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error);
    }
}

addReviewsHeroToSuccessStories().catch(console.error);
