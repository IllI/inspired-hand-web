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

async function verifyImages() {
    const stories = await client.fetch(`
    *[_type == "story" && slug.current in [
      "angels-visit-reveals-christs-love",
      "dog-reveals-christs-work",
      "rescue-saved-through-christian-love",
      "destructive-collie-to-faithful-companion",
      "retrievers-cancer-battle",
      "german-shepherds-journey-to-peace",
      "beagles-spiritual-awakening",
      "labradors-gift-of-comfort",
      "huskys-path-to-redemption"
    ]] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      "hasImage": defined(featuredImage.asset),
      "imageId": featuredImage.asset._ref
    }
  `);

    console.log('\n📊 Success Story Image Status\n');
    console.log('='.repeat(60));

    let withImages = 0;
    let withoutImages = 0;

    stories.forEach((story) => {
        const status = story.hasImage ? '✅' : '❌';
        console.log(`\n${status} ${story.title}`);
        console.log(`   Slug: /${story.slug}`);
        if (story.hasImage) {
            console.log(`   Image: ${story.imageId}`);
            withImages++;
        } else {
            console.log(`   Image: MISSING`);
            withoutImages++;
        }
    });

    console.log('\n' + '='.repeat(60));
    console.log(`\n✅ Stories with images: ${withImages}`);
    console.log(`❌ Stories missing images: ${withoutImages}`);
    console.log(`📊 Total stories: ${stories.length}\n`);
}

verifyImages().catch(console.error);
