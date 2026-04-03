import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'
import type { AnimationType } from './animate'

/**
 * AnimateGroup variant definitions using CVA.
 */
const animateGroupVariants = cva('', {
  variants: {
    layout: {
      default: '',
      flex: 'flex',
      grid: 'grid',
    },
  },
  defaultVariants: {
    layout: 'default',
  },
})

/** Keyframes mapping (duplicated to avoid cross-file side effects). */
const KEYFRAMES: Record<string, string> = {
  fadeIn: '@keyframes grit-fadeIn { from { opacity: 0; } to { opacity: 1; } }',
  fadeOut: '@keyframes grit-fadeOut { from { opacity: 1; } to { opacity: 0; } }',
  slideUp: '@keyframes grit-slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }',
  slideDown: '@keyframes grit-slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }',
  slideLeft: '@keyframes grit-slideLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }',
  slideRight: '@keyframes grit-slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }',
  scaleIn: '@keyframes grit-scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }',
  scaleOut: '@keyframes grit-scaleOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.9); } }',
  bounce: '@keyframes grit-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }',
  spin: '@keyframes grit-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }',
}

/** Props for the AnimateGroup component. */
export interface AnimateGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof animateGroupVariants> {
  /** Animation type applied to each child. */
  animation: AnimationType
  /** Duration in milliseconds per child. Default 300. */
  duration?: number
  /** Base delay before the first child animates (ms). Default 0. */
  baseDelay?: number
  /** Stagger delay between each child (ms). Default 100. */
  stagger?: number
  /** Easing function. Default 'ease-out'. */
  easing?: string
  /** Whether to play the animations. Default true. */
  play?: boolean
}

/**
 * Staggered animation group. Each child animates with an increasing delay.
 *
 * @example
 * ```tsx
 * <AnimateGroup animation="slideUp" stagger={100}>
 *   <div>First (0ms delay)</div>
 *   <div>Second (100ms delay)</div>
 *   <div>Third (200ms delay)</div>
 * </AnimateGroup>
 * ```
 */
const AnimateGroup = React.forwardRef<HTMLDivElement, AnimateGroupProps>(
  (
    {
      className,
      layout,
      animation,
      duration = 300,
      baseDelay = 0,
      stagger = 100,
      easing = 'ease-out',
      play = true,
      children,
      ...props
    },
    ref
  ) => {
    // Inject keyframes
    React.useEffect(() => {
      if (typeof document === 'undefined') return
      const id = 'grit-anim-' + animation
      if (document.getElementById(id)) return
      const style = document.createElement('style')
      style.id = id
      style.textContent = KEYFRAMES[animation]
      document.head.appendChild(style)
    }, [animation])

    const childArray = React.Children.toArray(children)

    return (
      <div ref={ref} className={cn(animateGroupVariants({ layout }), className)} {...props}>
        {childArray.map((child, i) => {
          const delay = baseDelay + i * stagger
          const animStyle: React.CSSProperties = play
            ? {
                animation: 'grit-' + animation + ' ' + duration + 'ms ' + easing + ' ' + delay + 'ms both',
              }
            : { opacity: 0 }

          return (
            <div key={i} style={animStyle}>
              {child}
            </div>
          )
        })}
      </div>
    )
  }
)
AnimateGroup.displayName = 'AnimateGroup'

export { AnimateGroup, animateGroupVariants }
