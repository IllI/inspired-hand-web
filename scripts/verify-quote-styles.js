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

async function verifyQuoteStyles() {
    console.log('🔍 Verifying Quote Styles\n');

    try {
        const page = await client.fetch(`
      *[_type == "page" && slug.current == "success-stories"][0]{
        _id,
        "quotes": modules[_type == "quoteSection"]{
          _key,
          style,
          "quote": quote[0..40]
        }
      }
    `);

        console.log('Quote sections:');
        page.quotes.forEach((q, i) => {
            console.log(`  ${i + 1}. Style: ${q.style || 'default'} - ${q.quote}...`);
        });

        const wrongStyles = page.quotes.filter(q => q.style !== 'wix');

        if (wrongStyles.length > 0) {
            console.log(`\n⚠️  ${wrongStyles.length} quotes are not using 'wix' style!`);
            console.log('   Re-running update...\n');

            const updatedModules = (await client.fetch(`
        *[_type == "page" && slug.current == "success-stories"][0].modules
      `)).map(m => {
                if (m._type === 'quoteSection') {
                    return { ...m, style: 'wix' };
                }
                return m;
            });

            await client.patch(page._id).set({ modules: updatedModules }).commit();
            console.log('✅ Fixed!');
        } else {
            console.log('\n✅ All quotes are using wix style');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

verifyQuoteStyles().catch(console.error);
