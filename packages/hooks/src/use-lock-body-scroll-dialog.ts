import { useEffect } from 'react'

/**
 * Dialog-specific scroll lock. Locks body scroll when the dialog opens
 * and restores it when the dialog closes or the component unmounts.
 *
 * @example
 * useLockBodyScrollDialog(isOpen)
 */
export function useLockBodyScrollDialog(isOpen: boolean): void {
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
