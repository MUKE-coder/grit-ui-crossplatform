import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Props for the Footer component. */
export interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * Page footer container with a flexible columns layout.
 *
 * @example
 * ```tsx
 * <Footer>
 *   <FooterColumn title="Product">
 *     <a href="/features">Features</a>
 *     <a href="/pricing">Pricing</a>
 *   </FooterColumn>
 *   <FooterColumn title="Company">
 *     <a href="/about">About</a>
 *   </FooterColumn>
 * </Footer>
 * ```
 */
const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(
        'border-t border-border bg-background',
        className
      )}
      {...props}
    />
  )
)
Footer.displayName = 'Footer'

/** Props for FooterColumn. */
export interface FooterColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column heading. */
  title?: string
}

/** A single column in the footer layout. */
const FooterColumn = React.forwardRef<HTMLDivElement, FooterColumnProps>(
  ({ className, title, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
      {title && <h4 className="text-sm font-semibold text-foreground">{title}</h4>}
      <div className="flex flex-col gap-1.5 text-sm text-muted-foreground [&_a]:transition-colors [&_a:hover]:text-foreground">
        {children}
      </div>
    </div>
  )
)
FooterColumn.displayName = 'FooterColumn'

export { Footer, FooterColumn }
