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

// The 9 success stories from the Wix site
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

// The 10 quote sections from the Wix site
const QUOTES = [
    {
        _key: 'quote1',
        quote: 'I firmly recommend to anyone interested in developing an intimacy between the animals God put in their care and the Lord. There is a great deal of useful lessons and excellent advice found in its clear, straightforward approach. God Bless.',
        authorName: 'Theresa',
        bookTitle: 'Inspired Hand',
        role: 'reader',
        style: 'default',
    },
    {
        _key: 'quote2',
        quote: "Dear Rev Hunter, I would like to thank you for your work and for making this knowledge available. My relationship with the Lord and my dogs has changed forever. My friends have noticed too - I've given away two copies as gifts.",
        authorName: 'James',
        bookTitle: 'Inspired Hand',
        role: 'reader',
        style: 'default',
    },
    {
        _key: 'quote3',
        quote: "This is an inspiration to people who want to make a change in their pet's lives. After following your advice, I now know what the Lord wants from me.",
        authorName: 'Jeff',
        bookTitle: 'Inspired Hand',
        role: 'reader',
        style: 'default',
    },
    {
        _key: 'quote4',
        quote: "We have used The Alpha, The Omega, And Fido extensively with our pit-bull mix. Every issue that came up, TATOAF directed us to solid biblical wisdom on how to best deal with it. This has completely changed how we deal with our dog and how she sees us. We don't have her obedience out of fear - we have it out of love.",
        authorName: 'Mark',
        bookTitle: 'Inspired Hand',
        role: 'reader',
        style: 'default',
    },
    {
        _key: 'quote5',
        quote: "By using The Alpha, The Omega, And Fido I've never felt the love of God more radiantly than when I'm at prayer with my pet. The Alpha, The Omega, And Fido has shown me how. I am truly amazed.",
        authorName: 'Rebecca',
        bookTitle: 'Inspired Hand',
        role: 'reader',
        style: 'default',
    },
    {
        _key: 'quote6',
        quote: 'The biggest tool I\'ve used to help me build routine has been The Alpha, the Omega, and Fido.',
        authorName: 'Elena',
        bookTitle: 'Inspired Hand',
        role: 'reader',
        style: 'default',
    },
    {
        _key: 'quote7',
        quote: 'I always take time in the morning to journal because I feel empowered to set up my day—to choose who I want to be and create the mindset that will carry me through.',
        authorName: 'Natalie',
        bookTitle: 'Inspired Hand',
        role: 'reader',
        style: 'default',
    },
    {
        _key: 'quote8',
        quote: "This journal has helped me focus and re-focus on what's important in my life and my day...and continually helps me remain in a place of gratitude.",
        authorName: 'Josh',
        bookTitle: 'Inspired Hand',
        role: 'reader',
        style: 'default',
    },
    {
        _key: 'quote9',
        quote: "I've learned to see joy in the littlest things, and actually enjoy looking back at my day and writing about how it went each night.",
        authorName: 'Geri',
        bookTitle: 'Inspired Hand',
        role: 'reader',
        style: 'default',
    },
    {
        _key: 'quote10',
        quote: 'My whole week/day has been revamped as a bi-product of the journal.',
        authorName: 'Dan',
        bookTitle: 'Inspired Hand',
        role: 'reader',
        style: 'default',
    },
];

async function ensureAllStoriesExist() {
    console.log('📚 Checking for existing stories...');

    const existingStories = await client.fetch(`*[_type == "story"]{ _id, slug }`); const existingSlugs = new Set(existingStories.map(s => s.slug?.current));

    console.log(`Found ${existingStories.length} existing stories`);

    const storyRefs = [];

    for (const story of STORIES) {
        if (existingSlugs.has(story.slug)) {
            const existing = existingStories.find(s => s.slug?.current === story.slug);
            console.log(`✓ Story exists: ${story.title}`);
            storyRefs.push({ _type: 'reference', _ref: existing._id, _key: story.slug });
        } else {
            console.log(`Creating story: ${story.title}`);
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
                console.log(`✓ Created story: ${story.title} (${created._id})`);
                storyRefs.push({ _type: 'reference', _ref: created._id, _key: story.slug });
            } catch (error) {
                console.error(`✗ Failed to create story: ${story.title}`, error.message);
            }
        }
    }

    return storyRefs;
}

async function updateSuccessStoriesPage(storyRefs) {
    console.log('\n📄 Updating Success Stories page...');

    // Find the success stories page
    const page = await client.fetch(`*[_type == "page" && slug.current == "success-stories"][0]{ _id, modules }`);

    if (!page) {
        console.error('✗ Success Stories page not found!');
        return;
    }

    console.log(`Found page: ${page._id}`);

    // Build the new modules array
    const modules = [
        // Hero Section
        {
            _type: 'hero',
            _key: 'hero-success-stories',
            heading: 'Success Stories',
            subheading: 'Real stories from pet owners whose lives have been transformed through faith-based pet care.',
            style: 'default',
        },
        // Stories Grid
        {
            _type: 'storiesGrid',
            _key: 'stories-grid',
            title: 'Our Success Stories',
            stories: storyRefs,
        },
        // Reviews header
        {
            _type: 'richTextSection',
            _key: 'reviews-header',
            content: [
                {
                    _type: 'block',
                    _key: 'reviews-heading',
                    style: 'h2',
                    children: [
                        {
                            _type: 'span',
                            _key: 'reviews-span',
                            text: 'What Our Readers Say',
                            marks: [],
                        },
                    ],
                    markDefs: [],
                },
            ],
            alignment: 'center',
        },
        // Quote sections
        ...QUOTES.map(quote => ({
            _type: 'quoteSection',
            ...quote,
        })),
        // Read more section
        {
            _type: 'richTextSection',
            _key: 'read-more',
            content: [
                {
                    _type: 'block',
                    _key: 'read-more-block',
                    style: 'normal',
                    children: [
                        {
                            _type: 'span',
                            _key: 'read-more-span',
                            text: 'Want to share your own success story? Contact us and let us know how faith-based pet care has impacted your life.',
                            marks: [],
                        },
                    ],
                    markDefs: [],
                },
            ],
            alignment: 'center',
        },
    ];

    try {
        await client
            .patch(page._id)
            .set({ modules })
            .commit();

        console.log('✓ Success Stories page updated successfully!');
        console.log(`  - Hero section`);
        console.log(`  - Stories grid with ${storyRefs.length} stories`);
        console.log(`  - ${QUOTES.length} quote sections`);
        console.log(`  - Read more section`);
    } catch (error) {
        console.error('✗ Failed to update page:', error.message);
    }
}

async function main() {
    console.log('🔧 Fix Success Stories Content Script\n');
    console.log('='.repeat(50));

    // Step 1: Ensure all 9 stories exist
    const storyRefs = await ensureAllStoriesExist();

    // Step 2: Update the success stories page
    await updateSuccessStoriesPage(storyRefs);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Script complete!');
    console.log('\nNext steps:');
    console.log('1. Open Sanity Studio and verify the Success Stories page');
    console.log('2. Upload images for stories that are missing them');
    console.log('3. Add full content for stories with placeholder text');
    console.log('4. Refresh your website to see the changes');
}

main().catch(console.error);
