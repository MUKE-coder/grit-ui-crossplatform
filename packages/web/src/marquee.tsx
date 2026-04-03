import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Marquee variant definitions using CVA.
 */
const marqueeVariants = cva('overflow-hidden', {
  variants: {
    direction: {
      left: '',
      right: '',
      up: '',
      down: '',
    },
  },
  defaultVariants: {
    direction: 'left',
  },
})

/** Props for the Marquee component. */
export interface MarqueeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof marqueeVariants> {
  /** Animation speed in seconds for one full loop. Default 20. */
  speed?: number
  /** Pause animation on hover. */
  pauseOnHover?: boolean
  /** Number of content duplications for seamless loop. Default 2. */
  repeat?: number
  /** Reverse the animation direction. */
  reverse?: boolean
  /** Gap between repeated content. */
  gap?: string
}

/**
 * Scrolling marquee component for text or any content.
 * Supports horizontal (left/right) and vertical (up/down) directions,
 * customizable speed, and pause on hover.
 *
 * @example
 * ```tsx
 * <Marquee speed={15} pauseOnHover>
 *   <span className="mx-4">Breaking News</span>
 *   <span className="mx-4">Latest Updates</span>
 * </Marquee>
 *
 * <Marquee direction="up" speed={10}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Marquee>
 * ```
 */
const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      className,
      direction = 'left',
      speed = 20,
      pauseOnHover = false,
      repeat = 2,
      reverse = false,
      gap = '0px',
      children,
      ...props
    },
    ref
  ) => {
    const isHorizontal = direction === 'left' || direction === 'right'
    const isReversed = (direction === 'right' || direction === 'down') !== reverse

    const keyframes = isHorizontal
      ? isReversed
        ? 'marquee-reverse-x'
        : 'marquee-x'
      : isReversed
        ? 'marquee-reverse-y'
        : 'marquee-y'

    const styleId = 'grit-marquee-keyframes'

    // Inject keyframes once
    React.useEffect(() => {
      if (typeof document === 'undefined') return
      if (document.getElementById(styleId)) return
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = [
        '@keyframes marquee-x { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }',
        '@keyframes marquee-reverse-x { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }',
        '@keyframes marquee-y { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }',
        '@keyframes marquee-reverse-y { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }',
      ].join('\n')
      document.head.appendChild(style)
    }, [])

    const copies = Array.from({ length: repeat }, (_, i) => (
      <div key={i} className={cn(isHorizontal ? 'flex shrink-0 items-center' : 'shrink-0')} style={{ gap }}>
        {children}
      </div>
    ))

    return (
      <div
        ref={ref}
        className={cn(marqueeVariants({ direction }), className)}
        {...props}
      >
        <div
          className={cn(
            isHorizontal ? 'flex' : 'flex flex-col',
            pauseOnHover && 'hover:[animation-play-state:paused]'
          )}
          style={{
            animation: keyframes + ' ' + speed + 's linear infinite',
            gap,
          }}
        >
          {copies}
        </div>
      </div>
    )
  }
)
Marquee.displayName = 'Marquee'

export { Marquee, marqueeVariants }
