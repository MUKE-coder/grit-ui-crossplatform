import * as React from 'react'
import { cn } from '@grit-ui/core'

/* ---------------------------------- Types ---------------------------------- */

/** Column definition for DataTable. */
export interface DataTableColumn<T> {
  /** Unique key matching a property on the data item. */
  key: string
  /** Display header text. */
  header: string
  /** Whether this column is sortable. */
  sortable?: boolean
  /** Whether this column is visible by default. */
  visible?: boolean
  /** Custom cell renderer. */
  cell?: (item: T, index: number) => React.ReactNode
  /** Column alignment. */
  align?: 'left' | 'center' | 'right'
}

type SortDirection = 'asc' | 'desc' | null

/** Props for DataTable. */
export interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  /** Column definitions. */
  columns: DataTableColumn<T>[]
  /** Data rows. */
  data: T[]
  /** Enable row selection with checkboxes. */
  selectable?: boolean
  /** Currently selected row indices. */
  selectedRows?: number[]
  /** Callback when selection changes. */
  onSelectionChange?: (indices: number[]) => void
  /** Enable filtering. */
  filterable?: boolean
  /** Filter value. */
  filterValue?: string
  /** Filter callback. */
  onFilterChange?: (value: string) => void
  /** Page size for pagination. 0 = no pagination. */
  pageSize?: number
  /** Text shown when no data. */
  emptyText?: string
}

/**
 * Advanced data table with sorting, filtering, pagination, row selection, and column visibility.
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={[
 *     { key: "name", header: "Name", sortable: true },
 *     { key: "email", header: "Email", sortable: true },
 *     { key: "role", header: "Role" },
 *   ]}
 *   data={users}
 *   selectable
 *   pageSize={10}
 *   filterable
 * />
 * ```
 */
function DataTable<T extends Record<string, unknown>>({
  className,
  columns,
  data,
  selectable = false,
  selectedRows: controlledSelected,
  onSelectionChange,
  filterable = false,
  filterValue: controlledFilter,
  onFilterChange,
  pageSize = 0,
  emptyText = 'No results.',
  ...props
}: DataTableProps<T>) {
  // Column visibility
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    () => new Set(columns.filter((c) => c.visible !== false).map((c) => c.key))
  )
  const [showColumnToggle, setShowColumnToggle] = React.useState(false)

  // Sort
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<SortDirection>(null)

  // Filter
  const [internalFilter, setInternalFilter] = React.useState('')
  const filter = controlledFilter ?? internalFilter
  const setFilter = onFilterChange ?? setInternalFilter

  // Pagination
  const [page, setPage] = React.useState(0)

  // Selection
  const [internalSelected, setInternalSelected] = React.useState<number[]>([])
  const selected = controlledSelected ?? internalSelected
  const setSelected = onSelectionChange ?? setInternalSelected

  // Process data
  const processedData = React.useMemo(() => {
    let items = [...data]

    // Filter
    if (filter) {
      const lower = filter.toLowerCase()
      items = items.filter((item) =>
        columns.some((col) => {
          const val = item[col.key]
          return val != null && String(val).toLowerCase().includes(lower)
        })
      )
    }

    // Sort
    if (sortKey && sortDir) {
      items.sort((a, b) => {
        const aVal = a[sortKey] as any
        const bVal = b[sortKey] as any
        if (aVal == null) return 1
        if (bVal == null) return -1
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return sortDir === 'asc' ? cmp : -cmp
      })
    }

    return items
  }, [data, filter, sortKey, sortDir, columns])

  // Paginate
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(processedData.length / pageSize)) : 1
  const pagedData = pageSize > 0 ? processedData.slice(page * pageSize, (page + 1) * pageSize) : processedData

  React.useEffect(() => {
    setPage(0)
  }, [filter])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'))
      if (sortDir === 'desc') setSortKey(null)
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const toggleSelectAll = () => {
    if (selected.length === pagedData.length) {
      setSelected([])
    } else {
      setSelected(pagedData.map((_, i) => page * (pageSize || 0) + i))
    }
  }

  const toggleSelectRow = (index: number) => {
    const globalIndex = page * (pageSize || 0) + index
    setSelected(
      selected.includes(globalIndex) ? selected.filter((i) => i !== globalIndex) : [...selected, globalIndex]
    )
  }

  const activeColumns = columns.filter((c) => visibleColumns.has(c.key))

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {/* Toolbar */}
      <DataTableToolbar>
        {filterable && (
          <input
            type="text"
            placeholder="Filter..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex h-9 w-full max-w-sm rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        )}
        <DataTableColumnToggle
          columns={columns}
          visibleColumns={visibleColumns}
          onToggle={(key) => {
            setVisibleColumns((prev) => {
              const next = new Set(prev)
              if (next.has(key)) next.delete(key)
              else next.add(key)
              return next
            })
          }}
          open={showColumnToggle}
          onOpenChange={setShowColumnToggle}
        />
      </DataTableToolbar>

      {/* Table */}
      <div className="relative w-full overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              {selectable && (
                <th className="h-12 w-12 px-4 text-left align-middle">
                  <input
                    type="checkbox"
                    checked={pagedData.length > 0 && selected.length === pagedData.length}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-input"
                  />
                </th>
              )}
              {activeColumns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'h-12 px-4 align-middle font-medium text-muted-foreground',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.sortable && 'cursor-pointer select-none hover:text-foreground'
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-xs">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {pagedData.length === 0 ? (
              <tr>
                <td
                  colSpan={activeColumns.length + (selectable ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              pagedData.map((item, idx) => {
                const globalIdx = page * (pageSize || 0) + idx
                const isSelected = selected.includes(globalIdx)
                return (
                  <tr
                    key={idx}
                    data-state={isSelected ? 'selected' : undefined}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    {selectable && (
                      <td className="p-4 align-middle">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(idx)}
                          className="h-4 w-4 rounded border-input"
                        />
                      </td>
                    )}
                    {activeColumns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          'p-4 align-middle',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right'
                        )}
                      >
                        {col.cell ? col.cell(item, idx) : String(item[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageSize > 0 && totalPages > 1 && (
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={processedData.length}
          selectedCount={selected.length}
        />
      )}
    </div>
  )
}

/* --------------------------------- Toolbar --------------------------------- */

const DataTableToolbar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between gap-2', className)} {...props} />
  )
)
DataTableToolbar.displayName = 'DataTableToolbar'

/* ----------------------------- Column Toggle ------------------------------ */

interface DataTableColumnToggleProps {
  columns: DataTableColumn<any>[]
  visibleColumns: Set<string>
  onToggle: (key: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

function DataTableColumnToggle({ columns, visibleColumns, onToggle, open, onOpenChange }: DataTableColumnToggleProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOpenChange(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onOpenChange])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="inline-flex h-9 items-center justify-center gap-1 rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v18" />
          <rect width="6" height="6" x="1" y="9" rx="1" />
          <rect width="6" height="6" x="17" y="9" rx="1" />
        </svg>
        Columns
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[150px] rounded-md border bg-popover p-1 shadow-md">
          {columns.map((col) => (
            <label
              key={col.key}
              className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
            >
              <input
                type="checkbox"
                checked={visibleColumns.has(col.key)}
                onChange={() => onToggle(col.key)}
                className="h-4 w-4 rounded border-input"
              />
              {col.header}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------- Pagination -------------------------------- */

interface DataTablePaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems: number
  selectedCount: number
}

function DataTablePagination({ page, totalPages, onPageChange, totalItems, selectedCount }: DataTablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-muted-foreground">
        {selectedCount > 0 && selectedCount + ' of '}
        {totalItems} row{totalItems !== 1 ? 's' : ''}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => onPageChange(0)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm disabled:pointer-events-none disabled:opacity-50 hover:bg-accent"
        >
          {'<<'}
        </button>
        <button
          type="button"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm disabled:pointer-events-none disabled:opacity-50 hover:bg-accent"
        >
          {'<'}
        </button>
        <span className="text-sm">
          Page {page + 1} of {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm disabled:pointer-events-none disabled:opacity-50 hover:bg-accent"
        >
          {'>'}
        </button>
        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(totalPages - 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm disabled:pointer-events-none disabled:opacity-50 hover:bg-accent"
        >
          {'>>'}
        </button>
      </div>
    </div>
  )
}

const DataTableHeader = DataTableToolbar

export {
  DataTable,
  DataTableToolbar,
  DataTableHeader,
  DataTablePagination,
  DataTableColumnToggle,
}
export type { DataTableColumn, SortDirection }
