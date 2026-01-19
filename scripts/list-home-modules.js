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

async function listHomeModules() {
    console.log('📋 Listing Homepage Modules\n');

    try {
        const homepage = await client.fetch(`
      *[_type == "page" && slug.current == "home"][0]{
        _id,
        title,
        modules[]{
          _type,
          _key,
          heading,
          productTitle,
          sectionTitle,
          quote
        }
      }
    `);

        if (!homepage) {
            console.log('❌ Homepage not found!');
            return;
        }

        console.log(`Page: ${homepage.title}`);
        console.log(`Total modules: ${homepage.modules.length}\n`);
        console.log('═══════════════════════════════════════════════════\n');

        homepage.modules.forEach((module, index) => {
            console.log(`${index + 1}. ${module._type.toUpperCase()}`);
            console.log(`   _key: ${module._key || 'none'}`);

            if (module.heading) console.log(`   Heading: ${module.heading}`);
            if (module.productTitle) console.log(`   Product: ${module.productTitle}`);
            if (module.sectionTitle) console.log(`   Section: ${module.sectionTitle}`);
            if (module.quote) console.log(`   Quote: ${module.quote.substring(0, 50)}...`);

            console.log('');
        });

        console.log('═══════════════════════════════════════════════════');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

listHomeModules().catch(console.error);
