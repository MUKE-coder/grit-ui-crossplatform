import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/** Available animation types. */
export type AnimationType =
  | 'fadeIn'
  | 'fadeOut'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'scaleOut'
  | 'bounce'
  | 'spin'

/**
 * Animate variant definitions using CVA.
 */
const animateVariants = cva('', {
  variants: {
    fillMode: {
      none: '[animation-fill-mode:none]',
      forwards: '[animation-fill-mode:forwards]',
      backwards: '[animation-fill-mode:backwards]',
      both: '[animation-fill-mode:both]',
    },
  },
  defaultVariants: {
    fillMode: 'both',
  },
})

/** Keyframes mapping. */
const KEYFRAMES: Record<AnimationType, string> = {
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

/** Props for the Animate component. */
export interface AnimateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof animateVariants> {
  /** Animation type. */
  animation: AnimationType
  /** Duration in milliseconds. Default 300. */
  duration?: number
  /** Delay in milliseconds. Default 0. */
  delay?: number
  /** Easing function. Default 'ease-out'. */
  easing?: string
  /** Number of iterations. Default 1. Use Infinity for infinite. */
  iterations?: number
  /** Whether to play the animation. Default true. */
  play?: boolean
  /** Render as inline element. */
  inline?: boolean
}

/**
 * CSS animation wrapper component.
 * Supports fadeIn, fadeOut, slideUp, slideDown, slideLeft, slideRight,
 * scaleIn, scaleOut, bounce, and spin animations.
 *
 * @example
 * ```tsx
 * <Animate animation="fadeIn" duration={500}>
 *   <p>This fades in</p>
 * </Animate>
 * <Animate animation="spin" iterations={Infinity}>
 *   <LoadingIcon />
 * </Animate>
 * ```
 */
const Animate = React.forwardRef<HTMLDivElement, AnimateProps>(
  (
    {
      className,
      fillMode,
      animation,
      duration = 300,
      delay = 0,
      easing = 'ease-out',
      iterations = 1,
      play = true,
      inline = false,
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

    const iterationCount = iterations === Infinity ? 'infinite' : String(iterations)

    const animationStyle: React.CSSProperties = play
      ? {
          animation: 'grit-' + animation + ' ' + duration + 'ms ' + easing + ' ' + delay + 'ms ' + iterationCount,
        }
      : {}

    const Tag = inline ? 'span' : 'div'

    return (
      <Tag
        ref={ref as any}
        className={cn(animateVariants({ fillMode }), className)}
        style={animationStyle}
        {...props}
      >
        {children}
      </Tag>
    )
  }
)
Animate.displayName = 'Animate'

export { Animate, animateVariants }
