const { loadEnvConfig } = require('@next/env');
const { createClient } = require('@sanity/client');
const https = require('https');
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

function downloadImage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        });
    });
}

async function updateTwoColumnSections() {
    console.log('🖼️  Updating Two Column Sections with Images\n');

    try {
        // Step 1: Download and upload images
        console.log('📥 Downloading images...\n');

        const prayingHandsUrl = 'https://static.wixstatic.com/media/1a14de_1f017ebf60444b0e924636882d308040~mv2.png';
        const readingImageUrl = 'https://static.wixstatic.com/media/1a14de_6726b897f7de42388abd7aa41d5bfc6a~mv2.gif';

        console.log('  1. Praying hands image...');
        const prayingHandsBuffer = await downloadImage(prayingHandsUrl);
        console.log(`     Downloaded (${prayingHandsBuffer.length} bytes)`);
        const prayingHandsAsset = await client.assets.upload('image', prayingHandsBuffer, {
            filename: 'praying-hands.png',
        });
        console.log(`     Uploaded as ${prayingHandsAsset._id}\n`);

        console.log('  2. Reading/Book image...');
        const readingImageBuffer = await downloadImage(readingImageUrl);
        console.log(`     Downloaded (${readingImageBuffer.length} bytes)`);
        const readingImageAsset = await client.assets.upload('image', readingImageBuffer, {
            filename: 'reading-book.gif',
        });
        console.log(`     Uploaded as ${readingImageAsset._id}\n`);

        // Step 2: Fetch current homepage
        console.log('📄 Fetching homepage...');
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

        console.log(`✓ Found homepage with ${homepage.modules.length} modules\n`);

        // Step 3: Find and update the sections
        const updatedModules = homepage.modules.map(module => {
            // Update "Need prayer" section (formSection)
            if (module._type === 'formSection' && module.heading === 'Need prayer? We\'re here.') {
                console.log('✏️  Updating "Need prayer? We\'re here." section:');
                console.log('   Adding praying hands image\n');

                return {
                    ...module,
                    image: {
                        _type: 'image',
                        _key: 'praying-hands-image',
                        asset: {
                            _type: 'reference',
                            _ref: prayingHandsAsset._id
                        },
                        alt: 'Hands clasped in prayer'
                    }
                };
            }

            // Update "Our Story" section (richTextSection)
            if (module._type === 'richTextSection' && module.heading === 'Our Story') {
                console.log('✏️  Updating "Our Story" section:');
                console.log('   Adding reading image');
                console.log('   Adding blue background style\n');

                return {
                    ...module,
                    image: {
                        _type: 'image',
                        _key: 'reading-book-image',
                        asset: {
                            _type: 'reference',
                            _ref: readingImageAsset._id
                        },
                        alt: 'Person reading book in cozy setting'
                    },
                    backgroundColor: '#335168', // Dark blue/teal from Wix
                    textColor: 'white',
                    layout: 'imageRight' // Image on right, text on left
                };
            }

            return module;
        });

        // Step 4: Update homepage
        console.log('💾 Saving changes...');
        await client.patch(homepage._id).set({ modules: updatedModules }).commit();

        console.log('\n✅ Successfully updated both sections!');
        console.log('\n📋 Summary:');
        console.log('   ✓ Prayer section now has praying hands image');
        console.log('   ✓ Our Story section now has reading image');
        console.log('   ✓ Our Story section now has dark blue background (#335168)');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

updateTwoColumnSections().catch(console.error);
