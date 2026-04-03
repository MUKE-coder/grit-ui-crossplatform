import { useState, useCallback, useMemo } from 'react'
import { useColumnState, type Column } from './use-column-state'
import { useCellEdit } from './use-cell-edit'
import { useCellSelection } from './use-cell-selection'

type SortDirection = 'asc' | 'desc' | null

interface SortState {
  columnId: string | null
  direction: SortDirection
}

interface FilterState {
  [columnId: string]: string
}

interface DataGridConfig {
  columns: Column[]
}

/**
 * Full data grid state combining column visibility, cell selection,
 * cell editing, sorting, and filtering into one composable hook.
 *
 * @example
 * const grid = useDataGridState({ columns })
 */
export function useDataGridState(config: DataGridConfig) {
  const columnState = useColumnState(config.columns)
  const selection = useCellSelection()
  const editing = useCellEdit()

  const [sort, setSort] = useState<SortState>({ columnId: null, direction: null })
  const [filters, setFilters] = useState<FilterState>({})

  const toggleSort = useCallback((columnId: string) => {
    setSort((prev) => {
      if (prev.columnId !== columnId) return { columnId, direction: 'asc' }
      if (prev.direction === 'asc') return { columnId, direction: 'desc' }
      return { columnId: null, direction: null }
    })
  }, [])

  const setFilter = useCallback((columnId: string, value: string) => {
    setFilters((prev) => {
      if (!value) {
        const next = { ...prev }
        delete next[columnId]
        return next
      }
      return { ...prev, [columnId]: value }
    })
  }, [])

  const clearFilters = useCallback(() => setFilters({}), [])

  const sorting = useMemo(
    () => ({ sort, toggleSort }),
    [sort, toggleSort]
  )

  const filtering = useMemo(
    () => ({ filters, setFilter, clearFilters }),
    [filters, setFilter, clearFilters]
  )

  return {
    columns: columnState,
    selection,
    editing,
    sorting,
    filtering,
  }
}
