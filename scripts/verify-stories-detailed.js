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

async function verifyStories() {
    // Check all story type documents
    const stories = await client.fetch(`
    *[_type == "story"] | order(title asc) {
      _id,
      _type,
      title,
      "slug": slug.current
    }
  `);

    console.log('\n📚 All Story Documents:');
    console.log(`Found ${stories.length} stories with type 'story':\n`);
    stories.forEach((story, index) => {
        console.log(`${index + 1}. ${story.title}`);
        console.log(`   Slug: /${story.slug}`);
        console.log(`   ID: ${story._id}\n`);
    });

    // Check the Success Stories page
    const page = await client.fetch(`
    *[_type == "page" && slug.current == "success-stories"][0]{
      _id,
      title,
      modules[_type == "storiesGrid"]{
        _type,
        title,
        "stories": stories[]->{
          _id,
          _type,
          title,
          "slug": slug.current
        }
      }
    }
  `);

    console.log('\n📄 Success Stories Page:');
    console.log(`Page ID: ${page._id}`);
    console.log(`Page Title: ${page.title}\n`);

    const storiesGrid = page.modules.find(m => m._type === 'storiesGrid');
    if (storiesGrid) {
        console.log(`Stories Grid Title: ${storiesGrid.title}`);
        console.log(`Number of stories linked: ${storiesGrid.stories?.length || 0}\n`);

        if (storiesGrid.stories && storiesGrid.stories.length > 0) {
            console.log('Linked Stories:');
            storiesGrid.stories.forEach((story, index) => {
                console.log(`${index + 1}. ${story.title} (${story._type}) - /${story.slug}`);
            });
        }
    }
}

verifyStories().catch(console.error);
