'use client'

import {
  useEffect,
  useState,
} from 'react'

import { Contours } from './Contours'
import { cn } from '../../utils/utils'

export function Hero() {
  const [stage, setStage] =
    useState(0)

  useEffect(() => {
    const t1 = setTimeout(
      () => setStage(1),
      300,
    )

    const t2 = setTimeout(
      () => setStage(2),
      1600,
    )

    const t3 = setTimeout(
      () => setStage(3),
      2600,
    )

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="animate-drift-slow h-[130vmin] w-[130vmin] max-w-none text-(--landing-accent) opacity-30">
          <Contours variant="a" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <p
          className={cn(
            'mb-8 font-mono text-xs uppercase tracking-[0.35em] text-(--landing-muted) transition-all duration-1000',
            stage >= 1
              ? 'opacity-100'
              : 'translate-y-2 opacity-0',
          )}
        >
          Collaborative Landscape Design
        </p>

        <h1 className="text-balance text-6xl font-semibold leading-[0.95] tracking-tight text-(--landing-foreground) sm:text-7xl md:text-8xl lg:text-[8.5rem]">
          <span
            className={cn(
              'block transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)',
              stage >= 1
                ? 'translate-y-0 opacity-100 blur-0'
                : 'translate-y-6 opacity-0 blur-md',
            )}
          >
            Be Creative.
          </span>

          <span
            className={cn(
              'block text-(--landing-accent) transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)',
              stage >= 2
                ? 'translate-y-0 opacity-100 blur-0'
                : 'translate-y-6 opacity-0 blur-md',
            )}
          >
            Be Collaborative.
          </span>
        </h1>
      </div>

      <div
        className={cn(
          'absolute bottom-10 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-1000',
          stage >= 3
            ? 'opacity-100'
            : 'opacity-0',
        )}
      >
        <div className="flex flex-col items-center gap-3 text-(--landing-muted)">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em]">
            Scroll
          </span>

          <span className="block h-10 w-px animate-pulse bg-(--landing-border)" />
        </div>
      </div>
    </section>
  )
}