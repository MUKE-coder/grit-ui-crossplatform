import * as React from 'react'
import { cn } from '@grit-ui/core'

/* ---------------------------------- Types ---------------------------------- */

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

/* ---------------------------------- Props ---------------------------------- */

/** Props for the MultiSelect component. */
export interface MultiSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Available options. */
  options: MultiSelectOption[]
  /** Currently selected values. */
  value?: string[]
  /** Callback when selection changes. */
  onChange?: (value: string[]) => void
  /** Placeholder when nothing is selected. */
  placeholder?: string
  /** Enable search/filter. */
  searchable?: boolean
  /** Disabled state. */
  disabled?: boolean
  /** Maximum number of selections. */
  maxSelections?: number
}

/**
 * Multi-value select with chips/tags, search, clear all, and remove individual items.
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   options={[
 *     { value: "react", label: "React" },
 *     { value: "vue", label: "Vue" },
 *     { value: "angular", label: "Angular" },
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 *   searchable
 *   placeholder="Select frameworks..."
 * />
 * ```
 */
const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      className,
      options,
      value = [],
      onChange,
      placeholder = 'Select...',
      searchable = false,
      disabled = false,
      maxSelections,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const containerRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const filteredOptions = React.useMemo(() => {
      let filtered = options
      if (search) {
        const lower = search.toLowerCase()
        filtered = filtered.filter((o) => o.label.toLowerCase().includes(lower))
      }
      return filtered
    }, [options, search])

    const selectedOptions = React.useMemo(
      () => options.filter((o) => value.includes(o.value)),
      [options, value]
    )

    const toggleOption = (optValue: string) => {
      if (disabled) return
      const isSelected = value.includes(optValue)
      if (isSelected) {
        onChange?.(value.filter((v) => v !== optValue))
      } else {
        if (maxSelections && value.length >= maxSelections) return
        onChange?.([...value, optValue])
      }
    }

    const removeOption = (optValue: string, e: React.MouseEvent) => {
      e.stopPropagation()
      if (disabled) return
      onChange?.(value.filter((v) => v !== optValue))
    }

    const clearAll = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (disabled) return
      onChange?.([])
      setSearch('')
    }

    // Close on click outside
    React.useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
          setSearch('')
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open])

    return (
      <div ref={containerRef} className={cn('relative', className)}>
        {/* Trigger */}
        <div
          ref={ref}
          role="combobox"
          aria-expanded={open}
          tabIndex={disabled ? -1 : 0}
          onClick={() => {
            if (!disabled) {
              setOpen(!open)
              if (!open && searchable) {
                setTimeout(() => inputRef.current?.focus(), 0)
              }
            }
          }}
          className={cn(
            'flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            open && 'ring-2 ring-ring ring-offset-2'
          )}
          {...props}
        >
          {selectedOptions.length === 0 && !search && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}

          {selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              {opt.label}
              <button
                type="button"
                onClick={(e) => removeOption(opt.value, e)}
                className="ml-0.5 rounded-full outline-none hover:bg-secondary-foreground/20 focus:ring-1 focus:ring-ring"
                aria-label={'Remove ' + opt.label}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </span>
          ))}

          {searchable && open && (
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder={selectedOptions.length > 0 ? '' : placeholder}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          <div className="ml-auto flex items-center gap-1">
            {value.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                aria-label="Clear all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
            {filteredOptions.length === 0 && (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">No options found.</div>
            )}
            {filteredOptions.map((opt) => {
              const isSelected = value.includes(opt.value)
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled}
                  onClick={() => !opt.disabled && toggleOption(opt.value)}
                  className={cn(
                    'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                    opt.disabled
                      ? 'pointer-events-none opacity-50'
                      : 'hover:bg-accent hover:text-accent-foreground',
                    isSelected && 'bg-accent/50'
                  )}
                >
                  <span className="mr-2 flex h-4 w-4 items-center justify-center">
                    {isSelected && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </span>
                  {opt.label}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
)
MultiSelect.displayName = 'MultiSelect'

export { MultiSelect }
