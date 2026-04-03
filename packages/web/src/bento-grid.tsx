import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * BentoGrid layout variants.
 */
const bentoGridVariants = cva('grid gap-4', {
  variants: {
    layout: {
      '4': 'grid-cols-2 md:grid-cols-4',
      '5': 'grid-cols-2 md:grid-cols-3',
      '6': 'grid-cols-2 md:grid-cols-3',
    },
  },
  defaultVariants: {
    layout: '4',
  },
})

/** Props for BentoGrid. */
export interface BentoGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bentoGridVariants> {}

/**
 * CSS Grid layout for bento/dashboard card arrangements.
 *
 * @example
 * ```tsx
 * <BentoGrid layout="4">
 *   <BentoGridItem colSpan={2} rowSpan={2}>Feature card</BentoGridItem>
 *   <BentoGridItem>Card 2</BentoGridItem>
 *   <BentoGridItem>Card 3</BentoGridItem>
 * </BentoGrid>
 * ```
 */
const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, layout, ...props }, ref) => (
    <div ref={ref} className={cn(bentoGridVariants({ layout }), className)} {...props} />
  )
)
BentoGrid.displayName = 'BentoGrid'

/* ---------------------------------- Item ----------------------------------- */

/** Props for BentoGridItem. */
export interface BentoGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns this item spans. */
  colSpan?: 1 | 2 | 3
  /** Number of rows this item spans. */
  rowSpan?: 1 | 2 | 3
}

const colSpanClasses: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-1 md:col-span-2',
  3: 'col-span-1 md:col-span-3',
}

const rowSpanClasses: Record<number, string> = {
  1: 'row-span-1',
  2: 'row-span-1 md:row-span-2',
  3: 'row-span-1 md:row-span-3',
}

/**
 * Individual item within a BentoGrid. Supports spanning columns and rows.
 */
const BentoGridItem = React.forwardRef<HTMLDivElement, BentoGridItemProps>(
  ({ className, colSpan = 1, rowSpan = 1, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-shadow hover:shadow-md',
        colSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
BentoGridItem.displayName = 'BentoGridItem'

export { BentoGrid, BentoGridItem, bentoGridVariants }
