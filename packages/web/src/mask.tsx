import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Mask variant definitions using CVA.
 */
const maskVariants = cva('relative overflow-hidden', {
  variants: {
    preset: {
      none: '',
      'fade-top': '',
      'fade-bottom': '',
      'fade-left': '',
      'fade-right': '',
      'fade-both-x': '',
      'fade-both-y': '',
      circle: '',
      ellipse: '',
      diamond: '',
      'rounded-rect': '',
    },
  },
  defaultVariants: {
    preset: 'none',
  },
})

/** Preset mask image values. */
const PRESET_MASKS: Record<string, string> = {
  'fade-top': 'linear-gradient(to bottom, transparent, black 20%)',
  'fade-bottom': 'linear-gradient(to top, transparent, black 20%)',
  'fade-left': 'linear-gradient(to right, transparent, black 20%)',
  'fade-right': 'linear-gradient(to left, transparent, black 20%)',
  'fade-both-x': 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
  'fade-both-y': 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
  circle: 'radial-gradient(circle, black 50%, transparent 51%)',
  ellipse: 'radial-gradient(ellipse, black 50%, transparent 51%)',
  diamond: 'linear-gradient(45deg, transparent 30%, black 30%, black 70%, transparent 70%)',
  'rounded-rect': 'linear-gradient(black, black)',
}

/** Props for the Mask component. */
export interface MaskProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof maskVariants> {
  /** Custom CSS mask-image value. Overrides preset. */
  maskImage?: string
  /** Mask size. Default 'cover'. */
  maskSize?: string
  /** Mask position. Default 'center'. */
  maskPosition?: string
  /** Mask repeat. Default 'no-repeat'. */
  maskRepeat?: string
  /** Fade amount for gradient presets (0-100). Default 20. */
  fadeAmount?: number
}

/**
 * CSS mask utility component for applying gradient masks, shape masks,
 * and custom mask images to content.
 *
 * @example
 * ```tsx
 * <Mask preset="fade-bottom">
 *   <img src="/hero.jpg" alt="Hero" />
 * </Mask>
 *
 * <Mask preset="circle">
 *   <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-64 h-64" />
 * </Mask>
 *
 * <Mask maskImage="url('/custom-mask.svg')">
 *   <p>Custom masked content</p>
 * </Mask>
 * ```
 */
const Mask = React.forwardRef<HTMLDivElement, MaskProps>(
  (
    {
      className,
      preset = 'none',
      maskImage: customMaskImage,
      maskSize = 'cover',
      maskPosition = 'center',
      maskRepeat = 'no-repeat',
      fadeAmount = 20,
      children,
      style,
      ...props
    },
    ref
  ) => {
    let resolvedMask = customMaskImage

    if (!resolvedMask && preset && preset !== 'none') {
      // Generate preset with custom fade amount
      switch (preset) {
        case 'fade-top':
          resolvedMask = 'linear-gradient(to bottom, transparent, black ' + fadeAmount + '%)'
          break
        case 'fade-bottom':
          resolvedMask = 'linear-gradient(to top, transparent, black ' + fadeAmount + '%)'
          break
        case 'fade-left':
          resolvedMask = 'linear-gradient(to right, transparent, black ' + fadeAmount + '%)'
          break
        case 'fade-right':
          resolvedMask = 'linear-gradient(to left, transparent, black ' + fadeAmount + '%)'
          break
        case 'fade-both-x':
          resolvedMask = 'linear-gradient(to right, transparent, black ' + fadeAmount + '%, black ' + (100 - fadeAmount) + '%, transparent)'
          break
        case 'fade-both-y':
          resolvedMask = 'linear-gradient(to bottom, transparent, black ' + fadeAmount + '%, black ' + (100 - fadeAmount) + '%, transparent)'
          break
        default:
          resolvedMask = PRESET_MASKS[preset] || undefined
          break
      }
    }

    const maskStyle: React.CSSProperties = resolvedMask
      ? {
          WebkitMaskImage: resolvedMask,
          maskImage: resolvedMask,
          WebkitMaskSize: maskSize,
          maskSize: maskSize,
          WebkitMaskPosition: maskPosition,
          maskPosition: maskPosition,
          WebkitMaskRepeat: maskRepeat,
          maskRepeat: maskRepeat,
        }
      : {}

    return (
      <div
        ref={ref}
        className={cn(maskVariants({ preset }), className)}
        style={{ ...maskStyle, ...style }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Mask.displayName = 'Mask'

export { Mask, maskVariants }
