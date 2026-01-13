'use client'
/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */
import { visionTool } from '@sanity/vision'
import { apiVersion, basePath, dataset, projectId } from 'lib/sanity.api'
import { locate } from 'plugins/locate'
import { pageStructure, singletonPlugin } from 'plugins/settings'
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'

// Document schemas
import page from 'schemas/documents/page'
import story from 'schemas/documents/story'

// Object schemas (modules)
import hero from 'schemas/objects/hero'
import richTextSection from 'schemas/objects/richTextSection'
import slideshow from 'schemas/objects/slideshow'
import twoColumnSection from 'schemas/objects/twoColumnSection'
import formSection from 'schemas/objects/formSection'
import ctaSection from 'schemas/objects/ctaSection'
import quoteSection from 'schemas/objects/quoteSection'
import storiesGrid from 'schemas/objects/storiesGrid'
import compositeFeatureSection from 'schemas/objects/compositeFeatureSection'

// Singleton schemas
import settings from 'schemas/singletons/settings'

import { debugSecrets } from '@sanity/preview-url-secret/sanity-plugin-debug-secrets'

const title =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || 'Inspired Hand Ministries'

export default defineConfig({
  basePath,
  projectId: projectId || '',
  dataset: dataset || '',
  title,
  schema: {
    types: [
      // Singletons
      settings,
      // Documents
      page,
      story,
      // Objects (modules for page builder)
      hero,
      richTextSection,
      slideshow,
      twoColumnSection,
      formSection,
      ctaSection,
      quoteSection,
      storiesGrid,
      compositeFeatureSection,
    ],
  },
  plugins: [
    presentationTool({
      locate,
      previewUrl: {
        previewMode: {
          enable: '/api/draft',
        },
      },
    }),
    structureTool({
      structure: pageStructure([settings]),
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([settings.name]),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    // See url preview secrets in the schema for debugging
    process.env.NODE_ENV === 'development' && debugSecrets(),
  ].filter(Boolean),
})
