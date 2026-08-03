'use client'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import { cn } from '../../utils/utils'

const NODES = [
  { x: 80, y: 90 },
  { x: 260, y: 60 },
  { x: 430, y: 120 },
  { x: 150, y: 220 },
  { x: 330, y: 250 },
  { x: 470, y: 300 },
  { x: 90, y: 330 },
  { x: 250, y: 360 },
]

const CENTER = {
  x: 275,
  y: 210,
}

type ConvergeProps = {
  className?: string
}

export function Converge({
  className,
}: ConvergeProps) {
  const ref =
    useRef<SVGSVGElement | null>(
      null,
    )

  const [active, setActive] =
    useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          setActive(
            entry.isIntersecting,
          )
        },
        {
          threshold: 0.35,
        },
      )

    observer.observe(node)

    return () =>
      observer.disconnect()
  }, [])

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 550 420"
      fill="none"
      className={cn(
        'h-full w-full animate-pop-rotate text-(--landing-accent)',
        className,
      )}
    >
      {NODES.map(
        (node, i) => (
          <line
            key={`line-${i}`}
            x1={
              active
                ? CENTER.x
                : node.x
            }
            y1={
              active
                ? CENTER.y
                : node.y
            }
            x2={node.x}
            y2={node.y}
            stroke="currentColor"
            strokeWidth={1}
            strokeOpacity={
              active ? 0.4 : 0
            }
            style={{
              transition:
                `all 1.4s cubic-bezier(0.16,1,0.3,1) ${i * 90}ms`,
            }}
          />
        ),
      )}

      {NODES.map(
        (node, i) => (
          <circle
            key={`circle-${i}`}
            cx={
              active
                ? CENTER.x +
                  (node.x -
                    CENTER.x) *
                    0.55
                : node.x
            }
            cy={
              active
                ? CENTER.y +
                  (node.y -
                    CENTER.y) *
                    0.55
                : node.y
            }
            r={3.5}
            fill="currentColor"
            style={{
              transition:
                `all 1.4s cubic-bezier(0.16,1,0.3,1) ${i * 90}ms`,
            }}
          />
        ),
      )}

      <circle
        cx={CENTER.x}
        cy={CENTER.y}
        r={active ? 10 : 0}
        fill="currentColor"
        style={{
          transition:
            'r 1s cubic-bezier(0.16,1,0.3,1) 900ms',
        }}
      />
    </svg>
  )
}