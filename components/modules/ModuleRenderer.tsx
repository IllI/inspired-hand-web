import dynamic from 'next/dynamic'
import type { PageModule } from 'types'

// Import module components
import { CtaSection } from './CtaSection'
import { FormSection } from './FormSection'
import { Hero } from './Hero'
import { QuoteSection } from './QuoteSection'
import { RichTextSection } from './RichTextSection'
import { Slideshow } from './Slideshow'
import { StoriesGrid } from './StoriesGrid'
import { TwoColumnSection } from './TwoColumnSection'
import { CompositeFeatureSection } from './CompositeFeatureSection'
import { TestimonialSection } from './TestimonialSection'

// Map of module types to their components
const moduleComponents: Record<string, React.ComponentType<{ module: any }>> = {
  hero: Hero,
  richTextSection: RichTextSection,
  slideshow: Slideshow,
  twoColumnSection: TwoColumnSection,
  formSection: FormSection,
  ctaSection: CtaSection,
  quoteSection: QuoteSection,
  storiesGrid: StoriesGrid,
  compositeFeatureSection: CompositeFeatureSection,
  testimonialSection: TestimonialSection,
}

interface ModuleRendererProps {
  modules?: PageModule[]
}

/**
 * Renders a single module based on its _type
 */
function renderModule(module: PageModule, index: number) {
  const Component = moduleComponents[module._type]

  if (!Component) {
    // In development, show a warning for unknown module types
    if (process.env.NODE_ENV === 'development') {
      return (
        <div
          key={module._key || index}
          className="mx-auto my-8 max-w-4xl rounded-lg border-2 border-dashed border-yellow-400 bg-yellow-50 p-6 text-center"
        >
          <p className="text-yellow-700">
            Unknown module type:{' '}
            <code className="font-mono">{module._type}</code>
          </p>
          <p className="mt-2 text-sm text-yellow-600">
            Add a component for this module type in ModuleRenderer.tsx
          </p>
        </div>
      )
    }
    // In production, silently skip unknown modules
    return null
  }

  return <Component key={module._key || index} module={module} />
}

/**
 * ModuleRenderer - Renders an array of page builder modules
 *
 * This component takes an array of modules from Sanity's page builder
 * and renders the appropriate component for each one based on its _type.
 *
 * @example
 * ```tsx
 * <ModuleRenderer modules={page.modules} />
 * ```
 */
export function ModuleRenderer({ modules }: ModuleRendererProps) {
  if (!modules || modules.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col">
      {modules.map((module, index) => renderModule(module, index))}
    </div>
  )
}

/**
 * Renders a single module - useful when you need more control over rendering
 */
export function Module({ module }: { module: PageModule }) {
  const Component = moduleComponents[module._type]

  if (!Component) {
    return null
  }

  return <Component module={module} />
}

export default ModuleRenderer
