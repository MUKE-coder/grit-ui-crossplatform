import * as React from 'react'
import { cn } from '@grit-ui/core'

/* ---------------------------------- Types ---------------------------------- */

/** Column definition for DataGrid. */
export interface DataGridColumn {
  /** Unique key matching a property on the data item. */
  key: string
  /** Display header text. */
  header: string
  /** Initial width in pixels. */
  width?: number
  /** Minimum width in pixels. */
  minWidth?: number
  /** Whether the cell is editable. */
  editable?: boolean
  /** Column alignment. */
  align?: 'left' | 'center' | 'right'
}

interface CellPosition {
  row: number
  col: number
}

/* ---------------------------------- Props ---------------------------------- */

/** Props for DataGrid. */
export interface DataGridProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Column definitions. */
  columns: DataGridColumn[]
  /** Data rows. */
  data: T[]
  /** Callback when a cell value changes. */
  onChange?: (rowIndex: number, key: string, value: string) => void
  /** Height of each row in pixels. */
  rowHeight?: number
}

/**
 * Spreadsheet-like grid with cell selection, inline editing, and column resize.
 *
 * @example
 * ```tsx
 * <DataGrid
 *   columns={[
 *     { key: "name", header: "Name", editable: true, width: 200 },
 *     { key: "email", header: "Email", editable: true, width: 250 },
 *     { key: "role", header: "Role", width: 150 },
 *   ]}
 *   data={users}
 *   onChange={(row, key, value) => updateUser(row, key, value)}
 * />
 * ```
 */
function DataGrid<T extends Record<string, unknown>>({
  className,
  columns: initialColumns,
  data,
  onChange,
  rowHeight = 36,
  ...props
}: DataGridProps<T>) {
  const [columns, setColumns] = React.useState(initialColumns)
  const [selectedCell, setSelectedCell] = React.useState<CellPosition | null>(null)
  const [editingCell, setEditingCell] = React.useState<CellPosition | null>(null)
  const [editValue, setEditValue] = React.useState('')
  const [resizing, setResizing] = React.useState<{ colIndex: number; startX: number; startWidth: number } | null>(null)
  const gridRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Column resize
  React.useEffect(() => {
    if (!resizing) return
    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX
      const newWidth = Math.max(resizing.startWidth + delta, columns[resizing.colIndex].minWidth ?? 50)
      setColumns((prev) => {
        const next = [...prev]
        next[resizing.colIndex] = { ...next[resizing.colIndex], width: newWidth }
        return next
      })
    }
    const handleMouseUp = () => setResizing(null)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizing, columns])

  // Keyboard navigation
  React.useEffect(() => {
    if (!selectedCell || editingCell) return
    const handler = (e: KeyboardEvent) => {
      const { row, col } = selectedCell
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          if (row > 0) setSelectedCell({ row: row - 1, col })
          break
        case 'ArrowDown':
          e.preventDefault()
          if (row < data.length - 1) setSelectedCell({ row: row + 1, col })
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (col > 0) setSelectedCell({ row, col: col - 1 })
          break
        case 'ArrowRight':
          e.preventDefault()
          if (col < columns.length - 1) setSelectedCell({ row, col: col + 1 })
          break
        case 'Enter':
        case 'F2':
          e.preventDefault()
          if (columns[col].editable) {
            setEditingCell(selectedCell)
            setEditValue(String(data[row][columns[col].key] ?? ''))
          }
          break
        case 'Escape':
          setSelectedCell(null)
          break
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [selectedCell, editingCell, data, columns])

  // Focus input on edit
  React.useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  const commitEdit = () => {
    if (editingCell) {
      const col = columns[editingCell.col]
      onChange?.(editingCell.row, col.key, editValue)
      setEditingCell(null)
    }
  }

  const cancelEdit = () => {
    setEditingCell(null)
    setEditValue('')
  }

  return (
    <div
      ref={gridRef}
      className={cn('relative w-full overflow-auto rounded-md border', className)}
      {...props}
    >
      <div className="inline-block min-w-full">
        {/* Header */}
        <div className="flex border-b bg-muted/50">
          {columns.map((col, colIdx) => (
            <DataGridHeader
              key={col.key}
              column={col}
              onResizeStart={(e) =>
                setResizing({
                  colIndex: colIdx,
                  startX: e.clientX,
                  startWidth: col.width ?? 150,
                })
              }
            />
          ))}
        </div>

        {/* Rows */}
        {data.map((item, rowIdx) => (
          <DataGridRow key={rowIdx} style={{ height: rowHeight }}>
            {columns.map((col, colIdx) => {
              const isSelected = selectedCell?.row === rowIdx && selectedCell?.col === colIdx
              const isEditing = editingCell?.row === rowIdx && editingCell?.col === colIdx

              return (
                <DataGridCell
                  key={col.key}
                  width={col.width ?? 150}
                  align={col.align}
                  selected={isSelected}
                  onClick={() => setSelectedCell({ row: rowIdx, col: colIdx })}
                  onDoubleClick={() => {
                    if (col.editable) {
                      setSelectedCell({ row: rowIdx, col: colIdx })
                      setEditingCell({ row: rowIdx, col: colIdx })
                      setEditValue(String(item[col.key] ?? ''))
                    }
                  }}
                >
                  {isEditing ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitEdit()
                        if (e.key === 'Escape') cancelEdit()
                        e.stopPropagation()
                      }}
                      className="h-full w-full border-0 bg-transparent px-2 text-sm outline-none"
                    />
                  ) : (
                    <span className="truncate px-2">{String(item[col.key] ?? '')}</span>
                  )}
                </DataGridCell>
              )
            })}
          </DataGridRow>
        ))}

        {data.length === 0 && (
          <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
            No data
          </div>
        )}
      </div>
    </div>
  )
}

/* --------------------------------- Header ---------------------------------- */

interface DataGridHeaderProps {
  column: DataGridColumn
  onResizeStart: (e: React.MouseEvent) => void
}

function DataGridHeader({ column, onResizeStart }: DataGridHeaderProps) {
  return (
    <div
      className={cn(
        'relative flex h-10 shrink-0 items-center border-r px-2 text-sm font-medium text-muted-foreground last:border-r-0',
        column.align === 'center' && 'justify-center',
        column.align === 'right' && 'justify-end'
      )}
      style={{ width: column.width ?? 150, minWidth: column.minWidth ?? 50 }}
    >
      {column.header}
      {/* Resize handle */}
      <div
        onMouseDown={onResizeStart}
        className="absolute right-0 top-0 z-10 h-full w-1 cursor-col-resize hover:bg-primary/50"
      />
    </div>
  )
}

/* ----------------------------------- Row ----------------------------------- */

const DataGridRow = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex border-b last:border-b-0', className)} {...props} />
  )
)
DataGridRow.displayName = 'DataGridRow'

/* ---------------------------------- Cell ----------------------------------- */

interface DataGridCellProps extends React.HTMLAttributes<HTMLDivElement> {
  width: number
  selected?: boolean
  align?: 'left' | 'center' | 'right'
}

const DataGridCell = React.forwardRef<HTMLDivElement, DataGridCellProps>(
  ({ className, width, selected = false, align, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex shrink-0 items-center border-r text-sm last:border-r-0 transition-colors',
        selected ? 'bg-accent/30 ring-2 ring-inset ring-primary' : 'hover:bg-muted/30',
        align === 'center' && 'justify-center',
        align === 'right' && 'justify-end',
        className
      )}
      style={{ width, minWidth: 50 }}
      {...props}
    >
      {children}
    </div>
  )
)
DataGridCell.displayName = 'DataGridCell'

export { DataGrid, DataGridHeader, DataGridRow, DataGridCell }
export type { DataGridColumn }
