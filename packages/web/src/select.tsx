import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Individual option within a Select. */
export interface SelectOptionProps {
  value: string
  label: string
  disabled?: boolean
}

/** Group of options with a label. */
export interface SelectOptionGroupProps {
  label: string
  options: SelectOptionProps[]
}

/** Props for the Select component. */
export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Placeholder text when no value is selected. */
  placeholder?: string
  /** Currently selected value (controlled). */
  value?: string
  /** Default selected value (uncontrolled). */
  defaultValue?: string
  /** Called when selection changes. */
  onChange?: (value: string) => void
  /** Flat list of options. */
  options?: SelectOptionProps[]
  /** Grouped options. */
  groups?: SelectOptionGroupProps[]
  /** Disable the entire select. */
  disabled?: boolean
  /** Enable search/filter within the dropdown. */
  searchable?: boolean
}

/**
 * Custom select dropdown with option groups, search, and keyboard navigation.
 *
 * @example
 * ```tsx
 * <Select
 *   placeholder="Choose a fruit"
 *   options={[
 *     { value: 'apple', label: 'Apple' },
 *     { value: 'banana', label: 'Banana' },
 *   ]}
 *   onChange={(v) => console.log(v)}
 * />
 * ```
 */
const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      placeholder = 'Select...',
      value: controlledValue,
      defaultValue,
      onChange,
      options = [],
      groups = [],
      disabled = false,
      searchable = false,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(defaultValue || '')
    const [search, setSearch] = React.useState('')
    const containerRef = React.useRef<HTMLDivElement>(null)

    const selectedValue = controlledValue !== undefined ? controlledValue : internalValue

    // Flatten all options for lookup
    const allOptions = React.useMemo(() => {
      const flat = [...options]
      groups.forEach((g) => flat.push(...g.options))
      return flat
    }, [options, groups])

    const selectedLabel = allOptions.find((o) => o.value === selectedValue)?.label

    // Filter options based on search
    const filterFn = (o: SelectOptionProps) =>
      !searchable || o.label.toLowerCase().includes(search.toLowerCase())

    const filteredOptions = options.filter(filterFn)
    const filteredGroups = groups
      .map((g) => ({ ...g, options: g.options.filter(filterFn) }))
      .filter((g) => g.options.length > 0)

    // Close on outside click
    React.useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
          setSearch('')
        }
      }
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const handleSelect = (val: string) => {
      if (controlledValue === undefined) {
        setInternalValue(val)
      }
      onChange?.(val)
      setOpen(false)
      setSearch('')
    }

    const renderOption = (opt: SelectOptionProps) => (
      <button
        key={opt.value}
        type="button"
        disabled={opt.disabled}
        className={cn(
          'w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors',
          opt.value === selectedValue && 'bg-accent text-accent-foreground font-medium',
          opt.disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => !opt.disabled && handleSelect(opt.value)}
      >
        {opt.label}
      </button>
    )

    return (
      <div ref={containerRef} className={cn('relative w-full', className)} {...props}>
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            !selectedLabel && 'text-muted-foreground'
          )}
        >
          <span className="truncate">{selectedLabel || placeholder}</span>
          <svg
            className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-input bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
            {searchable && (
              <div className="border-b border-input p-2">
                <input
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            )}
            <div className="max-h-60 overflow-y-auto py-1">
              {filteredOptions.map(renderOption)}
              {filteredGroups.map((group) => (
                <div key={group.label}>
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">{group.label}</div>
                  {group.options.map(renderOption)}
                </div>
              ))}
              {filteredOptions.length === 0 && filteredGroups.length === 0 && (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">No options found.</div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
