import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Link variant definitions.
 */
const linkVariants = cva(
  'inline-flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
  {
    variants: {
      variant: {
        default: 'text-primary underline-offset-4 hover:underline',
        muted: 'text-muted-foreground underline-offset-4 hover:text-foreground hover:underline',
        plain: 'text-foreground hover:text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

/** Props for the Link component. */
export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  /** Force external link behavior. Auto-detected from href if not set. */
  external?: boolean
}

/**
 * Styled anchor with variant support. Automatically detects external links
 * and adds target="_blank" with an external link icon.
 *
 * @example
 * ```tsx
 * <Link href="/about">About</Link>
 * <Link href="https://example.com">External</Link>
 * <Link variant="muted" href="/settings">Settings</Link>
 * ```
 */
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, external, href, children, ...props }, ref) => {
    const isExternal =
      external !== undefined
        ? external
        : href
          ? href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')
          : false

    return (
      <a
        ref={ref}
        href={href}
        className={cn(linkVariants({ variant }), className)}
        {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
        {...props}
      >
        {children}
        {isExternal && (
          <svg
            className="h-3 w-3 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        )}
      </a>
    )
  }
)
Link.displayName = 'Link'

export { Link, linkVariants }
