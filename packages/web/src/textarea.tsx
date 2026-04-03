import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Textarea variant definitions using CVA.
 */
const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input focus-visible:ring-ring',
        error: 'border-destructive focus-visible:ring-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

/** Props for the Textarea component. */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  /** Enable auto-resizing based on content. */
  autoResize?: boolean
  /** Show a character counter when maxLength is set. */
  showCounter?: boolean
}

/**
 * Multiline text input with optional auto-resize and character counter.
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Your message..." autoResize />
 * <Textarea maxLength={500} showCounter />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, autoResize = false, showCounter = false, maxLength, onChange, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null)
    const [charCount, setCharCount] = React.useState(0)

    React.useImperativeHandle(ref, () => innerRef.current!)

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (autoResize && innerRef.current) {
          innerRef.current.style.height = 'auto'
          innerRef.current.style.height = innerRef.current.scrollHeight + 'px'
        }
        setCharCount(e.target.value.length)
        onChange?.(e)
      },
      [autoResize, onChange]
    )

    return (
      <div className="relative w-full">
        <textarea
          ref={innerRef}
          className={cn(
            textareaVariants({ variant }),
            autoResize && 'resize-none overflow-hidden',
            className
          )}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        {showCounter && maxLength && (
          <div className="mt-1 text-right text-xs text-muted-foreground">
            {charCount}/{maxLength}
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
