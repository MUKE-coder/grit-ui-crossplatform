import { useState, useCallback } from 'react'

interface CellPosition {
  row: number
  col: number
}

function cellKey(row: number, col: number): string {
  return row + ':' + col
}

/**
 * Grid cell selection supporting single, range, and multi-select modes.
 *
 * @example
 * const { selectedCells, selectCell, selectRange, isSelected } = useCellSelection()
 */
export function useCellSelection(): {
  selectedCells: CellPosition[]
  selectCell: (row: number, col: number, multi?: boolean) => void
  selectRange: (from: CellPosition, to: CellPosition) => void
  clearSelection: () => void
  isSelected: (row: number, col: number) => boolean
} {
  const [selected, setSelected] = useState<Map<string, CellPosition>>(new Map())

  const selectCell = useCallback((row: number, col: number, multi = false) => {
    setSelected((prev) => {
      const key = cellKey(row, col)
      if (multi) {
        const next = new Map(prev)
        if (next.has(key)) {
          next.delete(key)
        } else {
          next.set(key, { row, col })
        }
        return next
      }
      return new Map([[key, { row, col }]])
    })
  }, [])

  const selectRange = useCallback((from: CellPosition, to: CellPosition) => {
    const minRow = Math.min(from.row, to.row)
    const maxRow = Math.max(from.row, to.row)
    const minCol = Math.min(from.col, to.col)
    const maxCol = Math.max(from.col, to.col)

    const next = new Map<string, CellPosition>()
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        next.set(cellKey(r, c), { row: r, col: c })
      }
    }
    setSelected(next)
  }, [])

  const clearSelection = useCallback(() => setSelected(new Map()), [])

  const isSelected = useCallback(
    (row: number, col: number) => selected.has(cellKey(row, col)),
    [selected]
  )

  return {
    selectedCells: Array.from(selected.values()),
    selectCell,
    selectRange,
    clearSelection,
    isSelected,
  }
}
