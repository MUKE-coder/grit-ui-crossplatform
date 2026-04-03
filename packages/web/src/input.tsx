import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Input variant definitions using CVA.
 */
const inputVariants = cva(
  'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input focus-visible:ring-ring',
        error: 'border-destructive focus-visible:ring-destructive text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

/** Props for the Input component. */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    VariantProps<typeof inputVariants> {
  /** Input type. */
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel'
  /** Icon or element rendered before the input. */
  prefixIcon?: React.ReactNode
  /** Icon or element rendered after the input. */
  suffixIcon?: React.ReactNode
}

/**
 * Text input component with icon prefix/suffix slots.
 *
 * @example
 * ```tsx
 * <Input type="email" placeholder="you@example.com" />
 * <Input variant="error" prefixIcon={<MailIcon />} />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type = 'text', prefixIcon, suffixIcon, ...props }, ref) => {
    if (prefixIcon || suffixIcon) {
      return (
        <div className="relative flex items-center">
          {prefixIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-muted-foreground [&_svg]:size-4">
              {prefixIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              inputVariants({ variant }),
              prefixIcon && 'pl-10',
              suffixIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {suffixIcon && (
            <div className="pointer-events-none absolute right-3 flex items-center text-muted-foreground [&_svg]:size-4">
              {suffixIcon}
            </div>
          )}
        </div>
      )
    }

    return (
      <input
        ref={ref}
        type={type}
        className={cn(inputVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
