import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import type { StoriesGridModule } from 'types'

interface StoriesGridProps {
  module: StoriesGridModule
}

export function StoriesGrid({ module }: StoriesGridProps) {
  const { stories } = module

  if (!stories || stories.length === 0) {
    return null
  }

  return (
    <section className="bg-gray-50 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stories.map((story) => {
            const imageUrl = story.image?.asset
              ? urlForImage(story.image)?.width(600).height(400).url()
              : null

            const content = (
              <>
                <div className="relative h-64 w-full overflow-hidden bg-gray-200">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={story.image?.alt || story.title || 'Story image'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </div>
                <div className="p-6">
                  {story.title && (
                    <h3 className="mb-2 font-heading text-xl font-bold text-gray-900 group-hover:text-ih-primary">
                      {story.title}
                    </h3>
                  )}
                  {story.link && (
                    <div className="flex items-center text-sm font-semibold text-ih-primary">
                      <span>Read Story</span>
                      <svg
                        className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </>
            )

            return story.link ? (
              <Link
                key={story._key || story.title}
                href={story.link}
                className="group relative block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {content}
              </Link>
            ) : (
              <div
                key={story._key || story.title}
                className="group relative block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {content}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
