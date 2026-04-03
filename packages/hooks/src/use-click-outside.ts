import { useEffect, useRef } from 'react'

/**
 * Detect clicks outside a referenced element and invoke a handler.
 * Attach the returned ref to the element you want to monitor.
 *
 * @example
 * const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))
 * return <div ref={ref}>...</div>
 */
export function useClickOutside<T extends HTMLElement>(
  handler: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [handler])

  return ref
}
