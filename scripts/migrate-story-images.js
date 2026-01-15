const { loadEnvConfig } = require('@next/env');
const { createClient } = require('@sanity/client');
const path = require('path');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');

const dev = process.env.NODE_ENV !== 'production';
loadEnvConfig(path.resolve(__dirname, '../'), dev);

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

// Story images from Wix site
const STORY_IMAGES = [
    {
        title: "Destructive Collie Calmed by Lord's Voice",
        slug: 'destructive-collie-calmed-by-lord',
        imageUrl: 'https://static.wixstatic.com/media/1a14de_d39f01b39a9246e088ff252acfe6b321~mv2.jpg',
    },
    {
        title: "An Angel's Visit Reveals Christ's Love",
        slug: 'angels-visit-reveals-christs-love',
        imageUrl: 'https://static.wixstatic.com/media/1a14de_6b021a16e068416b8beed567233fa065~mv2.jpg',
    },
    {
        title: "Tumor No Match For God",
        slug: 'retriever-cancer-battle',
        imageUrl: 'https://static.wixstatic.com/media/1a14de_c333d727794442e3ac25232c4e67301a~mv2.jpg',
    },
    {
        title: "Barking Problems with Husky No More!",
        slug: 'huskys-path-to-redemption',
        imageUrl: 'https://static.wixstatic.com/media/1a14de_08b322c4c19b4f2c9ef3c71ea780c6c9~mv2_d_2500_1661_s_2.jpg',
    },
    {
        title: "Deaf Dalmation Hears Owner's Voice",
        slug: 'beagles-spiritual-awakening',
        imageUrl: 'https://static.wixstatic.com/media/1a14de_59b2b954362c4774a73ca81dc8f99ed7~mv2_d_2422_1597_s_2.jpg',
    },
    {
        title: "Dog Reveals Christ's Work",
        slug: 'dog-reveals-christs-work',
        imageUrl: 'https://static.wixstatic.com/media/1a14de_8484a71443fe400aa97782c41d956b6d~mv2.jpg',
    },
    {
        title: "Retriever Cancer Battle",
        slug: 'retrievers-cancer-battle',
        imageUrl: 'https://static.wixstatic.com/media/1a14de_39191b5f6e6e4fafbbdf3a9ef800ab53~mv2.png',
    },
    {
        title: "German Shepherd Seizures",
        slug: 'german-shepherds-journey-to-peace',
        imageUrl: 'https://static.wixstatic.com/media/1a14de_a0935fdd2be14f6383bae451d02be72b~mv2.jpg',
    },
    {
        title: "Rescue Saved Through Christian Love",
        slug: 'rescue-saved-through-christian-love',
        imageUrl: 'https://static.wixstatic.com/media/1a14de_5f84d42abed044458c2adbd367b5b0d5~mv2.jpg',
    },
];

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

async function uploadImageToSanity(imageBuffer, filename) {
    return client.assets.upload('image', imageBuffer, {
        filename: filename,
    });
}

async function migrateStoryImages() {
    console.log('🖼️  Migrating Success Story Images from Wix\n');
    console.log('='.repeat(50));

    for (const storyImage of STORY_IMAGES) {
        console.log(`\n📸 Processing: ${storyImage.title}`);
        console.log(`   Slug: ${storyImage.slug}`);

        try {
            // Find the story document
            const story = await client.fetch(
                `*[_type == "story" && slug.current == $slug][0]{ _id, title, featuredImage }`,
                { slug: storyImage.slug }
            );

            if (!story) {
                console.log(`   ⚠️  Story not found with slug: ${storyImage.slug}`);
                continue;
            }

            // Check if image already exists
            if (story.featuredImage?.asset) {
                console.log(`   ℹ️  Story already has an image, skipping`);
                continue;
            }

            // Download the image
            console.log(`   ↓ Downloading image...`);
            const imageBuffer = await downloadImage(storyImage.imageUrl);
            console.log(`   ✓ Downloaded (${(imageBuffer.length / 1024).toFixed(2)} KB)`);

            // Upload to Sanity
            console.log(`   ↑ Uploading to Sanity...`);
            const ext = storyImage.imageUrl.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i)?.[1] || 'jpg';
            const filename = `${storyImage.slug}.${ext}`;

            const uploadedAsset = await uploadImageToSanity(imageBuffer, filename);
            console.log(`   ✓ Uploaded to Sanity (${uploadedAsset._id})`);

            // Update the story document with the image
            console.log(`   🔗 Linking image to story...`);
            await client
                .patch(story._id)
                .set({
                    featuredImage: {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: uploadedAsset._id,
                        },
                        alt: storyImage.title,
                    },
                })
                .commit();

            console.log(`   ✅ Complete!`);
        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Image migration complete!\n');
    console.log('Next steps:');
    console.log('1. Refresh Sanity Studio to see the images');
    console.log('2. Check each story to verify the correct image is attached');
    console.log('3. Adjust any mismatched images if necessary');
}

migrateStoryImages().catch(console.error);
