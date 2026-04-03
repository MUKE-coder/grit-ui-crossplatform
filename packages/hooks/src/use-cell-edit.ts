import { useState, useCallback } from 'react'

interface CellPosition {
  row: number
  col: number
}

/**
 * Grid cell inline editing state management.
 * Tracks which cell is being edited and manages commit/cancel lifecycle.
 *
 * @example
 * const { editingCell, startEdit, commitEdit, cancelEdit } = useCellEdit()
 */
export function useCellEdit<T = unknown>(): {
  editingCell: CellPosition | null
  editValue: T | null
  startEdit: (cell: CellPosition, value: T) => void
  commitEdit: () => { cell: CellPosition; value: T } | null
  cancelEdit: () => void
  isEditing: (row: number, col: number) => boolean
} {
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null)
  const [editValue, setEditValue] = useState<T | null>(null)

  const startEdit = useCallback((cell: CellPosition, value: T) => {
    setEditingCell(cell)
    setEditValue(value)
  }, [])

  const commitEdit = useCallback(() => {
    if (!editingCell || editValue === null) return null
    const result = { cell: editingCell, value: editValue }
    setEditingCell(null)
    setEditValue(null)
    return result
  }, [editingCell, editValue])

  const cancelEdit = useCallback(() => {
    setEditingCell(null)
    setEditValue(null)
  }, [])

  const isEditing = useCallback(
    (row: number, col: number) =>
      editingCell !== null && editingCell.row === row && editingCell.col === col,
    [editingCell]
  )

  return { editingCell, editValue, startEdit, commitEdit, cancelEdit, isEditing }
}
