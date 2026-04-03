import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/* ---------------------------------- Context --------------------------------- */

interface FieldContextValue {
  id: string
  error?: string
}

const FieldContext = React.createContext<FieldContextValue | undefined>(undefined)

function useFieldContext() {
  return React.useContext(FieldContext)
}

/* -------------------------------- Variants --------------------------------- */

const fieldVariants = cva('grid gap-2', {
  variants: {
    variant: {
      default: 'grid-cols-1',
      horizontal: 'grid-cols-[auto_1fr] items-center gap-x-4',
      inline: 'flex items-center gap-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

/* ---------------------------------- Root ----------------------------------- */

/** Props for the Field component. */
export interface FieldProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof fieldVariants> {
  /** Unique ID for linking label/input/error. Auto-generated if not provided. */
  fieldId?: string
  /** Error message to display. */
  error?: string
}

/**
 * Form field container that links label, input, description, and error message.
 *
 * @example
 * ```tsx
 * <Field error={errors.email}>
 *   <FieldLabel>Email</FieldLabel>
 *   <input id="email" type="email" />
 *   <FieldDescription>We will never share your email.</FieldDescription>
 *   <FieldError />
 * </Field>
 * ```
 */
const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, variant, fieldId, error, children, ...props }, ref) => {
    const generatedId = React.useId()
    const id = fieldId ?? generatedId

    return (
      <FieldContext.Provider value={{ id, error }}>
        <div ref={ref} className={cn(fieldVariants({ variant }), className)} {...props}>
          {children}
        </div>
      </FieldContext.Provider>
    )
  }
)
Field.displayName = 'Field'

/* ---------------------------------- Label ---------------------------------- */

/** Props for FieldLabel. */
export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * Label for the field input. Auto-linked via htmlFor.
 */
const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, ...props }, ref) => {
    const ctx = useFieldContext()

    return (
      <label
        ref={ref}
        htmlFor={ctx?.id}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          ctx?.error && 'text-destructive',
          className
        )}
        {...props}
      />
    )
  }
)
FieldLabel.displayName = 'FieldLabel'

/* ------------------------------- Description ------------------------------- */

/**
 * Help text below the input.
 */
const FieldDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
FieldDescription.displayName = 'FieldDescription'

/* ---------------------------------- Error ---------------------------------- */

/** Props for FieldError. */
export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Override error message from context. */
  message?: string
}

/**
 * Error message display. Reads from Field context or accepts a message prop.
 */
const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, message, children, ...props }, ref) => {
    const ctx = useFieldContext()
    const errorMessage = message ?? ctx?.error

    if (!errorMessage && !children) return null

    return (
      <p
        ref={ref}
        role="alert"
        className={cn('text-sm font-medium text-destructive', className)}
        {...props}
      >
        {children ?? errorMessage}
      </p>
    )
  }
)
FieldError.displayName = 'FieldError'

export { Field, FieldLabel, FieldDescription, FieldError, fieldVariants }
