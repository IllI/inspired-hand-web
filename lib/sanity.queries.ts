import { groq } from 'next-sanity'

// Reusable module projection for page builder
const moduleProjection = groq`
  _type,
  _key,
  _type == "hero" => {
    heading,
    subheading,
    style,
    backgroundImage {
      ...,
      asset
    },
    cta
  },
  _type == "richTextSection" => {
    heading,
    content[] {
      ...,
      _type == "image" => {
        ...,
        asset
      }
    }
  },
  _type == "slideshow" => {
    slides[] {
      _key,
      image {
        ...,
        asset
      },
      heading,
      caption,
      ctaLabel,
      ctaLink
    },
    autoplay,
    interval
  },
  _type == "twoColumnSection" => {
    layout,
    heading,
    content,
    image {
      ...,
      asset
    },
    cta
  },
  _type == "formSection" => {
    heading,
    description,
    formType,
    fields[] {
      _key,
      name,
      label,
      type,
      placeholder,
      required
    },
    submitLabel,
    successMessage
  },
  _type == "ctaSection" => {
    heading,
    description,
    buttonLabel,
    buttonLink,
    style,
    backgroundImage {
      ...,
      asset
    }
  },
  _type == "quoteSection" => {
    quote,
    authorName,
    bookTitle,
    role,
    style,
    backgroundImage {
      ...,
      asset
    },
    authorImage {
      ...,
      asset
    }
  },
  _type == "storiesGrid" => {
    heading,
    description,
    stories[]->{
      _id,
      _type,
      title,
      slug,
      excerpt,
      featuredImage {
        ...,
        asset
      }
    }
  }
`

// Home page query - fetches the page with slug "home"
export const homePageQuery = groq`
  *[_type == "page" && slug.current == "home"][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    seoDescription,
    ogImage {
      ...,
      asset
    },
    modules[] {
      ${moduleProjection}
    }
  }
`

// Get home page title for breadcrumbs/nav
export const homePageTitleQuery = groq`
  *[_type == "page" && slug.current == "home"][0].title
`

// Page by slug query - fetches any page or story with full data
export const pagesBySlugQuery = groq`
  *[_type in ["page", "story"] && slug.current == $slug][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    seoDescription,
    ogImage {
      ...,
      asset
    },
    // Page specific
    modules[] {
      ${moduleProjection}
    },
    // Story specific
    excerpt,
    content,
    featuredImage {
      ...,
      asset
    }
  }
`

// All page paths for static generation
export const pagePaths = groq`
  *[_type in ["page", "story"] && slug.current != null].slug.current
`

// Settings query - fetches global site configuration
export const settingsQuery = groq`
  *[_type == "settings"][0] {
    siteTitle,
    tagline,
    logo {
      ...,
      asset
    },
    navigation[] {
      _key,
      label,
      link
    },
    footer {
      copyrightText,
      quote,
      quoteAttribution,
      newsletterHeading,
      newsletterSubtext,
      hideNewsletter,
      links[] {
        _key,
        label,
        link
      }
    },
    socialLinks[] {
      _key,
      platform,
      url
    },
    ogImage {
      ...,
      asset
    }
  }
`

// Get all pages for sitemap or navigation
export const allPagesQuery = groq`
  *[_type == "page"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    seoDescription
  }
`
