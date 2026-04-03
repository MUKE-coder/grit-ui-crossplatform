import { useState, useCallback, useRef } from 'react'

/**
 * Simple form state management with validation, dirty tracking, and touched fields.
 *
 * @example
 * const { values, errors, handleChange, handleSubmit } = useForm(
 *   { email: '', password: '' },
 *   (v) => ({ email: v.email ? undefined : 'Required' })
 * )
 */
export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>
): {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  dirty: boolean
  handleChange: (field: keyof T, value: T[keyof T]) => void
  handleBlur: (field: keyof T) => void
  handleSubmit: (onSubmit: (values: T) => void) => (e?: { preventDefault?: () => void }) => void
  reset: () => void
  setValues: (values: T) => void
  setFieldValue: (field: keyof T, value: T[keyof T]) => void
} {
  const [values, setValues] = useState<T>(initialValues)
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const initialRef = useRef(initialValues)

  const errors = validate ? validate(values) : ({} as Partial<Record<keyof T, string>>)

  const dirty = JSON.stringify(values) !== JSON.stringify(initialRef.current)

  const handleChange = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleBlur = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void) => {
      return (e?: { preventDefault?: () => void }) => {
        if (e?.preventDefault) e.preventDefault()

        const allTouched = Object.keys(values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {} as Partial<Record<keyof T, boolean>>
        )
        setTouched(allTouched)

        const currentErrors = validate ? validate(values) : {}
        const hasErrors = Object.values(currentErrors).some((v) => v !== undefined && v !== '')
        if (!hasErrors) {
          onSubmit(values)
        }
      }
    },
    [values, validate]
  )

  const reset = useCallback(() => {
    setValues(initialRef.current)
    setTouched({})
  }, [])

  return {
    values,
    errors,
    touched,
    dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setFieldValue,
  }
}
