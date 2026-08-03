'use client'

import { useEffect } from 'react'

type RGB = [number, number, number]

const STOPS: Record<string, [RGB, RGB]> = {
  '--landing-background': [
    [246, 245, 239],
    [15, 30, 22],
  ],

  '--landing-foreground': [
    [45, 44, 40],
    [240, 244, 238],
  ],

  '--landing-muted': [
    [120, 120, 110],
    [176, 198, 182],
  ],

  '--landing-border': [
    [216, 215, 206],
    [64, 86, 72],
  ],

  '--landing-card': [
    [246, 245, 239],
    [22, 40, 31],
  ],

  '--landing-muted-bg': [
    [237, 236, 229],
    [30, 50, 40],
  ],

  '--landing-primary': [
    [45, 44, 40],
    [240, 244, 238],
  ],

  '--landing-primary-foreground': [
    [246, 245, 239],
    [15, 30, 22],
  ],

  '--landing-accent': [
    [96, 128, 104],
    [150, 194, 160],
  ],
}

function lerp(
  a: number,
  b: number,
  t: number,
) {
  return Math.round(
    a + (b - a) * t,
  )
}

function mix(
  [from, to]: [RGB, RGB],
  t: number,
) {
  return `rgb(
    ${lerp(from[0], to[0], t)},
    ${lerp(from[1], to[1], t)},
    ${lerp(from[2], to[2], t)}
  )`
}

function band(p: number) {
  const start = 0.34
  const end = 0.66

  const x = Math.min(
    1,
    Math.max(
      0,
      (p - start) / (end - start),
    ),
  )

  return x * x * (3 - 2 * x)
}

export function ScrollBackground() {
  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const landingRoot =
      document.querySelector(
        '.landing-page',
      ) as HTMLElement | null

    if (!landingRoot) {
      return
    }

    let frame = 0

    const apply = () => {
      frame = 0

      const max =
        document.documentElement.scrollHeight -
        window.innerHeight

      const progress =
        max > 0
          ? Math.min(
              1,
              Math.max(
                0,
                window.scrollY / max,
              ),
            )
          : 0

      const t = reduce
        ? 0
        : band(progress)

      // -----------------------------------------
      // Main theme variables
      // -----------------------------------------

      for (const [prop, stop] of Object.entries(
        STOPS,
      )) {
        landingRoot.style.setProperty(
          prop,
          mix(stop, t),
        )
      }

      // -----------------------------------------
      // Dynamic accent background
      // -----------------------------------------

      const accent = mix(
        STOPS['--landing-accent'],
        t,
      )

      landingRoot.style.setProperty(
        '--landing-accent-bg',
        `color-mix(
          in srgb,
          ${accent} 8%,
          transparent
        )`,
      )

      landingRoot.style.setProperty(
        '--landing-accent-border',
        `color-mix(
          in srgb,
          ${accent} 35%,
          transparent
        )`,
      )
    }

    const onScroll = () => {
      if (frame) return

      frame =
        requestAnimationFrame(apply)
    }

    apply()

    window.addEventListener(
      'scroll',
      onScroll,
      { passive: true },
    )

    window.addEventListener(
      'resize',
      onScroll,
      { passive: true },
    )

    return () => {
      window.removeEventListener(
        'scroll',
        onScroll,
      )

      window.removeEventListener(
        'resize',
        onScroll,
      )

      if (frame) {
        cancelAnimationFrame(frame)
      }
    }
  }, [])

  return null
}