import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Shimmer shape variants.
 */
const shimmerVariants = cva(
  'animate-pulse rounded-md bg-muted',
  {
    variants: {
      shape: {
        line: 'h-4 w-full',
        circle: 'rounded-full',
        rectangle: 'h-20 w-full',
        card: 'h-40 w-full rounded-lg',
        'table-row': 'h-12 w-full',
      },
    },
    defaultVariants: {
      shape: 'line',
    },
  }
)

/** Props for the Shimmer component. */
export interface ShimmerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof shimmerVariants> {
  /** Width override (CSS value). */
  width?: string | number
  /** Height override (CSS value). */
  height?: string | number
  /** Number of shimmer elements to render. */
  count?: number
  /** Gap between multiple shimmers in pixels. */
  gap?: number
}

/**
 * Animated loading shimmer/skeleton effect.
 *
 * @example
 * ```tsx
 * <Shimmer shape="line" count={3} />
 * <Shimmer shape="circle" width={48} height={48} />
 * <Shimmer shape="card" />
 * <Shimmer shape="table-row" count={5} />
 * ```
 */
const Shimmer = React.forwardRef<HTMLDivElement, ShimmerProps>(
  ({ className, shape, width, height, count = 1, gap = 8, style, ...props }, ref) => {
    const sizeStyle: React.CSSProperties = {
      ...(width != null ? { width: typeof width === 'number' ? width + 'px' : width } : {}),
      ...(height != null ? { height: typeof height === 'number' ? height + 'px' : height } : {}),
      ...style,
    }

    if (count <= 1) {
      return (
        <div
          ref={ref}
          className={cn(shimmerVariants({ shape }), className)}
          style={sizeStyle}
          {...props}
        />
      )
    }

    return (
      <div ref={ref} className="flex flex-col" style={{ gap }}>
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={cn(shimmerVariants({ shape }), className)}
            style={sizeStyle}
            {...props}
          />
        ))}
      </div>
    )
  }
)
Shimmer.displayName = 'Shimmer'

export { Shimmer, shimmerVariants }
