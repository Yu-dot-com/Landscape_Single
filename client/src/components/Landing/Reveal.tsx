'use client'

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react'

import { cn } from '../../utils/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  blur?: boolean
  as?: ElementType
  once?: boolean
}

export function Reveal({
  children,
  className,
  delay = 0,
  blur = false,
  as,
  once = true,
}: RevealProps) {
  const Tag =
    (as ?? 'div') as ElementType

  const ref =
    useRef<HTMLElement | null>(
      null,
    )

  const [visible, setVisible] =
    useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                setVisible(true)

                if (once) {
                  observer.unobserve(
                    entry.target,
                  )
                }
              } else if (!once) {
                setVisible(false)
              }
            },
          )
        },
        {
          threshold: 0.2,
          rootMargin:
            '0px 0px -10% 0px',
        },
      )

    observer.observe(node)

    return () =>
      observer.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref}
      className={cn(
        blur
          ? 'reveal-blur'
          : 'reveal',
        visible &&
          'is-visible',
        className,
      )}
      style={{
        transitionDelay:
          `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}