'use client'

import { useEffect, useState } from 'react'
import { cn } from '../../utils/utils'

const LINKS = [
  { label: 'Aim', href: '#product' },
  { label: 'How It Works', href: '#how' },
  { label: 'About', href: '#about' },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [ctaHovered, setCtaHovered] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
    }

    onScroll()

    window.addEventListener('scroll', onScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-black/5 backdrop-blur-md border-b border-black/5'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <a
          href="#top"
          className="flex items-center gap-2 text-sm font-medium tracking-tight"
        >
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 rounded-full bg-[#608068]"
          />

          <span className="font-mono text-[0.95rem] uppercase tracking-[0.2em] text-[#2d2c28]">
            WeDraft
          </span>
        </a>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[#78786e] transition-colors duration-300 hover:text-[#2d2c28]"
            >
              {link.label}
            </a>
          ))}

          <a
            href="/login"
            className="text-sm text-[#78786e] transition-colors duration-300 hover:text-[#2d2c28]"
          >
            Sign In
          </a>
        </div>

        <a
          href="/login"
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
          className="inline-flex h-10 items-center justify-center rounded-full border px-5 text-sm font-medium whitespace-nowrap shadow-none transition-transform duration-300 ease-out active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96c2a0] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          style={{
            borderColor: ctaHovered ? '#608068' : '#2d2c28',
            backgroundColor: ctaHovered ? '#608068' : '#2d2c28',
            color: '#f6f5ef',
            transform: ctaHovered ? 'translateY(-2px)' : undefined,
          }}
        >
          Start Designing
        </a>
      </nav>
    </header>
  )
}