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

async function debugTwoColumnSections() {
    console.log('🔍 Debugging Two Column Sections\n');

    try {
        const homepage = await client.fetch(`
      *[_type == "page" && slug.current == "home"][0]{
        _id,
        modules[_type == "twoColumnSection"]{
          _key,
          _type,
          heading,
          style,
          layout,
          backgroundColor,
          textColor,
          content,
          cta
        }
      }
    `);

        if (!homepage) {
            console.log('❌ Homepage not found!');
            return;
        }

        console.log('Found two column sections:\n');
        homepage.modules.forEach((module, index) => {
            console.log(`${index + 1}. ${module._key}`);
            console.log(`   Heading: ${module.heading || 'NONE'}`);
            console.log(`   Style: ${module.style || 'NONE'}`);
            console.log(`   Layout: ${module.layout || 'NONE'}`);
            console.log(`   BackgroundColor: ${module.backgroundColor || 'NONE'}`);
            console.log(`   TextColor: ${module.textColor || 'NONE'}`);
            console.log(`   CTA: ${module.cta?.label || 'NONE'}`);
            console.log(`   Content blocks: ${module.content?.length || 0}\n`);
        });

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

debugTwoColumnSections().catch(console.error);
