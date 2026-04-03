import * as React from 'react'
import { cn } from '@grit-ui/core'

/* ---------------------------------- Types ---------------------------------- */

/** Supported Zod-like schema field types for auto-generation. */
export type AutoFormFieldType = 'string' | 'number' | 'boolean' | 'enum' | 'date'

/** Schema field descriptor. */
export interface AutoFormFieldSchema {
  /** Field type determines which input to render. */
  type: AutoFormFieldType
  /** Display label. Defaults to the field key. */
  label?: string
  /** Placeholder text for string/number inputs. */
  placeholder?: string
  /** Description/help text. */
  description?: string
  /** Whether the field is required. */
  required?: boolean
  /** Default value. */
  defaultValue?: unknown
  /** Enum options (only for type 'enum'). */
  options?: string[]
}

/** Schema definition — maps field names to field descriptors. */
export type AutoFormSchema = Record<string, AutoFormFieldSchema>

/* ---------------------------------- Props ---------------------------------- */

/** Props for the AutoForm component. */
export interface AutoFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Schema describing the form fields. */
  schema: AutoFormSchema
  /** Callback with form values on submit. */
  onSubmit?: (values: Record<string, unknown>) => void
  /** Default values keyed by field name. */
  defaultValues?: Record<string, unknown>
  /** Label for the submit button. */
  submitLabel?: string
}

/**
 * Auto-generate a form from a schema definition.
 * Maps field types to appropriate HTML inputs.
 *
 * @example
 * ```tsx
 * const schema: AutoFormSchema = {
 *   name: { type: 'string', label: 'Name', required: true },
 *   age: { type: 'number', label: 'Age' },
 *   newsletter: { type: 'boolean', label: 'Subscribe to newsletter' },
 *   role: { type: 'enum', label: 'Role', options: ['admin', 'user', 'editor'] },
 *   birthday: { type: 'date', label: 'Birthday' },
 * }
 *
 * <AutoForm schema={schema} onSubmit={(values) => console.log(values)} />
 * ```
 */
const AutoForm = React.forwardRef<HTMLFormElement, AutoFormProps>(
  ({ className, schema, onSubmit, defaultValues = {}, submitLabel = 'Submit', ...props }, ref) => {
    const [values, setValues] = React.useState<Record<string, unknown>>(() => {
      const initial: Record<string, unknown> = {}
      for (const [key, field] of Object.entries(schema)) {
        initial[key] = defaultValues[key] ?? field.defaultValue ?? getDefaultForType(field.type)
      }
      return initial
    })

    const handleChange = (key: string, value: unknown) => {
      setValues((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      onSubmit?.(values)
    }

    return (
      <form ref={ref} onSubmit={handleSubmit} className={cn('space-y-4', className)} {...props}>
        {Object.entries(schema).map(([key, field]) => (
          <AutoFormField
            key={key}
            name={key}
            field={field}
            value={values[key]}
            onChange={(val) => handleChange(key, val)}
          />
        ))}
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {submitLabel}
        </button>
      </form>
    )
  }
)
AutoForm.displayName = 'AutoForm'

/* ---------------------------------- Field ---------------------------------- */

interface AutoFormFieldProps {
  name: string
  field: AutoFormFieldSchema
  value: unknown
  onChange: (value: unknown) => void
}

function AutoFormField({ name, field, value, onChange }: AutoFormFieldProps) {
  const id = React.useId()
  const label = field.label ?? name

  const inputClasses =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <div className="space-y-2">
      {field.type !== 'boolean' && (
        <label htmlFor={id} className="text-sm font-medium leading-none">
          {label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {field.type === 'string' && (
        <input
          id={id}
          type="text"
          name={name}
          placeholder={field.placeholder}
          required={field.required}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        />
      )}

      {field.type === 'number' && (
        <input
          id={id}
          type="number"
          name={name}
          placeholder={field.placeholder}
          required={field.required}
          value={(value as number) ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className={inputClasses}
        />
      )}

      {field.type === 'boolean' && (
        <div className="flex items-center space-x-2">
          <input
            id={id}
            type="checkbox"
            name={name}
            checked={(value as boolean) ?? false}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
          />
          <label htmlFor={id} className="text-sm font-medium leading-none">
            {label}
          </label>
        </div>
      )}

      {field.type === 'enum' && (
        <select
          id={id}
          name={name}
          required={field.required}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        >
          <option value="">{field.placeholder ?? 'Select...'}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {field.type === 'date' && (
        <input
          id={id}
          type="date"
          name={name}
          required={field.required}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        />
      )}

      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
    </div>
  )
}

/* --------------------------------- Helpers --------------------------------- */

function getDefaultForType(type: AutoFormFieldType): unknown {
  switch (type) {
    case 'string':
      return ''
    case 'number':
      return ''
    case 'boolean':
      return false
    case 'enum':
      return ''
    case 'date':
      return ''
  }
}

export { AutoForm }
export type { AutoFormSchema as AutoFormSchemaType }
