const { loadEnvConfig } = require('@next/env');
const { createClient } = require('@sanity/client');
const path = require('path');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
loadEnvConfig(path.resolve(__dirname, '../'), dev);

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

// Stories that need images
const MISSING_IMAGES = [
    {
        slug: 'destructive-collie-to-faithful-companion',
        imagePath: 'C:/Users/cityz/.gemini/antigravity/brain/b8982654-7ef4-46ef-9941-f48d8c6eeeb4/collie_story_image_1768337290707.png',
        altText: 'A peaceful border collie representing a faithful companion',
    },
    {
        slug: 'labradors-gift-of-comfort',
        imagePath: 'C:/Users/cityz/.gemini/antigravity/brain/b8982654-7ef4-46ef-9941-f48d8c6eeeb4/labrador_story_image_1768337303736.png',
        altText: 'A comforting labrador retriever providing comfort',
    },
];

async function uploadMissingImages() {
    console.log('📸 Uploading Missing Story Images\n');
    console.log('='.repeat(50));

    for (const item of MISSING_IMAGES) {
        console.log(`\n🔍 Processing: ${item.slug}`);

        try {
            // Find the story
            const story = await client.fetch(
                `*[_type == "story" && slug.current == $slug][0]{ _id, title }`,
                { slug: item.slug }
            );

            if (!story) {
                console.log(`   ⚠️  Story not found`);
                continue;
            }

            console.log(`   Found: ${story.title}`);

            // Read the image file
            console.log(`   📂 Reading image file...`);
            const imageBuffer = fs.readFileSync(item.imagePath);
            console.log(`   ✓ Loaded (${(imageBuffer.length / 1024).toFixed(2)} KB)`);

            // Upload to Sanity
            console.log(`   ↑ Uploading to Sanity...`);
            const uploadedAsset = await client.assets.upload('image', imageBuffer, {
                filename: `${item.slug}.png`,
            });
            console.log(`   ✓ Uploaded (${uploadedAsset._id})`);

            // Link to story
            console.log(`   🔗 Linking to story...`);
            await client
                .patch(story._id)
                .set({
                    featuredImage: {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: uploadedAsset._id,
                        },
                        alt: item.altText,
                    },
                })
                .commit();

            console.log(`   ✅ Complete!`);
        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Upload complete!\n');
}

uploadMissingImages().catch(console.error);
