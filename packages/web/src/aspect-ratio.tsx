import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Props for the AspectRatio component. */
export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio value. Can be a number (e.g. 16/9) or a string (e.g. "16/9"). */
  ratio?: number | string
}

/**
 * Constrain children to a specific aspect ratio.
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <img src="/hero.jpg" className="object-cover w-full h-full" />
 * </AspectRatio>
 * <AspectRatio ratio={1}>
 *   <div className="flex items-center justify-center h-full">Square</div>
 * </AspectRatio>
 * ```
 */
const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = 1, style, children, ...props }, ref) => {
    const aspectValue = typeof ratio === 'number' ? String(ratio) : ratio

    return (
      <div
        ref={ref}
        className={cn('relative w-full', className)}
        style={{
          aspectRatio: aspectValue,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
AspectRatio.displayName = 'AspectRatio'

export { AspectRatio }
