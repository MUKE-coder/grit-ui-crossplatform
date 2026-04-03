import { useState, useCallback } from 'react'

/**
 * Persistent state in localStorage with SSR safety.
 * Falls back to initialValue when localStorage is unavailable or the key is missing.
 *
 * @example
 * const [token, setToken] = useLocalStorage('auth-token', '')
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(key, JSON.stringify(nextValue))
          } catch {
            // Storage full or unavailable
          }
        }
        return nextValue
      })
    },
    [key]
  )

  return [storedValue, setValue]
}
