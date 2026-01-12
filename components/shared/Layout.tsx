import { useState } from 'react'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'
import type { SettingsPayload } from 'types'

export interface LayoutProps {
  children: React.ReactNode
  settings: SettingsPayload | null
}

export function Layout({ children, settings }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const siteTitle = settings?.siteTitle || 'Inspired Hand Ministries'
  const navigation = settings?.navigation || []
  const footer = settings?.footer
  const logo = settings?.logo

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
          {/* Left: Navigation (Mission, Success Stories) */}
          <nav className="hidden lg:flex items-center gap-8 w-1/3 justify-start">
            <Link
              href="/mission"
              className="text-xs font-bold uppercase tracking-widest text-ih-text-dark transition-colors hover:text-ih-primary"
            >
              Mission
            </Link>
            <Link
              href="/success-stories"
              className="text-xs font-bold uppercase tracking-widest text-ih-text-dark transition-colors hover:text-ih-primary"
            >
              Success Stories
            </Link>
          </nav>

          {/* Center: Logo */}
          <Link
            href="/"
            className="flex items-center justify-center gap-3 absolute left-1/2 transform -translate-x-1/2"
          >
            <span className="font-heading text-2xl font-bold text-ih-text-dark tracking-tight">
              Inspired
            </span>
            {/* Paw Icon */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-ih-text-dark"
            >
              <path d="M12,2C12,2 11,3 11,4C11,5 12,6 12,6C12,6 13,5 13,4C13,3 12,2 12,2M8,3C8,3 6,4 6,6C6,8 8,9 8,9C8,9 9,8 9,6C9,4 8,3 8,3M16,3C16,3 15,4 15,6C15,8 17,9 17,9C17,9 19,8 19,6C19,4 16,3 16,3M5.5,8C5.5,8 3,9 3,11C3,13 5.5,14 5.5,14C5.5,14 6.5,13 6.5,11C6.5,9 5.5,8 5.5,8M18.5,8C18.5,8 17.5,9 17.5,11C17.5,13 20,14 20,14C20,14 21,13 21,11C21,9 18.5,8 18.5,8M12,8C9.5,8 7,10 7,12.5C7,15 9.5,17 12,17C14.5,17 17,15 17,12.5C17,10 14.5,8 12,8M12,18C9,18 6,19.5 5,22H19C18,19.5 15,18 12,18Z" />
            </svg>
            <span className="font-heading text-2xl font-bold text-ih-text-dark tracking-tight">
              Hand
            </span>
          </Link>

          {/* Right: Navigation (Resources) & Donate */}
          <div className="hidden lg:flex items-center gap-8 w-1/3 justify-end">
            <Link
              href="/resources"
              className="text-xs font-bold uppercase tracking-widest text-ih-text-dark transition-colors hover:text-ih-primary"
            >
              Resources
            </Link>
            <Link
              href="/support-us"
              className="inline-flex items-center gap-2 rounded-sm bg-ih-accent px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-red-700 shadow-sm"
            >
              <span>Donate</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden ml-auto">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-ih-primary focus:outline-none"
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-24 shadow-lg flex flex-col p-4 space-y-4 animate-fadeIn">
            <Link href="/mission" className="block text-sm font-bold uppercase tracking-widest text-ih-text-dark hover:text-ih-primary" onClick={() => setIsMobileMenuOpen(false)}>Mission</Link>
            <Link href="/success-stories" className="block text-sm font-bold uppercase tracking-widest text-ih-text-dark hover:text-ih-primary" onClick={() => setIsMobileMenuOpen(false)}>Success Stories</Link>
            <Link href="/resources" className="block text-sm font-bold uppercase tracking-widest text-ih-text-dark hover:text-ih-primary" onClick={() => setIsMobileMenuOpen(false)}>Resources</Link>
            <Link href="/support-us" className="inline-flex items-center justify-center gap-2 rounded-sm bg-ih-accent px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-700 transition-all w-full" onClick={() => setIsMobileMenuOpen(false)}>
              Donate
            </Link>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="text-white">
        {/* Newsletter Strip (Visual Match) */}
        {!footer?.hideNewsletter && (
          <div className="bg-ih-primary py-8 text-center text-ih-text-dark">
            <div className="mx-auto max-w-4xl px-4">
              <h3 className="text-2xl font-heading font-bold mb-2">
                {footer?.newsletterHeading || 'Be Inspired'}
              </h3>
              <p className="font-sans mb-4">
                {footer?.newsletterSubtext ||
                  'Join our dedicated community and receive our weekly devotionals.'}
              </p>
              {/* Placeholder for form input */}
              <div className="flex justify-center gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email here*"
                  className="px-4 py-2 w-full border border-gray-300"
                />
                <button className="bg-ih-text-dark text-white px-6 py-2 uppercase font-bold text-xs tracking-widest">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Footer Content */}
        <div className="bg-ih-footer border-t border-ih-secondary">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid gap-12 md:grid-cols-3 text-center md:text-left">
              {/* Brand column */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-xl font-heading font-bold leading-tight">
                  INSPIRED HAND
                  <br />
                  MINISTRIES
                </h3>
                <p className="mt-4 text-sm text-gray-200 italic font-serif">
                  &quot;Let Every Creature Hear His Calling!&quot;
                </p>
                <div className="mt-6 flex gap-4">
                  {settings?.socialLinks?.map((social) => (
                    <a
                      key={social._key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-ih-primary transition-colors"
                    >
                      <SocialIcon platform={social.platform} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact / Links */}
              <div className="flex flex-col items-center md:items-center">
                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-ih-primary">
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {navigation.map((item) => (
                    <li key={item._key}>
                      <Link
                        href={item.link || '/'}
                        className="text-sm text-gray-200 transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Let's Talk */}
              <div className="flex flex-col items-center md:items-end">
                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-ih-primary">
                  Let&apos;s Talk
                </h4>
                <p className="text-gray-200 text-sm mb-4">
                  Questions, stories, or thoughts?
                </p>
                <Link
                  href="/contact"
                  className="text-white underline decoration-ih-primary hover:text-ih-primary transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-16 border-t border-white/10 pt-8 text-center">
              <p className="text-xs text-gray-300 font-sans uppercase tracking-wider">
                {footer?.copyrightText ||
                  `© ${new Date().getFullYear()} Reverend H. Smith. All rights reserved.`}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Social media icon component
function SocialIcon({ platform }: { platform?: string }) {
  switch (platform) {
    case 'facebook':
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    case 'twitter':
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    default:
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      )
  }
}
