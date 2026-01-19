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

// Product images from Wix
const productImages = [
    {
        url: 'https://static.wixstatic.com/media/1a14de_6e0a802ea68247df920a952a62c3ed88~mv2.png',
        alt: 'The Alpha, The Omega, And Fido Ministry Set Bundle'
    },
    {
        url: 'https://static.wixstatic.com/media/1a14de_1f017ebf60444b0e924636882d308040~mv2.png',
        alt: 'Good Dog Owner\'s Manual'
    },
    {
        url: 'https://static.wixstatic.com/media/1a14de_e6f00b8a7eeb4c78860d503a35963459~mv2.png',
        alt: 'The Alpha, The Omega, And Fido Book'
    },
    {
        url: 'https://static.wixstatic.com/media/1a14de_ac601fb187ce45aa948b8d72fa324627~mv2.gif',
        alt: 'Two Disc Album CD'
    },
    {
        url: 'https://static.wixstatic.com/media/1a14de_6fe9b15d7dbd4e26be091b10c66c56b9~mv2.png',
        alt: 'Product Mockup'
    }
];

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

async function addProductAdToHomepage() {
    console.log('📦 Adding The Alpha, The Omega, And Fido Product Ad to Homepage\n');

    try {
        // Step 1: Upload product images
        console.log('📥 Downloading and uploading product images...\n');
        const uploadedImages = [];

        for (let i = 0; i < productImages.length; i++) {
            const img = productImages[i];
            console.log(`  ${i + 1}. ${img.alt}...`);

            const imageBuffer = await downloadImage(img.url);
            console.log(`     Downloaded (${imageBuffer.length} bytes)`);

            const asset = await client.assets.upload('image', imageBuffer, {
                filename: `alpha-omega-fido-${i + 1}.png`,
            });

            uploadedImages.push({
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: asset._id
                },
                alt: img.alt
            });

            console.log(`     Uploaded as ${asset._id}\n`);
        }

        // Step 2: Create the product ad module
        const productAdModule = {
            _type: 'productAd',
            _key: 'alpha-omega-fido-product-ad',
            productTitle: 'The Alpha, The Omega, And Fido',
            subtitle: 'Ministry Set',
            price: '$79.99 USD',
            rating: 5,
            reviewCount: 521,
            description: 'God has wisdom and instruction for every part of caring for the animals He has put in our care. Our pets are God\'s creation and caring for His creation is God\'s work. If we have the fortune to find a loved pet by our side, we know the joy of being chosen to carry out God\'s work in looking after His creatures by the love that is returned to us by our pets.',
            images: uploadedImages,
            ctaText: 'SHOP NOW',
            ctaLink: '/products/the-alpha-the-omega-and-fido',
            layout: 'imageLeft',
            backgroundColor: 'white'
        };

        // Step 3: Fetch current homepage
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

        // Step 4: Insert product ad after hero
        console.log('✏️  Adding product ad after hero section...');
        const updatedModules = [...homepage.modules];

        // Find the hero module
        const heroIndex = updatedModules.findIndex(m => m._type === 'hero');

        if (heroIndex >= 0) {
            // Insert product ad right after hero
            updatedModules.splice(heroIndex + 1, 0, productAdModule);
            console.log(`   Inserted after hero (position ${heroIndex + 1})`);
        } else {
            // Add at the beginning if no hero found
            updatedModules.unshift(productAdModule);
            console.log('   Inserted at beginning (no hero found)');
        }

        // Step 5: Update homepage
        await client.patch(homepage._id).set({ modules: updatedModules }).commit();

        console.log('\n✅ Product Ad successfully added to homepage!');
        console.log('\n📋 Summary:');
        console.log(`   Images uploaded: ${uploadedImages.length}`);
        console.log(`   Product: ${productAdModule.productTitle}`);
        console.log(`   Price: ${productAdModule.price}`);
        console.log(`   Rating: ${productAdModule.rating}/5 (${productAdModule.reviewCount} reviews)`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

addProductAdToHomepage().catch(console.error);
