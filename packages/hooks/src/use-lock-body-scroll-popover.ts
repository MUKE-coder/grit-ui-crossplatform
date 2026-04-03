import { useEffect } from 'react'

/**
 * Popover-specific scroll lock. Locks body scroll when the popover is open
 * and restores the original overflow on close or unmount.
 *
 * @example
 * useLockBodyScrollPopover(isOpen)
 */
export function useLockBodyScrollPopover(isOpen: boolean): void {
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (!isOpen) return

    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = original
    }
  }, [isOpen])
}
