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

async function verifyPage() {
    const page = await client.fetch(`
    *[_type == "page" && slug.current == "success-stories"][0]{
      _id,
      title,
      modules[]{
        _type,
        _key,
        heading,
        title,
        "storyCount": count(stories)
      }
    }
  `);

    console.log('Success Stories Page Structure:');
    console.log(JSON.stringify(page, null, 2));
}

verifyPage().catch(console.error);
