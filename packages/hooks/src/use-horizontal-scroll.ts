import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Track horizontal scroll position and overflow state of an element.
 *
 * @example
 * const { ref, canScrollLeft, canScrollRight } = useHorizontalScroll<HTMLDivElement>()
 */
export function useHorizontalScroll<T extends HTMLElement>(): {
  ref: React.RefObject<T>
  scrollLeft: number
  scrollWidth: number
  clientWidth: number
  canScrollLeft: boolean
  canScrollRight: boolean
} {
  const ref = useRef<T>(null)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [scrollWidth, setScrollWidth] = useState(0)
  const [clientWidth, setClientWidth] = useState(0)

  const update = useCallback(() => {
    if (!ref.current) return
    setScrollLeft(ref.current.scrollLeft)
    setScrollWidth(ref.current.scrollWidth)
    setClientWidth(ref.current.clientWidth)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.addEventListener('scroll', update, { passive: true })
    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [update])

  return {
    ref,
    scrollLeft,
    scrollWidth,
    clientWidth,
    canScrollLeft: scrollLeft > 0,
    canScrollRight: scrollLeft + clientWidth < scrollWidth - 1,
  }
}
