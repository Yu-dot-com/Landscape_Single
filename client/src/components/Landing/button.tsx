import { Button as ButtonPrimitive } from '@base-ui/react/button'
import {
  cva,
  type VariantProps,
} from 'class-variance-authority'
import { useState, type CSSProperties } from 'react'

import { cn } from '../../utils/utils'

const buttonVariants = cva(
  [
    'group/button inline-flex shrink-0 items-center justify-center',
    'rounded-full border text-sm font-medium whitespace-nowrap',
    'transition-transform duration-300 ease-out',
    'outline-none select-none',
    'active:translate-y-px',
    'disabled:pointer-events-none disabled:opacity-50',

    // Accessibility
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-[#96c2a0]',
    'focus-visible:ring-offset-2',
    'focus-visible:ring-offset-transparent',

    // SVG
    '[&_svg]:pointer-events-none',
    '[&_svg]:shrink-0',
    "[&_svg:not([class*='size-'])]:size-4",
  ].join(' '),

  {
    variants: {
      variant: {
        default: '',
        outline: '',
        secondary: '',
        ghost: '',
        destructive: '',
        link: '',
      },

      size: {
        default: 'h-10 gap-2 px-5',
        xs: 'h-7 gap-1 rounded-full px-2.5 text-xs',
        sm: 'h-8 gap-1.5 rounded-full px-3.5 text-sm',
        lg: 'h-12 gap-2 px-7 text-base',
        icon: 'size-10',
        'icon-xs': 'size-7',
        'icon-sm': 'size-8',
        'icon-lg': 'size-12',
      },
    },

    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type Variant = 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'

const BASE_STYLES: Record<Variant, CSSProperties> = {
  default: {
    borderColor: '#2d2c28',
    backgroundColor: '#2d2c28',
    color: '#f6f5ef',
  },
  outline: {
    borderColor: '#2d2c28',
    backgroundColor: 'transparent',
    color: '#2d2c28',
  },
  secondary: {
    borderColor: '#d8d7ce',
    backgroundColor: '#edece5',
    color: '#2d2c28',
  },
  ghost: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    color: '#78786e',
  },
  destructive: {
    borderColor: 'rgba(248, 113, 113, 0.3)',
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    color: '#dc2626',
  },
  link: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    color: '#608068',
  },
}

const HOVER_STYLES: Partial<Record<Variant, CSSProperties>> = {
  default: {
    borderColor: '#608068',
    backgroundColor: '#608068',
    color: '#f6f5ef',
    transform: 'translateY(-2px)',
  },
  outline: {
    borderColor: '#608068',
    backgroundColor: '#608068',
    color: '#f6f5ef',
    transform: 'translateY(-2px)',
  },
  secondary: {
    borderColor: '#608068',
    backgroundColor: '#608068',
    color: '#f6f5ef',
    transform: 'translateY(-2px)',
  },
  ghost: {
    backgroundColor: 'rgba(96, 128, 104, 0.1)',
    color: '#2d2c28',
  },
  destructive: {
    backgroundColor: 'rgba(248, 113, 113, 0.2)',
    borderColor: 'rgba(248, 113, 113, 0.5)',
  },
  link: {},
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants>) {
  const v = (variant ?? 'default') as Variant
  const [hovered, setHovered] = useState(false)

  const mergedStyle: CSSProperties = {
    ...BASE_STYLES[v],
    ...(hovered ? HOVER_STYLES[v] : null),
    ...style,
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className,
      )}
      style={mergedStyle}
      onMouseEnter={(e) => {
        setHovered(true)
        onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        setHovered(false)
        onMouseLeave?.(e)
      }}
      {...props}
    />
  )
}

export {
  Button,
  buttonVariants,
}