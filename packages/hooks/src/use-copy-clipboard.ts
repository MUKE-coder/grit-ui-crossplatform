import { useState, useCallback, useRef } from 'react'

/**
 * Copy text to the clipboard and track copied state.
 * The `copied` flag auto-resets after the specified timeout (default 2000ms).
 *
 * @example
 * const { copied, copy, reset } = useCopyClipboard(1500)
 */
export function useCopyClipboard(timeout = 2000): {
  copied: boolean
  copy: (text: string) => void
  reset: () => void
} {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setCopied(false)
  }, [])

  const copy = useCallback(
    (text: string) => {
      if (typeof navigator === 'undefined') return

      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setCopied(false), timeout)
      })
    },
    [timeout]
  )

  return { copied, copy, reset }
}
