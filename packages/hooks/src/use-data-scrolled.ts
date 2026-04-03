import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Detect if an element has been scrolled past a threshold.
 * Useful for sticky headers, shadow effects, etc.
 *
 * @example
 * const { ref, isScrolled } = useDataScrolled(10)
 */
export function useDataScrolled<T extends HTMLElement>(
  threshold = 0
): {
  ref: React.RefObject<T>
  isScrolled: boolean
} {
  const ref = useRef<T>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  const handleScroll = useCallback(() => {
    if (ref.current) {
      setIsScrolled(ref.current.scrollTop > threshold)
    }
  }, [threshold])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return { ref, isScrolled }
}
