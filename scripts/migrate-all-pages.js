/**
 * Comprehensive Wix to Sanity Page Migrator
 *
 * Extracts content from all Wix pages and imports them to Sanity
 * with proper module structure, images, and formatting.
 *
 * Usage: node scripts/migrate-all-pages.js
 */

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// =============================================================================
// Configuration
// =============================================================================

const CONFIG = {
    wixBaseUrl: "https://inspiredhandproduc.wixsite.com/paws1",
    sanity: {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pfg8me86",
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
        apiVersion: "2024-01-01",
        token:
            process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN || "",
    },
    outputDir: path.join(__dirname, "../output"),
    assetCachePath: path.join(__dirname, "../output/asset-cache.json"),
};

// Pages to migrate with their known structure
const PAGES_CONFIG = [
    {
        name: "home",
        path: "",
        title: "Inspired Hand Ministries",
    },
    {
        name: "mission",
        path: "/mission",
        title: "Our Mission",
    },
    {
        name: "resources",
        path: "/resources",
        title: "Resources",
    },
    {
        name: "success-stories",
        path: "/success-stories",
        title: "Success Stories",
    },
    {
        name: "support-us",
        path: "/support-us",
        title: "Support Us",
    },
    {
        name: "contact",
        path: "/contact",
        title: "Contact Us",
    },
    {
        name: "prayer-chain",
        path: "/prayer-chain",
        title: "Prayer Chain",
    },
];

// Asset cache
let assetCache = {};

// =============================================================================
// Utility Functions
// =============================================================================

function loadEnv() {
    const envPaths = [
        path.join(__dirname, "../.env"),
        path.join(__dirname, "../.env.local"),
    ];

    for (const envPath of envPaths) {
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, "utf-8");
            content.split("\n").forEach((line) => {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith("#")) return;
                const eqIndex = trimmed.indexOf("=");
                if (eqIndex > 0) {
                    const key = trimmed.substring(0, eqIndex).trim();
                    const value = trimmed
                        .substring(eqIndex + 1)
                        .trim()
                        .replace(/^["']|["']$/g, "");
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
            console.log(`📦 Loaded env from ${envPath}`);
            break;
        }
    }
}

function generateKey() {
    return crypto.randomBytes(6).toString("hex");
}

function generateDocId(type, slug) {
    const normalized = slug.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    return `${type}-${normalized || "home"}`;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// HTTP Functions
// =============================================================================

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith("https") ? https : http;

        const request = protocol.get(url, (res) => {
            if (
                res.statusCode >= 300 &&
                res.statusCode < 400 &&
                res.headers.location
            ) {
                let redirectUrl = res.headers.location;
                if (redirectUrl.startsWith("/")) {
                    const urlObj = new URL(url);
                    redirectUrl = `${urlObj.protocol}//${urlObj.host}${redirectUrl}`;
                }
                return fetchUrl(redirectUrl).then(resolve).catch(reject);
            }

            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode}: ${url}`));
                return;
            }

            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve(data));
        });

        request.on("error", reject);
        request.setTimeout(30000, () => {
            request.destroy();
            reject(new Error("Request timeout"));
        });
    });
}

function downloadImage(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith("https") ? https : http;

        const request = protocol.get(url, (res) => {
            if (
                res.statusCode >= 300 &&
                res.statusCode < 400 &&
                res.headers.location
            ) {
                return downloadImage(res.headers.location).then(resolve).catch(reject);
            }

            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download: ${res.statusCode}`));
                return;
            }

            const chunks = [];
            res.on("data", (chunk) => chunks.push(chunk));
            res.on("end", () => {
                const buffer = Buffer.concat(chunks);
                const contentType = res.headers["content-type"] || "image/jpeg";
                resolve({ buffer, contentType });
            });
        });

        request.on("error", reject);
        request.setTimeout(30000, () => {
            request.destroy();
            reject(new Error("Request timeout"));
        });
    });
}

// =============================================================================
// Asset Cache Functions
// =============================================================================

function loadAssetCache() {
    if (fs.existsSync(CONFIG.assetCachePath)) {
        try {
            assetCache = JSON.parse(fs.readFileSync(CONFIG.assetCachePath, "utf-8"));
            console.log(`📦 Loaded ${Object.keys(assetCache).length} cached assets`);
        } catch (e) {
            assetCache = {};
        }
    }
}

function saveAssetCache() {
    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }
    fs.writeFileSync(CONFIG.assetCachePath, JSON.stringify(assetCache, null, 2));
}

// =============================================================================
// Sanity API Functions
// =============================================================================

async function uploadImageToSanity(imageUrl) {
    // Normalize URL
    let cleanUrl = imageUrl;
    const v1FillIndex = cleanUrl.indexOf("/v1/fill");
    if (v1FillIndex > -1) cleanUrl = cleanUrl.substring(0, v1FillIndex);
    const v1CropIndex = cleanUrl.indexOf("/v1/crop");
    if (v1CropIndex > -1) cleanUrl = cleanUrl.substring(0, v1CropIndex);

    // Check cache
    if (assetCache[cleanUrl]) {
        return assetCache[cleanUrl];
    }

    try {
        console.log(`    📤 Uploading: ${cleanUrl.substring(0, 60)}...`);

        const { buffer, contentType } = await downloadImage(cleanUrl);

        const extMap = {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/gif": "gif",
            "image/webp": "webp",
            "image/svg+xml": "svg",
        };
        const ext = extMap[contentType] || "jpg";
        const filename = `image-${Date.now()}.${ext}`;

        const uploadUrl = `https://${CONFIG.sanity.projectId}.api.sanity.io/v${CONFIG.sanity.apiVersion}/assets/images/${CONFIG.sanity.dataset}?filename=${filename}`;

        const result = await new Promise((resolve, reject) => {
            const req = https.request(
                uploadUrl,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": contentType,
                        "Content-Length": buffer.length,
                        Authorization: `Bearer ${CONFIG.sanity.token}`,
                    },
                },
                (res) => {
                    let data = "";
                    res.on("data", (chunk) => (data += chunk));
                    res.on("end", () => {
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            try {
                                resolve(JSON.parse(data));
                            } catch (e) {
                                reject(new Error(`Failed to parse response: ${data}`));
                            }
                        } else {
                            reject(new Error(`Upload failed (${res.statusCode}): ${data}`));
                        }
                    });
                },
            );

            req.on("error", reject);
            req.write(buffer);
            req.end();
        });

        const assetRef = result.document._id;
        assetCache[cleanUrl] = assetRef;
        saveAssetCache();

        console.log(`    ✅ Uploaded: ${assetRef}`);
        return assetRef;
    } catch (error) {
        console.error(`    ❌ Failed: ${error.message}`);
        return null;
    }
}

async function createOrReplaceDocument(doc) {
    const url = `https://${CONFIG.sanity.projectId}.api.sanity.io/v${CONFIG.sanity.apiVersion}/data/mutate/${CONFIG.sanity.dataset}`;

    const mutations = [{ createOrReplace: doc }];

    return new Promise((resolve, reject) => {
        const body = JSON.stringify({ mutations });

        const req = https.request(
            url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(body),
                    Authorization: `Bearer ${CONFIG.sanity.token}`,
                },
            },
            (res) => {
                let data = "";
                res.on("data", (chunk) => (data += chunk));
                res.on("end", () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(JSON.parse(data));
                    } else {
                        reject(new Error(`Mutation failed (${res.statusCode}): ${data}`));
                    }
                });
            },
        );

        req.on("error", reject);
        req.write(body);
        req.end();
    });
}

// =============================================================================
// Content Extraction Functions
// =============================================================================

function cleanHtmlText(html) {
    if (!html || typeof html !== "string") return "";

    let cleaned = html.replace(/<[^>]+>/g, " ");

    cleaned = cleaned
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .replace(/&mdash;/g, "—")
        .replace(/&ndash;/g, "–")
        .replace(/&copy;/g, "©")
        .replace(/\s+/g, " ")
        .trim();

    return cleaned;
}

function extractTextsFromHtml(html) {
    const texts = [];
    const seen = new Set();

    // Extract from various patterns
    const patterns = [
        // Headings
        /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi,
        // Paragraphs with Wix classes
        /<p[^>]*class="[^"]*font_[^"]*"[^>]*>([\s\S]*?)<\/p>/gi,
        // Rich text elements
        /<div[^>]*data-testid="richTextElement"[^>]*>([\s\S]*?)<\/div>/gi,
        // Spans with text
        /<span[^>]*>([\s\S]*?)<\/span>/gi,
    ];

    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
            const cleaned = cleanHtmlText(match[1]);
            if (cleaned && cleaned.length > 2 && !seen.has(cleaned)) {
                seen.add(cleaned);
                texts.push(cleaned);
            }
        }
    }

    return texts;
}

function extractImagesFromHtml(html) {
    const images = [];
    const seen = new Set();

    // Image patterns
    const patterns = [
        /<img[^>]*src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/gi,
        /background-image:\s*url\(["']?([^"')]+)["']?\)/gi,
        /data-(?:src|image|bg)="([^"]+)"/gi,
    ];

    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
            let url = match[1];

            // Convert Wix URLs
            if (url && url.includes("wixstatic.com")) {
                // Normalize URL
                if (!url.startsWith("http")) {
                    url = "https:" + url;
                }

                if (!seen.has(url)) {
                    seen.add(url);
                    images.push({
                        url: url,
                        alt: match[2] || "",
                    });
                }
            }
        }
    }

    return images;
}

function extractPageMetadata(html) {
    const metadata = {
        title: "",
        description: "",
        ogImage: "",
    };

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
        metadata.title = titleMatch[1]
            .replace(" | Paws1", "")
            .replace(" | Inspired Hand", "")
            .trim();
    }

    const descMatch = html.match(
        /<meta[^>]*name="description"[^>]*content="([^"]+)"/i,
    );
    if (descMatch) {
        metadata.description = descMatch[1];
    }

    const ogMatch = html.match(
        /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i,
    );
    if (ogMatch) {
        metadata.ogImage = ogMatch[1];
    }

    return metadata;
}

// =============================================================================
// Content to Portable Text Conversion
// =============================================================================

function toPortableText(text) {
    if (!text || typeof text !== "string") return [];

    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());

    return paragraphs.map((para) => ({
        _type: "block",
        _key: generateKey(),
        style: "normal",
        markDefs: [],
        children: [
            {
                _type: "span",
                _key: generateKey(),
                text: para.trim(),
                marks: [],
            },
        ],
    }));
}

// =============================================================================
// Module Creation Functions
// =============================================================================

async function createImageRef(imageUrl, alt = "") {
    if (!imageUrl) return null;

    const assetRef = await uploadImageToSanity(imageUrl);
    if (!assetRef) return null;

    return {
        _type: "image",
        alt: alt || "",
        asset: {
            _type: "reference",
            _ref: assetRef,
        },
    };
}

async function createHeroModule(texts, images, pageTitle) {
    const heading =
        texts.find((t) => t.length < 50 && !t.includes(".")) ||
        pageTitle ||
        "Welcome";
    const subheading =
        texts.find((t) => t.length > 30 && t.length < 150 && t !== heading) || "";

    const heroImage = images[0] || null;

    const module = {
        _type: "hero",
        _key: generateKey(),
        heading: heading,
        subheading: subheading,
        cta: {
            label: "Learn More",
            link: "/mission",
        },
    };

    if (heroImage) {
        module.backgroundImage = await createImageRef(
            heroImage.url,
            heroImage.alt || heading,
        );
    }

    return module;
}

async function createRichTextModule(texts, heading = null) {
    const content = texts.filter((t) => t.length > 20).slice(0, 5);

    return {
        _type: "richTextSection",
        _key: generateKey(),
        heading: heading,
        content: content.flatMap((t) => toPortableText(t)),
    };
}

async function createTwoColumnModule(texts, images, heading = null) {
    const contentTexts = texts.filter((t) => t.length > 30).slice(0, 3);
    const image = images[0] || null;

    const module = {
        _type: "twoColumnSection",
        _key: generateKey(),
        layout: "image-right",
        heading:
            heading || texts.find((t) => t.length < 50 && !t.includes(".")) || null,
        content: contentTexts.flatMap((t) => toPortableText(t)),
        cta: null,
    };

    if (image) {
        module.image = await createImageRef(image.url, image.alt);
    }

    return module;
}

async function createQuoteModule(texts) {
    // Find quote-like text
    const quoteText =
        texts.find(
            (t) =>
                t.startsWith('"') ||
                t.includes("...") ||
                /\d+:\d+/.test(t) ||
                (t.toLowerCase().includes("god") && t.length < 150),
        ) ||
        texts[0] ||
        "";

    // Extract quote and attribution
    let quote = quoteText.replace(/^[""]|[""]$/g, "").trim();
    let attribution = null;

    // Look for Bible verse pattern
    const verseMatch = texts.find((t) => /^\d*\s*[A-Za-z]+\s+\d+:\d+/.test(t));
    if (verseMatch) {
        attribution = verseMatch;
    }

    return {
        _type: "quoteSection",
        _key: generateKey(),
        quote: quote,
        attribution: attribution,
        source: null,
        style: "default",
    };
}

async function createFormModule(
    formType = "contact",
    heading = null,
    description = null,
) {
    const formConfigs = {
        contact: {
            heading: heading || "Contact Us",
            description: description || "We would love to hear from you.",
            formType: "contact",
            fields: [
                {
                    _key: generateKey(),
                    name: "name",
                    label: "Your Name",
                    type: "text",
                    required: true,
                },
                {
                    _key: generateKey(),
                    name: "email",
                    label: "Email Address",
                    type: "email",
                    required: true,
                },
                {
                    _key: generateKey(),
                    name: "message",
                    label: "Message",
                    type: "textarea",
                    required: true,
                },
            ],
            submitLabel: "Send Message",
            successMessage:
                "Thank you for your message! We will get back to you soon.",
        },
        newsletter: {
            heading: heading || "Subscribe to Our Newsletter",
            description:
                description || "Stay updated with our latest news and devotionals.",
            formType: "newsletter",
            fields: [
                {
                    _key: generateKey(),
                    name: "email",
                    label: "Email Address",
                    type: "email",
                    required: true,
                },
                {
                    _key: generateKey(),
                    name: "name",
                    label: "Your Name",
                    type: "text",
                    required: false,
                },
            ],
            submitLabel: "Subscribe",
            successMessage: "Thank you for subscribing!",
        },
        "prayer-request": {
            heading: heading || "Submit a Prayer Request",
            description:
                description || "Our thoughts are with you — and all His creatures.",
            formType: "prayer-request",
            fields: [
                {
                    _key: generateKey(),
                    name: "name",
                    label: "Your Name",
                    type: "text",
                    required: true,
                },
                {
                    _key: generateKey(),
                    name: "email",
                    label: "Email Address",
                    type: "email",
                    required: true,
                },
                {
                    _key: generateKey(),
                    name: "request",
                    label: "Your Prayer Request",
                    type: "textarea",
                    required: true,
                },
            ],
            submitLabel: "Submit Prayer Request",
            successMessage:
                "Your prayer request has been received. We are praying with you.",
        },
    };

    const config = formConfigs[formType] || formConfigs["contact"];

    return {
        _type: "formSection",
        _key: generateKey(),
        ...config,
    };
}

async function createCtaModule(
    heading,
    description,
    buttonLabel,
    buttonLink,
    style = "primary",
) {
    return {
        _type: "ctaSection",
        _key: generateKey(),
        heading: heading,
        description: description,
        buttonLabel: buttonLabel,
        buttonLink: buttonLink,
        style: style,
    };
}

async function createSlideshowModule(images) {
    if (!images || images.length === 0) return null;

    const slides = [];
    for (const img of images.slice(0, 6)) {
        const imageRef = await createImageRef(img.url, img.alt);
        if (imageRef) {
            slides.push({
                _key: generateKey(),
                image: imageRef,
                heading: null,
                caption: null,
                ctaLabel: null,
                ctaLink: null,
            });
        }
    }

    if (slides.length === 0) return null;

    return {
        _type: "slideshow",
        _key: generateKey(),
        slides: slides,
        autoplay: true,
        interval: 5,
    };
}

// =============================================================================
// Page-Specific Content Builders
// =============================================================================

async function buildHomePageModules(texts, images) {
    const modules = [];

    // Hero
    modules.push(
        await createHeroModule(
            ["Inspired Hand", "Let Every Creature Hear His Calling!"],
            images.slice(0, 1),
            "Inspired Hand",
        ),
    );

    // Product/Ministry section
    const productModule = await createTwoColumnModule(
        [
            "Your dog is God's gift. Discover keys to unlock the blessings God promised all His creatures He placed in your life.",
            "Dog owners across America are using The Alpha, Omega, and Fido to inspire powerful relationships with the Lord & become a true Christian guardian of their pet.",
        ],
        images.slice(1, 2),
        "The Alpha, The Omega, And Fido",
    );
    productModule.cta = { label: "Shop Now", link: "/shop" };
    modules.push(productModule);

    // Quote
    modules.push(
        await createQuoteModule([
            '"God is light; In him there is no darkness..."',
            "1 John 1:5",
        ]),
    );

    // Our Story section
    modules.push(
        await createRichTextModule(
            [
                "God has wisdom and instruction for every part of caring for the animals He has put in our care. Our pets are God's creation and caring for His creation is God's work.",
                "If we have the fortune to find a loved pet by our side, we know the joy of being chosen to carry out God's work in looking after His creatures by the love that is returned to us by our pets.",
            ],
            "Our Story",
        ),
    );

    // Prayer Request Form
    modules.push(
        await createFormModule(
            "prayer-request",
            "Need prayer? We're here.",
            "Join our prayer chain to receive prayer and give prayer to those in need.",
        ),
    );

    // Newsletter CTA
    modules.push(
        await createCtaModule(
            "Be Inspired",
            "God has wisdom and instruction for every part of caring for the animals He has put in our care. Join our dedicated community and receive our weekly devotionals.",
            "Subscribe",
            "/newsletter",
            "primary",
        ),
    );

    // Contact CTA
    modules.push(
        await createCtaModule(
            "The Power of Faith",
            "We measure our work by lives changed. We truly want to see you and your pet grow with Christ. Questions, stories, or thoughts, we are here for you.",
            "Let's Talk",
            "/contact",
            "secondary",
        ),
    );

    return modules;
}

async function buildMissionPageModules(texts, images) {
    const modules = [];

    modules.push(
        await createHeroModule(
            ["Our Mission", "Bringing Faith to Every Creature"],
            images.slice(0, 1),
            "Our Mission",
        ),
    );

    const missionTexts = texts.filter((t) => t.length > 50);
    if (missionTexts.length > 0) {
        modules.push(await createRichTextModule(missionTexts, "What We Believe"));
    }

    // Add slideshow if enough images
    if (images.length > 2) {
        const slideshow = await createSlideshowModule(images.slice(1));
        if (slideshow) modules.push(slideshow);
    }

    modules.push(
        await createCtaModule(
            "Join Our Mission",
            "Help us spread the message of faith to pet owners everywhere.",
            "Support Us",
            "/support-us",
            "accent",
        ),
    );

    return modules;
}

async function buildResourcesPageModules(texts, images) {
    const modules = [];

    modules.push(
        await createHeroModule(
            ["Resources", "Tools for Your Faith Journey"],
            images.slice(0, 1),
            "Resources",
        ),
    );

    const resourceTexts = texts.filter((t) => t.length > 30);
    if (resourceTexts.length > 0) {
        modules.push(
            await createRichTextModule(
                resourceTexts.slice(0, 5),
                "Helpful Resources",
            ),
        );
    }

    // Create image sections
    for (let i = 1; i < Math.min(images.length, 4); i += 2) {
        const sectionTexts = resourceTexts.slice(i * 2, i * 2 + 2);
        if (sectionTexts.length > 0 || images[i]) {
            modules.push(
                await createTwoColumnModule(sectionTexts, [images[i]], null),
            );
        }
    }

    modules.push(
        await createCtaModule(
            "Need More Guidance?",
            "Contact us for personalized resources and support.",
            "Contact Us",
            "/contact",
            "primary",
        ),
    );

    return modules;
}

async function buildSuccessStoriesPageModules(texts, images) {
    const modules = [];

    modules.push(
        await createHeroModule(
            ["Success Stories", "Lives Changed Through Faith"],
            images.slice(0, 1),
            "Success Stories",
        ),
    );

    // Add story sections
    const storyTexts = texts.filter((t) => t.length > 50);
    for (let i = 0; i < Math.min(storyTexts.length, 4); i++) {
        const imgIndex = Math.min(i + 1, images.length - 1);

        if (i % 2 === 0) {
            modules.push(
                await createTwoColumnModule(
                    [storyTexts[i]],
                    images[imgIndex] ? [images[imgIndex]] : [],
                    null,
                ),
            );
        } else {
            const module = await createTwoColumnModule(
                [storyTexts[i]],
                images[imgIndex] ? [images[imgIndex]] : [],
                null,
            );
            module.layout = "image-left";
            modules.push(module);
        }
    }

    // Slideshow of remaining images
    if (images.length > 3) {
        const slideshow = await createSlideshowModule(images.slice(3));
        if (slideshow) modules.push(slideshow);
    }

    modules.push(
        await createCtaModule(
            "Share Your Story",
            "Has Inspired Hand made a difference in your life? We'd love to hear from you.",
            "Contact Us",
            "/contact",
            "accent",
        ),
    );

    return modules;
}

async function buildSupportUsPageModules(texts, images) {
    const modules = [];

    modules.push(
        await createHeroModule(
            ["Support Us", "Help Spread the Message"],
            images.slice(0, 1),
            "Support Us",
        ),
    );

    const supportTexts = texts.filter((t) => t.length > 30);
    if (supportTexts.length > 0) {
        modules.push(
            await createRichTextModule(supportTexts.slice(0, 3), "How You Can Help"),
        );
    }

    if (images.length > 1) {
        modules.push(
            await createTwoColumnModule(
                [
                    "Your generous support helps us continue our mission of bringing faith to pet owners and their beloved companions.",
                ],
                [images[1]],
                "Make a Difference",
            ),
        );
    }

    modules.push(
        await createCtaModule(
            "Donate Today",
            "Every contribution helps us reach more families and their pets with the message of faith.",
            "Donate Now",
            "/donate",
            "accent",
        ),
    );

    modules.push(
        await createFormModule(
            "contact",
            "Questions About Donating?",
            "We're happy to answer any questions you may have.",
        ),
    );

    return modules;
}

async function buildContactPageModules(texts, images) {
    const modules = [];

    modules.push(
        await createHeroModule(
            ["Contact Us", "We'd Love to Hear From You"],
            images.slice(0, 1),
            "Contact Us",
        ),
    );

    modules.push(
        await createRichTextModule(
            [
                "Whether you have questions, stories to share, or just want to connect, we're here for you.",
                "Reach out and let us know how we can help you and your pet on your faith journey.",
            ],
            "Get In Touch",
        ),
    );

    modules.push(
        await createFormModule(
            "contact",
            "Send Us a Message",
            "Fill out the form below and we'll get back to you as soon as possible.",
        ),
    );

    modules.push(
        await createCtaModule(
            "Join Our Community",
            "Subscribe to our newsletter for weekly devotionals and updates.",
            "Subscribe",
            "/newsletter",
            "secondary",
        ),
    );

    return modules;
}

async function buildPrayerChainPageModules(texts, images) {
    const modules = [];

    modules.push(
        await createHeroModule(
            ["Prayer Chain", "United in Faith"],
            images.slice(0, 1),
            "Prayer Chain",
        ),
    );

    modules.push(
        await createQuoteModule([
            '"For where two or three gather in my name, there am I with them."',
            "Matthew 18:20",
        ]),
    );

    modules.push(
        await createRichTextModule(
            [
                "Our prayer chain brings together believers from across the country, united in lifting up those in need.",
                "When you submit a prayer request, our dedicated team of volunteers commits to praying for you and your situation.",
                "You can also join us in praying for others, becoming part of a supportive community of faith.",
            ],
            "About Our Prayer Chain",
        ),
    );

    modules.push(
        await createFormModule(
            "prayer-request",
            "Submit a Prayer Request",
            "Share your prayer needs with our community. All requests are kept confidential.",
        ),
    );

    modules.push(
        await createCtaModule(
            "Join the Prayer Chain",
            "Become a prayer partner and help support others in their time of need.",
            "Learn More",
            "/contact",
            "primary",
        ),
    );

    return modules;
}

async function buildGenericPageModules(texts, images, pageTitle) {
    const modules = [];

    modules.push(
        await createHeroModule(texts.slice(0, 2), images.slice(0, 1), pageTitle),
    );

    const contentTexts = texts.filter((t) => t.length > 30);
    if (contentTexts.length > 0) {
        modules.push(await createRichTextModule(contentTexts.slice(0, 5), null));
    }

    if (images.length > 2) {
        modules.push(
            await createTwoColumnModule(contentTexts.slice(5, 7), [images[1]], null),
        );
    }

    if (images.length > 3) {
        const slideshow = await createSlideshowModule(images.slice(2));
        if (slideshow) modules.push(slideshow);
    }

    modules.push(
        await createCtaModule(
            "Learn More",
            "Contact us for more information.",
            "Contact Us",
            "/contact",
            "primary",
        ),
    );

    return modules;
}

// =============================================================================
// Main Migration Functions
// =============================================================================

async function extractPageContent(pageConfig) {
    const url = CONFIG.wixBaseUrl + pageConfig.path;
    console.log(`\n📄 Extracting: ${pageConfig.name}`);
    console.log(`   URL: ${url}`);

    try {
        const html = await fetchUrl(url);
        console.log(`   ✅ Fetched ${html.length} bytes`);

        const metadata = extractPageMetadata(html);
        const texts = extractTextsFromHtml(html);
        const images = extractImagesFromHtml(html);

        console.log(`   📝 Found ${texts.length} text elements`);
        console.log(`   🖼️  Found ${images.length} images`);

        return {
            name: pageConfig.name,
            path: pageConfig.path,
            title: pageConfig.title || metadata.title,
            metadata,
            texts,
            images,
        };
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        return null;
    }
}

async function buildPageDocument(pageContent) {
    const { name, path, title, texts, images } = pageContent;
    const slug = path ? path.replace(/^\//, "") : "home";

    console.log(`\n🔨 Building: ${name}`);

    let modules = [];

    // Build modules based on page name
    switch (name) {
        case "home":
            modules = await buildHomePageModules(texts, images);
            break;
        case "mission":
            modules = await buildMissionPageModules(texts, images);
            break;
        case "resources":
            modules = await buildResourcesPageModules(texts, images);
            break;
        case "success-stories":
            modules = await buildSuccessStoriesPageModules(texts, images);
            break;
        case "support-us":
            modules = await buildSupportUsPageModules(texts, images);
            break;
        case "contact":
            modules = await buildContactPageModules(texts, images);
            break;
        case "prayer-chain":
            modules = await buildPrayerChainPageModules(texts, images);
            break;
        default:
            modules = await buildGenericPageModules(texts, images, title);
    }

    console.log(`   📦 Created ${modules.length} modules`);

    return {
        _id: generateDocId("page", slug),
        _type: "page",
        title: title,
        slug: {
            _type: "slug",
            current: slug || "home",
        },
        seoDescription: pageContent.metadata.description || null,
        modules: modules,
    };
}

async function buildSiteSettings() {
    console.log("\n⚙️  Building site settings...");

    return {
        _id: "settings",
        _type: "settings",
        siteTitle: "Inspired Hand Ministries",
        tagline: "Let Every Creature Hear His Calling!",
        navigation: [
            { _key: generateKey(), label: "Home", link: "/" },
            { _key: generateKey(), label: "Our Mission", link: "/mission" },
            { _key: generateKey(), label: "Resources", link: "/resources" },
            {
                _key: generateKey(),
                label: "Success Stories",
                link: "/success-stories",
            },
            { _key: generateKey(), label: "Support Us", link: "/support-us" },
            { _key: generateKey(), label: "Contact", link: "/contact" },
            { _key: generateKey(), label: "Prayer Chain", link: "/prayer-chain" },
        ],
        footer: {
            copyrightText: "© 2018 Reverend H. Smith All Rights Reserved.",
            quote: "God is light; In him there is no darkness...",
            quoteAttribution: "1 John 1:5",
            links: [
                { _key: generateKey(), label: "Home", link: "/" },
                { _key: generateKey(), label: "Our Mission", link: "/mission" },
                { _key: generateKey(), label: "Resources", link: "/resources" },
                { _key: generateKey(), label: "Contact", link: "/contact" },
                { _key: generateKey(), label: "Prayer Chain", link: "/prayer-chain" },
            ],
        },
        socialLinks: [],
    };
}

async function main() {
    console.log("🚀 Comprehensive Wix to Sanity Migrator");
    console.log("═".repeat(60));

    // Load environment
    loadEnv();

    // Update config with env vars
    CONFIG.sanity.projectId =
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || CONFIG.sanity.projectId;
    CONFIG.sanity.dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || CONFIG.sanity.dataset;
    CONFIG.sanity.token =
        process.env.SANITY_API_TOKEN ||
        process.env.SANITY_API_WRITE_TOKEN ||
        CONFIG.sanity.token;

    // Validate
    if (!CONFIG.sanity.token) {
        console.error("❌ Missing SANITY_API_TOKEN environment variable");
        console.log("\nPlease set one of:");
        console.log("  - SANITY_API_TOKEN");
        console.log("  - SANITY_API_WRITE_TOKEN");
        process.exit(1);
    }

    console.log(`📍 Sanity Project: ${CONFIG.sanity.projectId}`);
    console.log(`📍 Dataset: ${CONFIG.sanity.dataset}`);
    console.log(`📍 Wix Site: ${CONFIG.wixBaseUrl}`);

    // Load asset cache
    loadAssetCache();

    // Extract and build all pages
    const pageDocuments = [];

    for (const pageConfig of PAGES_CONFIG) {
        const pageContent = await extractPageContent(pageConfig);

        if (pageContent) {
            const pageDoc = await buildPageDocument(pageContent);
            pageDocuments.push(pageDoc);

            // Import immediately
            try {
                await createOrReplaceDocument(pageDoc);
                console.log(`   ✅ Imported: ${pageDoc._id}`);
            } catch (error) {
                console.error(`   ❌ Failed to import: ${error.message}`);
            }
        }

        // Small delay between pages
        await sleep(500);
    }

    // Build and import settings
    const settingsDoc = await buildSiteSettings();
    try {
        await createOrReplaceDocument(settingsDoc);
        console.log("   ✅ Imported: settings");
    } catch (error) {
        console.error(`   ❌ Failed to import settings: ${error.message}`);
    }

    // Save NDJSON backup
    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    const ndjsonPath = path.join(
        CONFIG.outputDir,
        "sanity-complete-import.ndjson",
    );
    const ndjson = [...pageDocuments, settingsDoc]
        .map((doc) => JSON.stringify(doc))
        .join("\n");
    fs.writeFileSync(ndjsonPath, ndjson);
    console.log(`\n💾 Backup saved: ${ndjsonPath}`);

    // Summary
    console.log("\n" + "═".repeat(60));
    console.log("✨ Migration Complete!");
    console.log("─".repeat(60));
    console.log(`📄 Pages imported: ${pageDocuments.length}`);
    console.log(`🖼️  Images uploaded: ${Object.keys(assetCache).length}`);
    console.log("\n📌 Next Steps:");
    console.log("   1. Visit Sanity Studio to review content");
    console.log("   2. Publish documents to make them live");
    console.log("   3. Visit your live site to see the changes");
    console.log(`\n🔗 Studio: https://${CONFIG.sanity.projectId}.sanity.studio`);
    console.log(`🔗 Site: https://inspired-hand-web.vercel.app`);
}

main().catch(console.error);
