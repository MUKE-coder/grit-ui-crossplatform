import { useState, useCallback } from 'react'

/**
 * Undo/redo history state management.
 * Maintains a stack of past and future values for full history navigation.
 *
 * @example
 * const { value, set, undo, redo, canUndo, canRedo } = useHistory(0)
 */
export function useHistory<T>(initialValue: T): {
  value: T
  set: (v: T) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  history: T[]
} {
  const [past, setPast] = useState<T[]>([])
  const [present, setPresent] = useState<T>(initialValue)
  const [future, setFuture] = useState<T[]>([])

  const set = useCallback(
    (v: T) => {
      setPast((prev) => [...prev, present])
      setPresent(v)
      setFuture([])
    },
    [present]
  )

  const undo = useCallback(() => {
    setPast((prev) => {
      if (prev.length === 0) return prev
      const newPast = [...prev]
      const previous = newPast.pop()!
      setFuture((f) => [present, ...f])
      setPresent(previous)
      return newPast
    })
  }, [present])

  const redo = useCallback(() => {
    setFuture((prev) => {
      if (prev.length === 0) return prev
      const newFuture = [...prev]
      const next = newFuture.shift()!
      setPast((p) => [...p, present])
      setPresent(next)
      return newFuture
    })
  }, [present])

  return {
    value: present,
    set,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    history: [...past, present],
  }
}
