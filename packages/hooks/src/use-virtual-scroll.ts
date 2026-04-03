import { useMemo, useCallback, useState } from 'react'

interface UseVirtualScrollOptions {
  itemCount: number
  itemHeight: number
  containerHeight: number
  overscan?: number
}

interface UseVirtualScrollReturn {
  visibleRange: { start: number; end: number }
  totalHeight: number
  offsetY: number
  onScroll: (event: { currentTarget: { scrollTop: number } }) => void
}

/**
 * Virtual scrolling for large lists. Only renders items within the visible range
 * plus an overscan buffer for smooth scrolling.
 *
 * @example
 * const { visibleRange, totalHeight, offsetY, onScroll } = useVirtualScroll({
 *   itemCount: 10000, itemHeight: 40, containerHeight: 400, overscan: 5
 * })
 */
export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 3,
}: UseVirtualScrollOptions): UseVirtualScrollReturn {
  const [scrollTop, setScrollTop] = useState(0)

  const totalHeight = itemCount * itemHeight

  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const end = Math.min(itemCount, start + visibleCount + overscan * 2)
    return { start, end }
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan])

  const offsetY = visibleRange.start * itemHeight

  const onScroll = useCallback(
    (event: { currentTarget: { scrollTop: number } }) => {
      setScrollTop(event.currentTarget.scrollTop)
    },
    []
  )

  return { visibleRange, totalHeight, offsetY, onScroll }
}
