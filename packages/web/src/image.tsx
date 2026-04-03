import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Props for the Image component. */
export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Fallback content or URL shown on error. */
  fallback?: React.ReactNode
  /** Aspect ratio constraint (e.g. "16/9", "4/3", "1/1"). */
  aspectRatio?: string
  /** Show a loading skeleton while the image loads. */
  showLoading?: boolean
}

/**
 * Optimized image component with loading state, error fallback, and aspect ratio support.
 *
 * @example
 * ```tsx
 * <Image src="/photo.jpg" alt="Photo" aspectRatio="16/9" showLoading />
 * <Image src="/broken.jpg" fallback={<span>No image</span>} />
 * ```
 */
const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, src, alt, fallback, aspectRatio, showLoading = false, style, ...props }, ref) => {
    const [status, setStatus] = React.useState<'loading' | 'loaded' | 'error'>('loading')

    React.useEffect(() => {
      setStatus('loading')
    }, [src])

    const containerStyle: React.CSSProperties = {
      ...style,
      ...(aspectRatio ? { aspectRatio } : {}),
    }

    if (status === 'error' && fallback) {
      return (
        <div
          className={cn('flex items-center justify-center overflow-hidden rounded-md bg-muted', className)}
          style={containerStyle}
        >
          {typeof fallback === 'string' ? (
            <img src={fallback} alt={alt} className="h-full w-full object-cover" />
          ) : (
            fallback
          )}
        </div>
      )
    }

    return (
      <div className={cn('relative overflow-hidden', className)} style={containerStyle}>
        {showLoading && status === 'loading' && (
          <div className="absolute inset-0 animate-pulse bg-muted rounded-md" />
        )}
        <img
          ref={ref}
          src={src}
          alt={alt || ''}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300',
            status === 'loading' ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          {...props}
        />
      </div>
    )
  }
)
Image.displayName = 'Image'

export { Image }
