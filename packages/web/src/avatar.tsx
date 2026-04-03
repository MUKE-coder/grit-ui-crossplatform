import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Avatar size variants.
 */
const avatarVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

/** Props for the Avatar component. */
export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /** Image source URL. */
  src?: string
  /** Alt text for the image. */
  alt?: string
  /** Fallback initials (e.g. "JD" for John Doe). */
  fallback?: string
  /** Fallback icon element rendered when no src or fallback text. */
  fallbackIcon?: React.ReactNode
}

/**
 * Avatar with image, initials fallback, or icon fallback.
 *
 * @example
 * ```tsx
 * <Avatar src="/photo.jpg" alt="User" size="lg" />
 * <Avatar fallback="JD" size="md" />
 * ```
 */
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, fallbackIcon, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false)

    const showImage = src && !imgError

    return (
      <div ref={ref} className={cn(avatarVariants({ size }), className)} {...props}>
        {showImage ? (
          <img
            src={src}
            alt={alt || ''}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : fallback ? (
          <span className="font-medium text-muted-foreground select-none">{fallback}</span>
        ) : fallbackIcon ? (
          <span className="text-muted-foreground">{fallbackIcon}</span>
        ) : (
          <svg className="h-[60%] w-[60%] text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

/** Props for the AvatarGroup component. */
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum number of avatars to display before showing +N. */
  max?: number
}

/**
 * Stack multiple avatars with overlap.
 *
 * @example
 * ```tsx
 * <AvatarGroup max={3}>
 *   <Avatar src="/a.jpg" />
 *   <Avatar src="/b.jpg" />
 *   <Avatar src="/c.jpg" />
 *   <Avatar src="/d.jpg" />
 * </AvatarGroup>
 * ```
 */
const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max, children, ...props }, ref) => {
    const childArray = React.Children.toArray(children)
    const visibleChildren = max ? childArray.slice(0, max) : childArray
    const excess = max ? childArray.length - max : 0

    return (
      <div ref={ref} className={cn('flex -space-x-3', className)} {...props}>
        {visibleChildren.map((child, i) => (
          <div key={i} className="ring-2 ring-background rounded-full">
            {child}
          </div>
        ))}
        {excess > 0 && (
          <div className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-2 ring-background">
            <span className="text-xs font-medium text-muted-foreground">+{excess}</span>
          </div>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = 'AvatarGroup'

export { Avatar, avatarVariants, AvatarGroup }
