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

async function fixStoryTypes() {
    console.log('🔧 Fix Story Types Script\n');
    console.log('='.repeat(50));

    // Step 1: Find the Success Stories page and clear the stories grid
    console.log('\n📄 Step 1: Clearing stories from Success Stories page...');
    const page = await client.fetch(`*[_type == "page" && slug.current == "success-stories"][0]{ _id }`);

    if (page) {
        // Find the storiesGrid module and clear it temporarily
        const pageData = await client.fetch(`*[_type == "page" && slug.current == "success-stories"][0]{ modules }`);
        const updatedModules = pageData.modules.map(module => {
            if (module._type === 'storiesGrid') {
                return { ...module, stories: [] };
            }
            return module;
        });

        await client
            .patch(page._id)
            .set({ modules: updatedModules })
            .commit();

        console.log('✓ Cleared stories from grid');
    }

    // Step 2: Delete old incorrectly typed stories
    console.log('\n🗑️  Step 2: Deleting incorrectly typed stories...');
    const incorrectStories = await client.fetch(`*[_type == "successStory"]{ _id, title }`);

    for (const story of incorrectStories) {
        try {
            await client.delete(story._id);
            console.log(`  ✓ Deleted: ${story.title}`);
        } catch (error) {
            console.error(`  ✗ Failed to delete ${story.title}:`, error.message);
        }
    }

    // Step 3: Create new stories with correct type
    console.log('\n📚 Step 3: Creating stories with correct type...');

    const STORIES = [
        {
            title: "An Angel's Visit Reveals Christ's Love",
            slug: 'angels-visit-reveals-christs-love',
            excerpt: 'A heartwarming story about how a special dog helped reveal the love of Christ.',
            seoDescription: 'Read about how a beloved pet helped reveal Christ\'s love in this inspiring story.',
        },
        {
            title: "Dog Reveals Christ's Work in Training",
            slug: 'dog-reveals-christs-work',
            excerpt: 'Discover how training a dog became a spiritual journey of faith and understanding.',
            seoDescription: 'A story about how dog training revealed Christ\'s work and deepened faith.',
        },
        {
            title: "Rescue Saved Through Christian Love",
            slug: 'rescue-saved-through-christian-love',
            excerpt: 'The story of a rescue dog finding salvation through Christian love and care.',
            seoDescription: 'Read about a rescue dog saved through the power of Christian love.',
        },
        {
            title: "From Destructive Collie to Faithful Companion",
            slug: 'destructive-collie-to-faithful-companion',
            excerpt: 'How faith and patience transformed a destructive collie into a faithful friend.',
            seoDescription: 'The inspiring transformation of a destructive collie through faith.',
        },
        {
            title: "A Retriever's Cancer Battle",
            slug: 'retrievers-cancer-battle',
            excerpt: 'A touching story of faith during a retriever\'s battle with cancer.',
            seoDescription: 'Read about a family\'s faith journey during their retriever\'s cancer battle.',
        },
        {
            title: "German Shepherd's Journey to Peace",
            slug: 'german-shepherds-journey-to-peace',
            excerpt: 'How a German Shepherd found peace through faith-based training.',
            seoDescription: 'A German Shepherd\'s inspiring journey to peace through faith.',
        },
        {
            title: "Beagle's Spiritual Awakening",
            slug: 'beagles-spiritual-awakening',
            excerpt: 'A beagle\'s journey that led to a family\'s spiritual awakening.',
            seoDescription: 'The story of a beagle that sparked a family\'s spiritual awakening.',
        },
        {
            title: "Labrador's Gift of Comfort",
            slug: 'labradors-gift-of-comfort',
            excerpt: 'How a Labrador brought comfort and faith during difficult times.',
            seoDescription: 'Read about a Labrador who brought comfort through faith.',
        },
        {
            title: "Husky's Path to Redemption",
            slug: 'huskys-path-to-redemption',
            excerpt: 'A husky\'s path to redemption through Christian love and patience.',
            seoDescription: 'The inspiring story of a husky\'s redemption through faith.',
        },
    ];

    const storyRefs = [];

    for (const story of STORIES) {
        const storyDoc = {
            _type: 'story',
            title: story.title,
            slug: { _type: 'slug', current: story.slug },
            excerpt: story.excerpt,
            seoDescription: story.seoDescription,
            content: [
                {
                    _type: 'block',
                    _key: 'placeholder',
                    style: 'normal',
                    children: [
                        {
                            _type: 'span',
                            _key: 'placeholder-span',
                            text: `[Content for "${story.title}" to be added]`,
                            marks: [],
                        },
                    ],
                    markDefs: [],
                },
            ],
        };

        try {
            const created = await client.create(storyDoc);
            console.log(`  ✓ Created: ${story.title} (${created._id})`);
            storyRefs.push({ _type: 'reference', _ref: created._id, _key: story.slug });
        } catch (error) {
            console.error(`  ✗ Failed to create ${story.title}:`, error.message);
        }
    }

    // Step 4: Update the Success Stories page with new story references
    console.log('\n📝 Step 4: Updating Success Stories page with new stories...');

    if (page) {
        const finalModules = pageData.modules.map(module => {
            if (module._type === 'storiesGrid') {
                return { ...module, stories: storyRefs };
            }
            return module;
        });

        await client
            .patch(page._id)
            .set({ modules: finalModules })
            .commit();

        console.log(`✓ Updated page with ${storyRefs.length} stories`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Fix complete!\n');
    console.log('Next steps:');
    console.log('1. Refresh Sanity Studio to verify the stories');
    console.log('2. Upload featured images for each story');
    console.log('3. Add full content for placeholder stories');
    console.log('4. Test clicking on stories to ensure they load correctly');
}

fixStoryTypes().catch(console.error);
