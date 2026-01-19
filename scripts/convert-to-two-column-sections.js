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

async function convertToTwoColumnSections() {
    console.log('🔄 Converting Homepage Sections to TwoColumn with Images\n');

    try {
        //Step 1: Download and upload images
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

        // Step 3: Convert sections to twoColumnSection
        const updatedModules = homepage.modules.map(module => {
            // Convert "Need prayer" formSection to twoColumnSection
            if (module._type === 'formSection' && module.heading === 'Need prayer? We\'re here.') {
                console.log('✏️  Converting "Need prayer?" formSection to twoColumnSection with image\n');

                return {
                    _type: 'twoColumnSection',
                    _key: module._key,
                    layout: 'image-right',
                    heading: module.heading,
                    content: [
                        {
                            _type: 'block',
                            _key: 'prayer-content',
                            style: 'normal',
                            children: [{
                                _type: 'span',
                                text: 'Join our prayer chain to receive prayer and give prayer to those in need.'
                            }]
                        }
                    ],
                    image: {
                        _type: 'image',
                        _key: 'praying-hands-image',
                        asset: {
                            _type: 'reference',
                            _ref: prayingHandsAsset._id
                        },
                        alt: 'Hands clasped in prayer'
                    },
                    cta: {
                        label: 'JOIN OUR PRAYER CHAIN',
                        link: '/prayer'
                    }
                };
            }

            // Convert "Our Story" richTextSection to twoColumnSection with dark background
            if (module._type === 'richTextSection' && module.heading === 'Our Story') {
                console.log('✏️  Converting "Our Story" richTextSection to twoColumnSection with dark background\n');

                return {
                    _type: 'twoColumnSection',
                    _key: module._key,
                    layout: 'image-right',
                    heading: null, // No headingfor this section, it has special labelabove
                    content: [
                        {
                            _type: 'block',
                            _key: 'story-label',
                            style: 'normal',
                            children: [{
                                _type: 'span',
                                text: 'OUR STORY',
                                marks: ['strong']
                            }]
                        },
                        {
                            _type: 'block',
                            _key: 'story-quote',
                            style: 'blockquote',
                            children: [{
                                _type: 'span',
                                text: '"God is light; In him there is no darkness..."',
                                marks: ['em']
                            }]
                        },
                        {
                            _type: 'block',
                            _key: 'story-verse',
                            style: 'normal',
                            children: [{
                                _type: 'span',
                                text: '1 John 1:5',
                                marks: ['em']
                            }]
                        }
                    ],
                    image: {
                        _type: 'image',
                        _key: 'reading-book-image',
                        asset: {
                            _type: 'reference',
                            _ref: readingImageAsset._id
                        },
                        alt: 'Person reading book in cozy setting'
                    },
                    cta: {
                        label: 'LEARN ABOUT OUR STORY',
                        link: '/mission'
                    },
                    backgroundColor: '#335168',
                    textColor: 'white'
                };
            }

            return module;
        });

        // Step 4: Update homepage
        console.log('💾 Saving changes...');
        await client.patch(homepage._id).set({ modules: updatedModules }).commit();

        console.log('\n✅ Successfully converted both sections!');
        console.log('\n📋 Summary:');
        console.log('   ✓ "Need prayer?" → twoColumnSection with praying hands image');
        console.log('   ✓ "Our Story" → twoColumnSection with reading image and dark blue background (#335168)');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

convertToTwoColumnSections().catch(console.error);
