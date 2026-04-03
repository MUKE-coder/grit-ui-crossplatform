import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Item size variants.
 */
const itemVariants = cva(
  'flex items-center gap-3 rounded-md transition-colors',
  {
    variants: {
      size: {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
        xl: 'px-4 py-4 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

/** Props for the Item component. */
export interface ItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemVariants> {
  /** Leading icon or element. */
  icon?: React.ReactNode
  /** Primary title text. */
  title: string
  /** Secondary description text. */
  description?: string
  /** Trailing action element (button, icon, etc.). */
  trailing?: React.ReactNode
}

/**
 * List item with icon, title, description, and trailing action.
 *
 * @example
 * ```tsx
 * <Item
 *   icon={<UserIcon />}
 *   title="John Doe"
 *   description="john@example.com"
 *   trailing={<Button size="sm">Edit</Button>}
 *   size="md"
 * />
 * ```
 */
const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, size, icon, title, description, trailing, ...props }, ref) => (
    <div ref={ref} className={cn(itemVariants({ size }), className)} {...props}>
      {icon && <span className="shrink-0 text-muted-foreground [&_svg]:size-5">{icon}</span>}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-medium text-foreground truncate">{title}</span>
        {description && <span className="text-muted-foreground truncate text-[0.85em]">{description}</span>}
      </div>
      {trailing && <span className="shrink-0 ml-auto">{trailing}</span>}
    </div>
  )
)
Item.displayName = 'Item'

export { Item, itemVariants }
