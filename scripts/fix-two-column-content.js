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

async function fixTwoColumnContent() {
    console.log('🔧 Fixing Two Column Section Content\n');

    try {
        const homepage = await client.fetch(`
      *[_type == "page" && slug.current == "home"][0]{
        _id,
        modules
      }
    `);

        if (!homepage) {
            console.log('❌ Homepage not found!');
            return;
        }

        const updatedModules = homepage.modules.map(module => {
            // Fix "Need prayer?" section
            if (module._type === 'twoColumnSection' && module._key === 'c00778c4b0c7') {
                console.log('✏️  Fixing "Need prayer?" content\n');

                return {
                    ...module,
                    heading: 'Need prayer? We\'re here.',
                    content: [
                        {
                            _type: 'block',
                            _key: 'prayer-desc',
                            style: 'normal',
                            markDefs: [],
                            children: [{
                                _type: 'span',
                                _key: 'prayer-span',
                                text: 'Join our prayer chain to receive prayer and give prayer to those in need.',
                                marks: []
                            }]
                        }
                    ]
                };
            }

            // Fix "Our Story" section - NO heading, content has label, quote, and verse
            if (module._type === 'twoColumnSection' && module._key === '549993ff6ddc') {
                console.log('✏️  Fixing "Our Story" content\n');

                return {
                    ...module,
                    heading: null, // No heading for this section
                    content: [
                        {
                            _type: 'block',
                            _key: 'story-label-block',
                            style: 'normal',
                            markDefs: [],
                            children: [{
                                _type: 'span',
                                _key: 'story-label-span',
                                text: 'OUR STORY',
                                marks: []
                            }]
                        },
                        {
                            _type: 'block',
                            _key: 'story-quote-block',
                            style: 'normal',
                            markDefs: [],
                            children: [{
                                _type: 'span',
                                _key: 'story-quote-span',
                                text: '"God is light; In him there is no darkness..."',
                                marks: []
                            }]
                        },
                        {
                            _type: 'block',
                            _key: 'story-verse-block',
                            style: 'normal',
                            markDefs: [],
                            children: [{
                                _type: 'span',
                                _key: 'story-verse-span',
                                text: '1 John 1:5',
                                marks: ['em'] // Italic for verse
                            }]
                        }
                    ]
                };
            }

            return module;
        });

        await client.patch(homepage._id).set({ modules: updatedModules }).commit();

        console.log('✅ Successfully fixed content blocks!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
    }
}

fixTwoColumnContent().catch(console.error);
