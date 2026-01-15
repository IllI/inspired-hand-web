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

async function removeWhatOurReadersSay() {
    console.log('🗑️  Removing "What Our Readers Say" section\n');

    try {
        const page = await client.fetch(`
      *[_type == "page" && slug.current == "success-stories"][0]{
        _id,
        modules[]{
          _type,
          _key,
          heading,
          "preview": select(
            _type == "richTextSection" => heading,
            _type == "quoteSection" => quote[0..30]
          )
        }
      }
    `);

        console.log('All modules:');
        page.modules.forEach((m, i) => {
            console.log(`  ${i}: ${m._type} - ${m.heading || m.preview || '(no heading)'}`);
        });

        // Find and remove "What Our Readers Say" section
        const toRemove = page.modules.find(m =>
            m.heading && m.heading.toLowerCase().includes('what our readers say')
        );

        if (!toRemove) {
            console.log('\n⚠️  "What Our Readers Say" section not found');
            return;
        }

        console.log(`\n✓ Found section to remove: "${toRemove.heading}" (${toRemove._key})`);

        const updatedModules = page.modules.filter(m => m._key !== toRemove._key);

        await client
            .patch(page._id)
            .set({ modules: updatedModules })
            .commit();

        console.log('✅ Section removed!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

removeWhatOurReadersSay().catch(console.error);
