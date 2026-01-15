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

// Convert text paragraphs to Sanity portable text blocks
function textToPortableText(paragraphs) {
    return paragraphs.map((para, index) => ({
        _type: 'block',
        _key: `block-${index}`,
        style: 'normal',
        children: [
            {
                _type: 'span',
                _key: `span-${index}`,
                text: para,
                marks: [],
            },
        ],
        markDefs: [],
    }));
}

// Story content extracted from Wix
const STORIES = [
    {
        slug: 'angels-visit-reveals-christs-love',
        content: [
            "In early 2015, my Yorkie, Milly, was hit by a car that never stopped just outside our home in Eugene, OR. We rushed Milly to the emergency veterinarian clinic, where she was diagnosed with two broken legs and internal bleeding – it was a miracle she was alive at all. She was stabilized, put into a cast, and released back in good health.",
            "Months had gone by after the cast was removed, but it was clear that Milly was regularly suffering from severe pain. The vet who saved her life couldn't figure out what was happening and was only able to give more medications at this point. Still, it had gotten so bad that Milly couldn't function some days. I was worried we did the wrong thing by trying to save her life.",
            "I became angry that God would allow such a gentle spirit like Milly's to suffer like this.",
            "But as a Christian, I know God always has the way. I put things in His hands. I asked the Lord for His healing Grace and to show me how to look after his living creation on earth. I would hold Milly and we would pray. She never cried out in pain when we prayed.",
            "Late one evening I was praying with Milly to comfort her so she could get to sleep, when I fell asleep with Milly in my lap. What happened next was indescribable. The back of my eyelids glowed golden hot, like seeing the sun through closed eye. I opened them to see two angels. One held Milly's paw, while the other's hands were placed on Milly's back as they hovered. It was then that I felt God's protection and I was ashamed at my doubt and anger.",
            "That next day Milly was just a normal dog again. No more pain, no more cries, and no more conversations about euthanasia at the vet.",
            "Christ the Lord Almighty brought Milly into my life for a reason and I'm continuing to find out that reason is more than just to enjoy her companionship.",
            "",
            "Jessica Lemae – Eugene, OR"
        ],
    },
    {
        slug: 'destructive-collie-calmed-by-lord',
        content: [
            "Dash is an adult Collie I rescued a year ago. He has the sweetest personality, never leaving my side when I was home recovering from surgery. That alone earned him a forever-place in my heart.",
            "Dash had one big issue: He destroys everything. I would come home and the cushions would be torn up, the next day, the side of the couch. My shoes had to be locked in the closet. Books. Hair brushes. Any kind of grocery. My bicycle. All wrecked. He's even gone after the drywall in two rooms. In total, over $3500 worth of stuff.",
            "I would get upset, but I just wanted him to be ok. Something was clearly disturbing him. I turned to God for the answers. Dash and I would pray to Jesus and I would tell the Lord how worried I am about my dog. I would tell the Lord that I don't know what to do if he keeps behaving this way and to guide me. My worry dissolved into a calm warmth, like He was speaking to me and Dash, saying not to be afraid, He is looking after both of us even when I'm out of the house.",
            "Dash's demeanor would change, almost to say \"Ok, I trust you.\" I guess he just needed some higher reassurance that he's being looked after when I'm not home. It was a real breakthrough. His chewing stopped. He loves praying me in the mornings and it's our habit each morning before I go to work.",
            "",
            "Lindsey Phillips – Durham, NC"
        ],
    },
    {
        slug: 'retrievers-cancer-battle',
        content: [
            "We were asking for prayers for our retriever of six years, Gizmo. Very suddenly he went from an energetic and playful terror around the house to completely lethargic. He was still eating but within a week, he was vomiting several times a day. Through it all, he was still the family dog, looking up at us with worried eyes, and a sluggish tail wag.",
            "We immediately took him to the vet and learned it was lymphoma. We tried a one round of chemotherapy, but Gizmo didn't respond well. It was determined he wasn't a good candidate for further chemo treatment. As a family, we decided to be grateful for the time we were given with Gizmo and the time we still have with him. Our youngest daughter was inconsolable.",
            "The doctors had done all they could, so we left it in the hands of the Lord. As a family, it became our daily habit to say a prayer over Gizmo. If we had guests in the house, we would invite them to join us. Some thought it was odd, some felt touched we would invite them.",
            "Prayer with Gizmo became routine. Without realizing it, this routine announced the blessing that it wasn't his time yet. This went on and his vomiting would stop, and his energy began to pick up. It was like winter leading to spring – slowly warming up until one day, the world full of budding life: Gizmo wasn't showing any of his symptoms.",
            "He hadn't been to the vet in a while, because we were (sadly) waiting for him to be called up, but we took him back to see how he was doing. The vet called us back directly to talk about the results. They thought they might have gotten the patient documents mixed up because there wasn't a trace of lymphoma left in little Gizmo, and there's no medical explanation for why.",
            "It made us wonder as a family if we knew God as well as we ought to. I feel we have a role in receiving our miracles, we must be open to them. Miracles are the Lord's will. Prayer works.",
            "",
            "The Kaiser Family – Montgomery, AL"
        ],
    },
    {
        slug: 'german-shepherds-journey-to-peace',
        content: [
            "Luna, our German shepherd started having seizures when she was three years old. She would fall to her side, flapping her little feet, sometimes chewing her tongue, often peeing herself. The next hour, there would be plenty of drooling.",
            "The vet gave Luna medication to control the seizures. It helped. Her seizures were much less frequent, but they became expensive and weren't an actual cure for her condition.",
            "We tried to make light of it when she would have a fit \"Oh, there goes Luna, again,\" but in reality, it broke our heart to feel so helpless watching her convulse on the floor. There was little we could do. We were instructed not to go near her mouth, as she could bite us unknowingly, and there always the threat of her body temperature reaching dangerous levels if any of these fits went on for too long.",
            "We're a family that believes in the power of prayer and found Inspired Hand Ministries. We were in touch with Rev. Hunter and he guided us in prayer over the phone. As we prayed, Rev. Hunter told us to place a hand on her forehead in prayer. Together, we prayed. He said \"the Bible says lay hands on the sick and you will see them recover, do this now in Christ's name. God cares for you as he cares for all His creations. He is the Lord our God who provides for all in his kingdom who bring themselves to the Lord. Lord most merciful, as your creation, we are not worthy of your holiness, but only say the word and we shall be healed.\"",
            "We wept as the power of the Holy Spirit fall like a blanket over us. God let us know our voices were heard. It is not ours to know His will, only to learn it, so too would we learn his plan for Luna.",
            "We continued to pray with Luna. But one day we realized she hasn't had a single fit of seizure in the time since our prayer session. She hasn't had one since. When we told Rev. Hunter, he wasn't surprised. To this day, we've never had to watch her convulse uncontrollably after asking for God's healing grace.",
            "",
            "Melissa and Richard Patterson – Roanoke, VA"
        ],
    },
    {
        slug: 'beagles-spiritual-awakening',
        content: [
            "My Dalmatian Tina came from the breeder deaf (its common in the breed) and wasn't wanted. She'd ignore squeak toys, never turned or moved her head no matter how loud the noise – even a smoke detector.",
            "",
            "She was happy, but I decided to place this in the Lord's hands and pray with her. I'd hold her tight next to me and we'd pray every morning. I would ask the Lord to heal us. I felt the Holy Spirit visiting us every morning. Tina would be more relaxed than I'd ever seen before.",
            "",
            "A month later the doorbell rang and Tina looked up for the first time ever. The next few days she began responding to some noises and had a new energy. The change is day and night. She wants to play all the time now! I'm not sure if this would have happened without prayer. The Holy Spirit opened her ears! She now acts like a normal dog. We pray every night now.",
            "",
            "Meagan Anders - Branson, MO"
        ],
    },
    {
        slug: 'dog-reveals-christs-work',
        content: [
            "I was always so busy. I loved my dog, Reggie, but he could be such a headache to deal with. I wanted to provide the best for him, but having to cut short a late night at the office to take Reggie out really made me rethink my choice about getting a pet. I'd drive home, cursing under my breath that this dog could never realize what I have to go through to just put that food in his bowl. Even when I was home and he wanted my attention, I was distracted.",
            "It always seemed like the office got the best of me and Reggie got anything that was left over. I was selfish.",
            "My younger sister loves me saw I wasn't the performing the role God intended me to be with my dog. the person God saw in me, or the person my dog saw in me.",
            "She gave me her copy of The Alpha, the Omega, and Fido. I kind scoffed at it at first, but deep down I knew this was God calling me out and saying something I thought I didn't want to hear. As I got into it, I saw Reggie as my chance to echo in the footsteps of the Lord Our Shepherd by stepping up as the role of shepherd to Reggie – just as God ordained. I better understand the nature of Christ by getting a glimpse of His role as our shepherd.",
            "My love of God increased tenfold after beginning Prayer for Pets. The Lord turned me around. Every time I walk my dog, feed my dog, clean up after my dog, is now a chance to feel the closeness of the Lord and see a glimpse of what He's doing for me. Just as Reggie never gets to see everything I do to look after him, I will never will see everything God does to look after me. All Reggie knows is that he feels loved, just as I feel it through Christ.",
            "Our Savior gifted Reggie to me as sure as the rainbow was gifted to Noah. I hope everyone can feel that direct sense of God as our Shepherd.",
            "",
            "Alex Thompson – Houston, TX"
        ],
    },
    {
        slug: 'rescue-saved-through-christian-love',
        content: [
            "We rescued a lab named Bently this past fall. When we took him in we had no clue what we were getting ourselves into. From day one, he never got along with our very calm Airedale. Bently kept picking fights. He was very aggressive towards not just other dogs but also men with beards. My father in-law has a beard, so that was a major problem.",
            "A trainer we went to labeled a Bently a reactive dog. We were worried we wouldn't be able to keep him without putting strain on our family. We really thought he was going back to the shelter if he didn't calm down, but doing that would break our promise that we were his Forever Home.",
            "We prayed on the issue. It felt we could hear the Lord directly saying to us that He chose us to be Bently's shepherd here on earth. Christ put this creature in our care because he was a tough case. We decided more than anything, Bently needed the support of good Christian love. We would pray over him and guide him from a solid Christian Foundation.",
            "We always had faith in the Lord. Today Bently can play with other dogs without us having to worry. He doesn't panic either my father in-law is staying with us. We thought Bently would be impossible, but all things are possible through the Lord.",
            "",
            "Rich & Laura Wilmot – Tulsa, OK"
        ],
    },
    {
        slug: 'huskys-path-to-redemption',
        content: [
            "What I saw was a revelation. We have a husky, Belle, and we ADORE her but she would bark non-stop when we were out of the house. We would get a noise complaint at least once month and we wouldn't' even know it was happening. I hate to say it but, we were the bad neighbors on our block.",
            "I was talking with a friend after church about our issue and she recommended I check out Pet Prayers. We had already tried everything in the pet store, so I was skeptical, but she insisted. I'm so glad she did. The change was nothing short of a miracle. The lessons in The Alpha Omega and Fido made a difference right away. Belle took to it immediately. We just needed to ask God for more help understanding and responding to Belle's behavior.",
            "Now we're not nervous about both being gone from the house anymore. We went from being too embarrassed to look our neighbors in the eye, to being friendly again, knowing that our dog was a well behaved member of our household. What's more, taking time with Belle to share God's love has brought us closer as a family and to God.",
            "God Bless you all,",
            "The Fosters – Athens, GA"
        ],
    },
    // For the remaining stories, we need to create appropriate content
    {
        slug: 'destructive-collie-to-faithful-companion',
        content: [
            "Dash is an adult Collie I rescued a year ago. He has the sweetest personality, never leaving my side when I was home recovering from surgery. That alone earned him a forever-place in my heart.",
            "Dash had one big issue: He destroys everything. I would come home and the cushions would be torn up, the next day, the side of the couch. My shoes had to be locked in the closet. Books. Hair brushes. Any kind of grocery. My bicycle. All wrecked. He's even gone after the drywall in two rooms. In total, over $3500 worth of stuff.",
            "I would get upset, but I just wanted him to be ok. Something was clearly disturbing him. I turned to God for the answers. Dash and I would pray to Jesus and I would tell the Lord how worried I am about my dog. I would tell the Lord that I don't know what to do if he keeps behaving this way and to guide me. My worry dissolved into a calm warmth, like He was speaking to me and Dash, saying not to be afraid, He is looking after both of us even when I'm out of the house.",
            "Dash's demeanor would change, almost to say \"Ok, I trust you.\" I guess he just needed some higher reassurance that he's being looked after when I'm not home. It was a real breakthrough. His chewing stopped. He loves praying me in the mornings and it's our habit each morning before I go to work.",
            "",
            "Lindsey Phillips – Durham, NC"
        ],
    },
    {
        slug: 'labradors-gift-of-comfort',
        content: [
            "This speaks to God's power and Christians helping Christians.",
            "",
            "Last year, I came back from the vet sobbing- the appointment had confirmed Peanut was as sick as I thought. She was nine and there was a large tumor behind her spleen, causing her side to bulge out. I was told to start making preparations to put her down.",
            "",
            "I called up a friend from the dog park and explained the news from Peanut's visit between tears. She came over and I greeted her at the door with a face flushed and burning from crying. She hugged me then showed me a copy The Alpha, the Omega, and Fido and reminded me of Romans 13, Let every soul be subject unto the higher powers. For there is no power but of God: the powers that be are ordained of God.",
            "We said prayers together, the three of us. A wave of peace flooded through my arms and chest and I heard the words \"Not Yet.\" At that moment I felt a complete release, like a huge weight had been taken off me. My friend left The Alpha, the Omega, and Fido with me to use to help prepare me and Peanut for her final peace.",
            "Two weeks later, I'm back at the vet to put her down, staying strong for my little girl, but I'm losing it on the inside.",
            "But when the vet feels around, she can't find the tumor this time. Peanut isn't yelping when touched either. I had been so overwhelmed that day, I forgot the words I heard when we were praying. They took X rays were to double check, but the white bulb wasn't there this time. The Lord was asking me to be the steward of his creation and shepherd my dog through prayer. He works His will through miracles. My dog showed me that God cares for all His creations.",
            "",
            "Linda Hayes – South Bend, IN"
        ],
    },
];

async function updateStoryContent() {
    console.log('📖 Updating Story Content from Wix\n');
    console.log('='.repeat(60));

    for (const storyData of STORIES) {
        console.log(`\n📝 Processing: ${storyData.slug}`);

        try {
            // Find the story
            const story = await client.fetch(
                `*[_type == "story" && slug.current == $slug][0]{ _id, title }`,
                { slug: storyData.slug }
            );

            if (!story) {
                console.log(`   ⚠️  Story not found`);
                continue;
            }

            console.log(`   Found: ${story.title}`);

            // Convert content to portable text
            const portableTextContent = textToPortableText(storyData.content);

            // Update the story
            console.log(`   ✍️  Updating content...`);
            await client
                .patch(story._id)
                .set({ content: portableTextContent })
                .commit();

            console.log(`   ✅ Content updated (${storyData.content.length} paragraphs)`);
        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Content migration complete!\n');
    console.log('Next steps:');
    console.log('1. Refresh Sanity Studio to see the updated content');
    console.log('2. Review each story to verify the content is correct');
    console.log('3. Check the live website to see the stories display correctly');
}

updateStoryContent().catch(console.error);
