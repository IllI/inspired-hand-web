/**
 * Targeted Migration Script for Mission and Resources Pages
 * Defines correct source paths and explicitly migrates these missing pages.
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

// Pages to migrate - CORRECTED PATHS
const PAGES_CONFIG = [
    {
        name: "mission",
        path: "/our-mission", // Corrected from /mission
        title: "Our Mission",
    },
    {
        name: "resources",
        path: "/resources",
        title: "Resources",
    },
];

let assetCache = {};

// =============================================================================
// Utils & Helpers
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
                    const value = trimmed.substring(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
                    if (!process.env[key]) process.env[key] = value;
                }
            });
            console.log(`📦 Loaded env from ${envPath}`);
            break;
        }
    }
}

function generateKey() { return crypto.randomBytes(6).toString("hex"); }
function generateDocId(type, slug) { return `${type}-${slug.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`; }
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

// =============================================================================
// HTTP & Sanity
// =============================================================================

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith("https") ? https : http;
        const request = protocol.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchUrl(res.headers.location.startsWith("/") ? `https://${new URL(url).host}${res.headers.location}` : res.headers.location).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve(data));
        });
        request.on("error", reject);
    });
}

function downloadImage(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith("https") ? https : http;
        const request = protocol.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) return downloadImage(res.headers.location).then(resolve).catch(reject);
            if (res.statusCode !== 200) return reject(new Error(`Failed: ${res.statusCode}`));
            const chunks = [];
            res.on("data", (chunk) => chunks.push(chunk));
            res.on("end", () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers["content-type"] || "image/jpeg" }));
        });
        request.on("error", reject);
    });
}

function loadAssetCache() {
    if (fs.existsSync(CONFIG.assetCachePath)) {
        try { assetCache = JSON.parse(fs.readFileSync(CONFIG.assetCachePath, "utf-8")); } catch (e) { assetCache = {}; }
    }
}

function saveAssetCache() {
    if (!fs.existsSync(CONFIG.outputDir)) fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    fs.writeFileSync(CONFIG.assetCachePath, JSON.stringify(assetCache, null, 2));
}

async function uploadImageToSanity(imageUrl) {
    if (!imageUrl) return null;
    let cleanUrl = imageUrl.split("/v1/")[0];
    if (assetCache[cleanUrl]) return assetCache[cleanUrl];

    try {
        console.log(`    📤 Uploading: ${cleanUrl.substring(0, 40)}...`);
        const { buffer, contentType } = await downloadImage(cleanUrl);
        const ext = (contentType === "image/png" ? "png" : "jpg");
        const filename = `image-${Date.now()}.${ext}`;
        const uploadUrl = `https://${CONFIG.sanity.projectId}.api.sanity.io/v${CONFIG.sanity.apiVersion}/assets/images/${CONFIG.sanity.dataset}?filename=${filename}`;

        const result = await new Promise((resolve, reject) => {
            const req = https.request(uploadUrl, {
                method: "POST", headers: { "Content-Type": contentType, "Content-Length": buffer.length, Authorization: `Bearer ${CONFIG.sanity.token}` },
            }, (res) => {
                let data = "";
                res.on("data", (c) => data += c);
                res.on("end", () => res.statusCode >= 200 && res.statusCode < 300 ? resolve(JSON.parse(data)) : reject(new Error(data)));
            });
            req.on("error", reject);
            req.write(buffer);
            req.end();
        });

        const assetRef = result.document._id;
        assetCache[cleanUrl] = assetRef;
        saveAssetCache();
        return assetRef;
    } catch (e) {
        console.error(`    ❌ Upload failed: ${e.message}`);
        return null;
    }
}

async function createOrReplaceDocument(doc) {
    const url = `https://${CONFIG.sanity.projectId}.api.sanity.io/v${CONFIG.sanity.apiVersion}/data/mutate/${CONFIG.sanity.dataset}`;
    const mutations = [{ createOrReplace: doc }];
    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${CONFIG.sanity.token}` },
        }, (res) => {
            let data = "";
            res.on("data", (c) => data += c);
            res.on("end", () => res.statusCode >= 200 ? resolve(JSON.parse(data)) : reject(new Error(data)));
        });
        req.write(JSON.stringify({ mutations }));
        req.end();
    });
}

// =============================================================================
// Extraction & Transformation
// =============================================================================

function clean(t) { return t.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").trim(); }

const GARBAGE = ["top of page", "skip to content", "menu", "search", "cart", "log in"];

function extractTextsFromHtml(html) {
    const texts = [];
    const seen = new Set();
    const matches = html.matchAll(/<(?:h[1-6]|p|div|span)[^>]*>([^<]+)<\/(?:h[1-6]|p|div|span)>/gi);
    for (const m of matches) {
        const c = clean(m[1]);
        if (c.length > 5 && !seen.has(c) && !GARBAGE.includes(c.toLowerCase())) {
            seen.add(c); texts.push(c);
        }
    }
    return texts;
}

function extractImagesFromHtml(html) {
    const images = [];
    const matches = html.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/gi);
    for (const m of matches) {
        let url = m[1];
        if (url.includes("wixstatic") && !images.some(i => i.url === url)) {
            if (url.startsWith("//")) url = "https:" + url;
            images.push({ url });
        }
    }
    return images;
}

function toPortableText(text) {
    return text.split(/\n\n+/).map(p => ({
        _type: "block", _key: generateKey(), style: "normal", children: [{ _type: "span", _key: generateKey(), text: p.trim() }]
    }));
}

async function createImageRef(url) {
    const ref = await uploadImageToSanity(url);
    return ref ? { _type: "image", asset: { _type: "reference", _ref: ref } } : null;
}

// =============================================================================
// Module Builders
// =============================================================================

async function createHeroModule(texts, images, title, style = "default") {
    // Filter out "top of page" again just in case
    const validTexts = texts.filter(t => !GARBAGE.includes(t.toLowerCase()));

    // Use title (passed arg) as fallback if text 0 is suspicious, OR always prefer Title if style is overlay
    const heading = (style === "imageOverlay") ? title : (validTexts[0] || title);
    const subheading = (style === "imageOverlay") ? (validTexts[0] || "") : (validTexts[1] || "");

    const img = images[0] ? await createImageRef(images[0].url) : null;
    return {
        _type: "hero", _key: generateKey(), heading,
        subheading,
        backgroundImage: img,
        style: style
    };
}

async function createRichTextModule(texts, heading) {
    return {
        _type: "richTextSection", _key: generateKey(), heading,
        content: texts.map(t => toPortableText(t)).flat()
    };
}

async function createTwoColumnModule(texts, images, heading) {
    const img = images[0] ? await createImageRef(images[0].url) : null;
    return {
        _type: "twoColumnSection", _key: generateKey(), heading,
        content: texts.slice(0, 3).map(t => toPortableText(t)).flat(),
        image: img, layout: "image-right"
    };
}

async function createSlideshowModule(images) {
    const slides = [];
    for (const img of images.slice(0, 5)) {
        const ref = await createImageRef(img.url);
        if (ref) slides.push({ _key: generateKey(), image: ref });
    }
    return slides.length ? { _type: "slideshow", _key: generateKey(), slides } : null;
}

async function createCtaModule(heading, desc, label, link) {
    return { _type: "ctaSection", _key: generateKey(), heading, description: desc, buttonLabel: label, buttonLink: link };
}

// =============================================================================
// Page Builders
// =============================================================================

async function buildMissionPageModules(texts, images) {
    const modules = [];
    // Hero with Overlay Style and forced Title
    modules.push(await createHeroModule(texts.slice(0, 1), images.slice(0, 1), "About Our Ministry", "imageOverlay"));

    // Rich Text
    const content = texts.slice(1).filter(t => t.length > 50);
    if (content.length) modules.push(await createRichTextModule(content, "What We Believe"));

    // Slideshow
    if (images.length > 1) {
        const ss = await createSlideshowModule(images.slice(1));
        if (ss) modules.push(ss);
    }

    // CTA
    modules.push(await createCtaModule("Support our Mission", "Help us spread the word.", "Donate", "/support-us"));

    return modules;
}

async function buildResourcesPageModules(texts, images) {
    const modules = [];
    modules.push(await createHeroModule(texts.slice(0, 1), images.slice(0, 1), "Resources", "imageOverlay"));

    // Resource list mimicking two columns
    const resTexts = texts.slice(1).filter(t => t.length > 30);
    for (let i = 0; i < Math.min(resTexts.length, 6); i += 2) {
        const chunk = resTexts.slice(i, i + 2);
        const img = images[1 + Math.floor(i / 2)];
        if (chunk.length) {
            modules.push(await createTwoColumnModule(chunk, img ? [img] : [], null));
        }
    }

    modules.push(await createCtaModule("Contact Us", "Need more info?", "Contact", "/contact"));
    return modules;
}

// =============================================================================
// Main
// =============================================================================

async function main() {
    console.log("🚀 Re-Migrating Pages with Improved Styles");
    loadEnv();

    // Ensure Token
    CONFIG.sanity.token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
    if (!CONFIG.sanity.token) { console.error("❌ No Token"); process.exit(1); }

    loadAssetCache();

    for (const pageConfig of PAGES_CONFIG) {
        console.log(`\n📄 Processing: ${pageConfig.name} (${pageConfig.path})`);

        try {
            const html = await fetchUrl(CONFIG.wixBaseUrl + pageConfig.path);
            const texts = extractTextsFromHtml(html);
            const images = extractImagesFromHtml(html);

            console.log(`   Fetched ${html.length} bytes, ${texts.length} texts, ${images.length} images`);

            let modules = [];
            if (pageConfig.name === "mission") modules = await buildMissionPageModules(texts, images);
            else if (pageConfig.name === "resources") modules = await buildResourcesPageModules(texts, images);

            // Force slug to match navigation expectations
            const slug = pageConfig.name; // "mission" or "resources"

            const doc = {
                _id: generateDocId("page", slug),
                _type: "page",
                title: pageConfig.title,
                slug: { _type: "slug", current: slug },
                modules: modules
            };

            await createOrReplaceDocument(doc);
            console.log(`   ✅ Created/Updated Page: ${doc.title} (${doc._id})`);

        } catch (e) {
            console.error(`   ❌ Failed: ${e.message}`);
        }
    }

    console.log("\nDone.");
}

main().catch(console.error);
