import { useState, useCallback } from 'react'

/**
 * Lock and unlock body scroll programmatically.
 * Stores the original overflow style and restores it on unlock.
 *
 * @example
 * const { lock, unlock, isLocked } = useLockBodyScroll()
 */
export function useLockBodyScroll(): {
  lock: () => void
  unlock: () => void
  isLocked: boolean
} {
  const [isLocked, setIsLocked] = useState(false)

  const lock = useCallback(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = 'hidden'
    setIsLocked(true)
  }, [])

  const unlock = useCallback(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = ''
    setIsLocked(false)
  }, [])

  return { lock, unlock, isLocked }
}
