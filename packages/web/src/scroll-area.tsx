import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Props for the ScrollArea component. */
export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Scroll direction. Defaults to "vertical". */
  orientation?: 'vertical' | 'horizontal' | 'both'
  /** Maximum height of the scroll area. Required for vertical scrolling. */
  maxHeight?: string | number
  /** Maximum width of the scroll area. Required for horizontal scrolling. */
  maxWidth?: string | number
}

/**
 * Custom scrollbar container with styled thumb.
 * Uses native scrolling with CSS-styled scrollbars.
 *
 * @example
 * ```tsx
 * <ScrollArea maxHeight={400}>
 *   <div>Long content here...</div>
 * </ScrollArea>
 * <ScrollArea orientation="horizontal" maxWidth={600}>
 *   <div className="flex gap-4">...</div>
 * </ScrollArea>
 * ```
 */
const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, orientation = 'vertical', maxHeight, maxWidth, style, children, ...props }, ref) => {
    const overflowClass =
      orientation === 'both'
        ? 'overflow-auto'
        : orientation === 'horizontal'
          ? 'overflow-x-auto overflow-y-hidden'
          : 'overflow-y-auto overflow-x-hidden'

    return (
      <div
        ref={ref}
        className={cn(
          'relative',
          overflowClass,
          // Custom scrollbar styles via Tailwind arbitrary values
          '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2',
          '[&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border',
          '[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/30',
          className
        )}
        style={{
          maxHeight: maxHeight !== undefined ? (typeof maxHeight === 'number' ? maxHeight + 'px' : maxHeight) : undefined,
          maxWidth: maxWidth !== undefined ? (typeof maxWidth === 'number' ? maxWidth + 'px' : maxWidth) : undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }
