import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Skeleton shape variants.
 */
const skeletonVariants = cva('animate-pulse bg-muted', {
  variants: {
    shape: {
      rectangle: 'rounded-md',
      circle: 'rounded-full',
      text: 'rounded-md h-4 w-full',
    },
  },
  defaultVariants: {
    shape: 'rectangle',
  },
})

/** Props for the Skeleton component. */
export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

/**
 * Loading placeholder with pulse animation.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-12 w-12" shape="circle" />
 * <Skeleton className="h-4 w-[250px]" shape="text" />
 * <Skeleton className="h-32 w-full" shape="rectangle" />
 * ```
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, shape, ...props }, ref) => (
    <div ref={ref} className={cn(skeletonVariants({ shape }), className)} {...props} />
  )
)
Skeleton.displayName = 'Skeleton'

export { Skeleton, skeletonVariants }
