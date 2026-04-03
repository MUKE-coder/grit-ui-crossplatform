import { useState, useEffect, useRef } from 'react'

/**
 * Check if an element is vertically scrollable (content overflows).
 *
 * @example
 * const { ref, canScroll } = useCanScrollVertical<HTMLDivElement>()
 */
export function useCanScrollVertical<T extends HTMLElement>(): {
  ref: React.RefObject<T>
  canScroll: boolean
} {
  const ref = useRef<T>(null)
  const [canScroll, setCanScroll] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function check() {
      if (el) {
        setCanScroll(el.scrollHeight > el.clientHeight)
      }
    }

    check()

    const ro = new ResizeObserver(check)
    ro.observe(el)

    return () => ro.disconnect()
  }, [])

  return { ref, canScroll }
}
