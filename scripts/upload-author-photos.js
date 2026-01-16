const { loadEnvConfig } = require('@next/env');
const { createClient } = require('@sanity/client');
const https = require('https');
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

// Profile images extracted from Wix
const profileImages = [
    {
        name: 'Theresa',
        url: 'https://static.wixstatic.com/media/5356223c433c799f8756c587b3f336fc.jpg/v1/crop/x_287,y_25,w_299,h_295/fill/w_144,h_141,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/5356223c433c799f8756c587b3f336fc.jpg',
        quoteStart: 'I firmly recommend to anyone interested in developing an intimacy'
    },
    {
        name: 'James',
        url: 'https://static.wixstatic.com/media/032f05d50cc94a72b840b039bde1e7e8.jpg/v1/crop/x_814,y_0,w_4214,h_4126/fill/w_144,h_141,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/032f05d50cc94a72b840b039bde1e7e8.jpg',
        quoteStart: 'Dear Rev Hunter, I would like to thank you for your work'
    },
    {
        name: 'Jeff',
        url: 'https://static.wixstatic.com/media/edc40648e4c4fdc66bfcf08d168cf475.jpg/v1/crop/x_270,y_0,w_286,h_280/fill/w_144,h_141,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/edc40648e4c4fdc66bfcf08d168cf475.jpg',
        quoteStart: 'This is an inspiration to people who want to make a change'
    },
    {
        name: 'Mark',
        url: 'https://static.wixstatic.com/media/bd91d9d5f5cd4309bdc7a4344d45b7ec.jpg/v1/crop/x_0,y_0,w_3596,h_3529/fill/w_144,h_141,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/bd91d9d5f5cd4309bdc7a4344d45b7ec.jpg',
        quoteStart: 'We have used The Alpha, The Omega, And Fido extensively'
    },
    {
        name: 'Rebecca',
        url: 'https://static.wixstatic.com/media/5ef9297aa051440eb4d22f932466ff3e.jpg/v1/crop/x_1695,y_0,w_3815,h_3744/fill/w_144,h_141,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/5ef9297aa051440eb4d22f932466ff3e.jpg',
        quoteStart: 'By using The Alpha, The Omega, And Fido I\'ve never felt'
    }
];

function downloadImage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        });
    });
}

async function uploadAuthorImages() {
    console.log('📸 Uploading Author Profile Images\n');

    try {
        // Fetch current quotes
        const page = await client.fetch(`
      *[_type == "page" && slug.current == "success-stories"][0]{
        _id,
        modules[_type == "quoteSection"]{
          _key,
          quote,
          authorName
        }
      }
    `);

        for (const profile of profileImages) {
            console.log(`\n🔍 Processing ${profile.name}...`);

            // Find matching quote in Sanity
            const matchingQuote = page.modules.find(q =>
                q.quote && q.quote.toLowerCase().includes(profile.quoteStart.toLowerCase())
            );

            if (!matchingQuote) {
                console.log(`  ⚠️  Could not find matching quote in Sanity`);
                continue;
            }

            console.log(`  ✓ Found quote: ${matchingQuote._key}`);
            console.log(`  📥 Downloading image...`);

            // Download image
            const imageBuffer = await downloadImage(profile.url);
            console.log(`  ✓ Downloaded (${imageBuffer.length} bytes)`);

            // Upload to Sanity
            console.log(`  📤 Uploading to Sanity...`);
            const asset = await client.assets.upload('image', imageBuffer, {
                filename: `${profile.name.toLowerCase()}-profile.jpg`,
            });

            console.log(`  ✓ Uploaded as ${asset._id}`);

            // Link to quote section
            console.log(`  🔗 Linking to quote section...`);
            const fullPage = await client.fetch(`
        *[_type == "page" && slug.current == "success-stories"][0]{_id, modules}
      `);

            const updatedModules = fullPage.modules.map(m => {
                if (m._key === matchingQuote._key) {
                    return {
                        ...m,
                        authorImage: {
                            _type: 'image',
                            asset: {
                                _type: 'reference',
                                _ref: asset._id
                            },
                            alt: `${profile.name} profile photo`
                        }
                    };
                }
                return m;
            });

            await client.patch(fullPage._id).set({ modules: updatedModules }).commit();
            console.log(`  ✅ ${profile.name}'s image linked successfully!`);
        }

        console.log('\n🎉 All author images uploaded and linked!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

uploadAuthorImages().catch(console.error);
