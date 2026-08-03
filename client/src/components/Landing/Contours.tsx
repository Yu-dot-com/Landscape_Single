import { cn } from '../../utils/utils'

type ContoursProps = {
  className?: string
  variant?: 'a' | 'b'
}

export function Contours({
  className,
  variant = 'a',
}: ContoursProps) {
  const paths =
    variant === 'a'
      ? CONTOURS_A
      : CONTOURS_B

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 600"
      fill="none"
      className={cn(
        'h-full w-full',
        className,
      )}
      preserveAspectRatio="xMidYMid slice"
    >
      {paths.map(
        (d, i) => (
          <path
            key={i}
            d={d}
            stroke="currentColor"
            strokeWidth={1}
            strokeOpacity={
              0.5 - i * 0.03
            }
            fill="none"
          />
        ),
      )}
    </svg>
  )
}

const CONTOURS_A = [
  'M300 90c120 0 210 90 210 210s-90 210-210 210S90 420 90 300 180 90 300 90Z',

  'M300 140c92 0 160 68 160 160s-68 160-160 160-160-68-160-160 68-160 160-160Z',

  'M300 190c64 0 110 46 110 110s-46 110-110 110-110-46-110-110 46-110 110-110Z',

  'M300 240c36 0 60 24 60 60s-24 60-60 60-60-24-60-60 24-60 60-60Z',

  'M300 285c14 0 25 11 25 25s-11 25-25 25-25-11-25-25 11-25 25-25Z',
]

const CONTOURS_B = [
  'M80 300c40-120 200-150 300-90s180 40 140 180-200 150-300 90-180-60-140-180Z',

  'M130 300c34-92 170-116 250-70s150 30 116 138-170 116-250 70-150-46-116-138Z',

  'M180 300c28-64 140-82 200-50s120 20 92 96-140 82-200 50-120-32-92-96Z',

  'M235 300c18-36 90-46 128-28s76 12 58 60-90 46-128 28-76-24-58-60Z',
]