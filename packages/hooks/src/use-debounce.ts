import { useState, useEffect } from 'react'

/**
 * Debounce a value. The returned value only updates after the specified
 * delay (default 300ms) has elapsed since the last change.
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 500)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
