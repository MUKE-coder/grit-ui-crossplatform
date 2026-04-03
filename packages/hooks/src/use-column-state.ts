import { useState, useCallback, useRef } from 'react'

export interface Column {
  id: string
  label: string
  visible?: boolean
}

interface ColumnState {
  id: string
  label: string
  visible: boolean
}

/**
 * Table column visibility and ordering state management.
 * Toggle columns on/off and reorder them by index.
 *
 * @example
 * const { visibleColumns, toggleColumn, reorderColumn } = useColumnState(columns)
 */
export function useColumnState(columns: Column[]): {
  visibleColumns: ColumnState[]
  toggleColumn: (id: string) => void
  reorderColumn: (fromIndex: number, toIndex: number) => void
  resetColumns: () => void
} {
  const initialRef = useRef(
    columns.map((c) => ({ ...c, visible: c.visible !== false }))
  )
  const [state, setState] = useState<ColumnState[]>(initialRef.current)

  const visibleColumns = state.filter((c) => c.visible)

  const toggleColumn = useCallback((id: string) => {
    setState((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    )
  }, [])

  const reorderColumn = useCallback((fromIndex: number, toIndex: number) => {
    setState((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }, [])

  const resetColumns = useCallback(() => {
    setState(initialRef.current)
  }, [])

  return { visibleColumns, toggleColumn, reorderColumn, resetColumns }
}
