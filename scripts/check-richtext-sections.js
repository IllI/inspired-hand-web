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

async function checkRichTextSections() {
    console.log('🔍 Checking RichTextSections\n');

    try {
        const page = await client.fetch(`
      *[_type == "page" && slug.current == "success-stories"][0]{
        _id,
        "richTextSections": modules[_type == "richTextSection"]{
          _key,
          heading,
          content
        }
      }
    `);

        console.log('RichText Sections:');
        page.richTextSections.forEach((section, i) => {
            console.log(`\n${i + 1}. Key: ${section._key}`);
            console.log(`   Heading: ${section.heading || '(no heading)'}`);
            console.log(`   Content: ${JSON.stringify(section.content).substring(0, 100)}...`);
        });

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

checkRichTextSections().catch(console.error);
