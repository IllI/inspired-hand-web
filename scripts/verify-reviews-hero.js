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

async function verifyReviewsHero() {
    console.log('🔍 Verifying Reviews Hero Data\n');
    console.log('='.repeat(60));

    try {
        const page = await client.fetch(`
      *[_type == "page" && slug.current == "success-stories"][0]{
        _id,
        modules[_type == "reviewsHero"]{
          _type,
          _key,
          defaultText,
          hoverText,
          sectionTitle,
          "hasImage": defined(backgroundImage.asset)
        }
      }
    `);

        console.log('\nReviews Hero Modules:');
        console.log(JSON.stringify(page.modules, null, 2));

        const reviewsHero = page.modules?.[0];

        if (!reviewsHero) {
            console.log('\n⚠️  No reviewsHero found!');
            return;
        }

        console.log('\n✅ Reviews Hero found!');
        console.log(`   defaultText: "${reviewsHero.defaultText || 'MISSING'}"`);
        console.log(`   hoverText: "${reviewsHero.hoverText || 'MISSING'}"`);
        console.log(`   sectionTitle: "${reviewsHero.sectionTitle || 'MISSING'}"`);
        console.log(`   hasImage: ${reviewsHero.hasImage}`);

        if (!reviewsHero.hoverText) {
            console.log('\n⚠️  hoverText is missing! This will cause the error.');
            console.log('   Fixing it now...');

            // Find the full module
            const fullPage = await client.fetch(`
        *[_type == "page" && slug.current == "success-stories"][0]{ _id, modules }
      `);

            const updatedModules = fullPage.modules.map(m => {
                if (m._type === 'reviewsHero') {
                    return {
                        ...m,
                        hoverText: m.hoverText || 'Reviews from people just like you.',
                    };
                }
                return m;
            });

            await client.patch(fullPage._id).set({ modules: updatedModules }).commit();
            console.log('   ✅ Fixed!');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

verifyReviewsHero().catch(console.error);
