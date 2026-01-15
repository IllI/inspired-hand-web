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

async function debugImageData() {
    console.log('🔍 Debugging ReviewsHero Image Data\n');

    try {
        const page = await client.fetch(`
      *[_type == "page" && slug.current == "success-stories"][0]{
        _id,
        "reviewsHero": modules[_type == "reviewsHero"][0]{
          _type,
          _key,
          backgroundImage{
            asset->{
              _id,
              url
            },
            alt
          },
          defaultText,
          hoverText
        }
      }
    `);

        console.log('ReviewsHero Data:');
        console.log(JSON.stringify(page.reviewsHero, null, 2));

        if (!page.reviewsHero?.backgroundImage?.asset) {
            console.log('\n⚠️  WARNING: backgroundImage.asset is missing!');
            console.log('The image may not have been properly uploaded or linked.');
        } else {
            console.log('\n✅ Image asset found!');
            console.log('   Asset ID:', page.reviewsHero.backgroundImage.asset._id);
            console.log('   URL:', page.reviewsHero.backgroundImage.asset.url);
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

debugImageData().catch(console.error);
