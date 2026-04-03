import * as React from 'react'
import { cn } from '@grit-ui/core'

/* ---------------------------------- Context --------------------------------- */

interface FormFieldContextValue {
  name: string
}

const FormFieldContext = React.createContext<FormFieldContextValue | undefined>(undefined)

interface FormItemContextValue {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue | undefined>(undefined)

function useFormField() {
  const fieldCtx = React.useContext(FormFieldContext)
  const itemCtx = React.useContext(FormItemContext)
  return {
    name: fieldCtx?.name ?? '',
    id: itemCtx?.id ?? '',
    formItemId: itemCtx ? itemCtx.id + '-form-item' : '',
    formDescriptionId: itemCtx ? itemCtx.id + '-form-item-description' : '',
    formMessageId: itemCtx ? itemCtx.id + '-form-item-message' : '',
  }
}

/* ---------------------------------- Root ----------------------------------- */

/** Props for the Form component. */
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

/**
 * Form wrapper that prevents default submit behavior.
 * Designed to work with react-hook-form but usable standalone.
 *
 * @example
 * ```tsx
 * <Form onSubmit={handleSubmit(onSubmit)}>
 *   <FormField name="email">
 *     <FormItem>
 *       <FormLabel>Email</FormLabel>
 *       <FormControl>
 *         <input {...register("email")} />
 *       </FormControl>
 *       <FormDescription>Enter your email address.</FormDescription>
 *       <FormMessage />
 *     </FormItem>
 *   </FormField>
 * </Form>
 * ```
 */
const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ onSubmit, ...props }, ref) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      onSubmit?.(e)
    }

    return <form ref={ref} onSubmit={handleSubmit} {...props} />
  }
)
Form.displayName = 'Form'

/* --------------------------------- FormField ------------------------------- */

/** Props for FormField. */
export interface FormFieldProps {
  /** Field name — used for linking labels and errors. */
  name: string
  children: React.ReactNode
}

/**
 * Wraps a form item with field name context.
 */
function FormField({ name, children }: FormFieldProps) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      {children}
    </FormFieldContext.Provider>
  )
}
FormField.displayName = 'FormField'

/* --------------------------------- FormItem -------------------------------- */

/**
 * Container for a single form field (label + control + description + message).
 */
const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = 'FormItem'

/* --------------------------------- FormLabel -------------------------------- */

/**
 * Label for the form control. Auto-linked via htmlFor.
 */
const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    const { formItemId } = useFormField()

    return (
      <label
        ref={ref}
        htmlFor={formItemId}
        className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
        {...props}
      />
    )
  }
)
FormLabel.displayName = 'FormLabel'

/* ------------------------------- FormControl ------------------------------- */

/**
 * Wraps the actual input element, adding aria attributes.
 */
const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => {
    const { formItemId, formDescriptionId, formMessageId } = useFormField()

    return (
      <div
        ref={ref}
        id={formItemId}
        aria-describedby={formDescriptionId + ' ' + formMessageId}
        {...props}
      />
    )
  }
)
FormControl.displayName = 'FormControl'

/* ----------------------------- FormDescription ----------------------------- */

/**
 * Help text for the form field.
 */
const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField()

    return (
      <p
        ref={ref}
        id={formDescriptionId}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      />
    )
  }
)
FormDescription.displayName = 'FormDescription'

/* ------------------------------- FormMessage -------------------------------- */

/** Props for FormMessage. */
export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Error message to display. */
  message?: string
}

/**
 * Error message for the form field.
 */
const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, message, children, ...props }, ref) => {
    const { formMessageId } = useFormField()
    const body = children ?? message

    if (!body) return null

    return (
      <p
        ref={ref}
        id={formMessageId}
        role="alert"
        className={cn('text-sm font-medium text-destructive', className)}
        {...props}
      >
        {body}
      </p>
    )
  }
)
FormMessage.displayName = 'FormMessage'

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
}
