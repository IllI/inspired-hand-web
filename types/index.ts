import type { PortableTextBlock } from '@portabletext/types'
import type { Image } from 'sanity'

// =============================================================================
// Base Types
// =============================================================================

export interface SanityImage extends Image {
  alt?: string
  caption?: string
  asset?: {
    _ref: string
    _type: 'reference'
    url?: string
    metadata?: {
      dimensions?: {
        width: number
        height: number
      }
    }
  }
}

export interface CTA {
  label?: string
  link?: string
}

// =============================================================================
// Module Types (Page Builder Components)
// =============================================================================

export interface HeroModule {
  _type: 'hero'
  _key: string
  heading?: string
  subheading?: string
  backgroundImage?: SanityImage
  cta?: CTA
  style?: 'default' | 'speechBubble'
}

export interface RichTextSectionModule {
  _type: 'richTextSection'
  _key: string
  heading?: string
  content?: PortableTextBlock[]
}

export interface SlideItem {
  _key: string
  image?: SanityImage
  heading?: string
  caption?: string
  ctaLabel?: string
  ctaLink?: string
}

export interface SlideshowModule {
  _type: 'slideshow'
  _key: string
  slides?: SlideItem[]
  autoplay?: boolean
  interval?: number
}

export interface TwoColumnSectionModule {
  _type: 'twoColumnSection'
  _key: string
  layout?: 'image-left' | 'image-right'
  heading?: string
  content?: PortableTextBlock[]
  image?: SanityImage
  cta?: CTA
}

export interface FormField {
  _key: string
  name?: string
  label?: string
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox'
  placeholder?: string
  required?: boolean
}

export interface FormSectionModule {
  _type: 'formSection'
  _key: string
  heading?: string
  description?: string
  formType?: 'contact' | 'newsletter' | 'prayer-request'
  fields?: FormField[]
  submitLabel?: string
  successMessage?: string
}

export interface CtaSectionModule {
  _type: 'ctaSection'
  _key: string
  heading?: string
  description?: string
  buttonLabel?: string
  buttonLink?: string
  style?: 'primary' | 'secondary' | 'accent'
  backgroundImage?: SanityImage
}

export interface QuoteSectionModule {
  _type: 'quoteSection'
  _key: string
  quote?: string
  attribution?: string
  source?: string
  style?: 'default' | 'large' | 'background'
  backgroundImage?: SanityImage
  authorImage?: SanityImage
}

export interface StoriesGridModule {
  _type: 'storiesGrid'
  _key: string
  stories?: {
    _key: string
    title?: string
    link?: string
    image?: SanityImage
  }[]
}

// Union type for all modules
export type PageModule =
  | HeroModule
  | RichTextSectionModule
  | SlideshowModule
  | TwoColumnSectionModule
  | FormSectionModule
  | CtaSectionModule
  | QuoteSectionModule
  | StoriesGridModule

// =============================================================================
// Page Types
// =============================================================================

export interface PagePayload {
  _id?: string
  title?: string
  slug?: string
  seoDescription?: string
  ogImage?: SanityImage
  modules?: PageModule[]
}

// Home page uses the same structure as regular pages
export interface HomePagePayload extends PagePayload {}

// =============================================================================
// Settings Types
// =============================================================================

export interface NavItem {
  _key: string
  label?: string
  link?: string
}

export interface FooterLink {
  _key: string
  label?: string
  link?: string
}

export interface Footer {
  copyrightText?: string
  quote?: string
  quoteAttribution?: string
  links?: FooterLink[]
}

export interface SocialLink {
  _key: string
  platform?: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'linkedin'
  url?: string
}

export interface SettingsPayload {
  siteTitle?: string
  tagline?: string
  logo?: SanityImage
  navigation?: NavItem[]
  footer?: Footer
  socialLinks?: SocialLink[]
  ogImage?: SanityImage
}

// =============================================================================
// Legacy Types (for compatibility during migration)
// =============================================================================

export interface MenuItem {
  _type: string
  slug?: string
  title?: string
}

export interface MilestoneItem {
  description?: string
  duration?: {
    start?: string
    end?: string
  }
  image?: Image
  tags?: string[]
  title?: string
}

export interface ShowcaseProject {
  _type: string
  coverImage?: Image
  overview?: PortableTextBlock[]
  slug?: string
  tags?: string[]
  title?: string
}

export interface ProjectPayload {
  client?: string
  coverImage?: Image
  description?: PortableTextBlock[]
  duration?: {
    start?: string
    end?: string
  }
  overview?: PortableTextBlock[]
  site?: string
  slug: string
  tags?: string[]
  title?: string
}
