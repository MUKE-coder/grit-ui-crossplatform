import { useState, useRef, useCallback } from 'react'

/**
 * Detect long press / press-and-hold interactions.
 * Fires the callback after the specified delay (default 500ms).
 *
 * @example
 * const { onPointerDown, onPointerUp, onPointerLeave, isPressed } = usePressHold(() => alert('held!'), 600)
 */
export function usePressHold(
  callback: () => void,
  delay = 500
): {
  onPointerDown: () => void
  onPointerUp: () => void
  onPointerLeave: () => void
  isPressed: boolean
} {
  const [isPressed, setIsPressed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setIsPressed(false)
  }, [])

  const onPointerDown = useCallback(() => {
    setIsPressed(true)
    timerRef.current = setTimeout(() => {
      callback()
      setIsPressed(false)
    }, delay)
  }, [callback, delay])

  const onPointerUp = useCallback(() => clear(), [clear])
  const onPointerLeave = useCallback(() => clear(), [clear])

  return { onPointerDown, onPointerUp, onPointerLeave, isPressed }
}
