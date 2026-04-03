import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Drag-to-select behavior. Attach the ref to a container; items within
 * the drag rectangle are selected based on their `data-selectable-id` attribute.
 *
 * @example
 * const { ref, selectedItems, isDragging, clearSelection } = useDragSelection<HTMLDivElement>()
 */
export function useDragSelection<T extends HTMLElement>(): {
  ref: React.RefObject<T>
  selectedItems: string[]
  isDragging: boolean
  clearSelection: () => void
} {
  const ref = useRef<T>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const startPos = useRef<{ x: number; y: number } | null>(null)

  const clearSelection = useCallback(() => setSelectedItems([]), [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function getSelectableIds(rect: DOMRect): string[] {
      const items = el!.querySelectorAll<HTMLElement>('[data-selectable-id]')
      const ids: string[] = []

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect()
        const overlaps =
          itemRect.left < rect.right &&
          itemRect.right > rect.left &&
          itemRect.top < rect.bottom &&
          itemRect.bottom > rect.top

        if (overlaps) {
          const id = item.getAttribute('data-selectable-id')
          if (id) ids.push(id)
        }
      })

      return ids
    }

    function onPointerDown(e: PointerEvent) {
      startPos.current = { x: e.clientX, y: e.clientY }
      setIsDragging(true)
    }

    function onPointerMove(e: PointerEvent) {
      if (!startPos.current || !isDragging) return

      const rect = new DOMRect(
        Math.min(startPos.current.x, e.clientX),
        Math.min(startPos.current.y, e.clientY),
        Math.abs(e.clientX - startPos.current.x),
        Math.abs(e.clientY - startPos.current.y)
      )

      setSelectedItems(getSelectableIds(rect))
    }

    function onPointerUp() {
      startPos.current = null
      setIsDragging(false)
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [isDragging])

  return { ref, selectedItems, isDragging, clearSelection }
}
