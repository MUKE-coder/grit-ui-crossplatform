import { useRef } from 'react'

/**
 * Generate a stable random ID that persists across re-renders.
 * Useful for aria attributes and form label associations.
 *
 * @example
 * const id = useRandom('input')
 * // "input-a1b2c3d4"
 */
export function useRandom(prefix = 'id'): string {
  const ref = useRef<string | null>(null)

  if (ref.current === null) {
    const random = Math.random().toString(36).substring(2, 10)
    ref.current = prefix + '-' + random
  }

  return ref.current
}
