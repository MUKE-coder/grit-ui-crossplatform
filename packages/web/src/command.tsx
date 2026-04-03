import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Command variant definitions using CVA.
 */
const commandVariants = cva(
  'flex flex-col overflow-hidden rounded-lg border border-border bg-background shadow-lg',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        default: 'max-w-lg',
        lg: 'max-w-2xl',
        full: 'max-w-full',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

/** Context for the Command component. */
interface CommandContextValue {
  search: string
  setSearch: (s: string) => void
  selectedIndex: number
  setSelectedIndex: (i: number) => void
  itemCount: number
  registerItem: () => number
  unregisterItem: () => void
  onItemSelect: (value: string) => void
}

const CommandContext = React.createContext<CommandContextValue | null>(null)

function useCommand() {
  const ctx = React.useContext(CommandContext)
  if (!ctx) throw new Error('Command compound components must be used within <Command>')
  return ctx
}

/** Simple fuzzy match. */
function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase()
  const q = query.toLowerCase()
  let qi = 0
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++
  }
  return qi === q.length
}

/** Props for the Command component. */
export interface CommandProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof commandVariants> {
  /** Called when an item is selected. */
  onSelect?: (value: string) => void
  /** Filter function. Defaults to fuzzy search. */
  filter?: (value: string, search: string) => boolean
}

/**
 * Command palette / search component with fuzzy search and keyboard navigation.
 *
 * @example
 * ```tsx
 * <Command onSelect={(val) => console.log(val)}>
 *   <CommandInput placeholder="Search..." />
 *   <CommandList>
 *     <CommandEmpty>No results found.</CommandEmpty>
 *     <CommandGroup heading="Suggestions">
 *       <CommandItem value="calendar">Calendar</CommandItem>
 *       <CommandItem value="search">Search</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </Command>
 * ```
 */
const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className, size, onSelect, filter, children, ...props }, ref) => {
    const [search, setSearch] = React.useState('')
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const itemCountRef = React.useRef(0)
    const [, forceUpdate] = React.useState(0)

    const registerItem = React.useCallback(() => {
      const idx = itemCountRef.current
      itemCountRef.current++
      return idx
    }, [])

    const unregisterItem = React.useCallback(() => {
      itemCountRef.current = Math.max(0, itemCountRef.current - 1)
    }, [])

    // Reset on search change
    React.useEffect(() => {
      setSelectedIndex(0)
      itemCountRef.current = 0
      forceUpdate((n) => n + 1)
    }, [search])

    const handleItemSelect = React.useCallback(
      (value: string) => {
        onSelect?.(value)
      },
      [onSelect]
    )

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const count = itemCountRef.current
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % Math.max(1, count))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + Math.max(1, count)) % Math.max(1, count))
      }
    }

    const ctx: CommandContextValue = {
      search,
      setSearch,
      selectedIndex,
      setSelectedIndex,
      itemCount: itemCountRef.current,
      registerItem,
      unregisterItem,
      onItemSelect: handleItemSelect,
    }

    // Provide filter via a secondary context to avoid re-creating main context
    const filterFn = filter || fuzzyMatch

    return (
      <CommandContext.Provider value={ctx}>
        <CommandFilterContext.Provider value={filterFn}>
          <div
            ref={ref}
            className={cn(commandVariants({ size }), className)}
            onKeyDown={handleKeyDown}
            {...props}
          >
            {children}
          </div>
        </CommandFilterContext.Provider>
      </CommandContext.Provider>
    )
  }
)
Command.displayName = 'Command'

const CommandFilterContext = React.createContext<(value: string, search: string) => boolean>(fuzzyMatch)

/**
 * Search input for the command palette.
 */
const CommandInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    const { search, setSearch } = useCommand()
    return (
      <div className="flex items-center border-b border-border px-3">
        <svg className="h-4 w-4 shrink-0 text-muted-foreground mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={ref}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            'flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
CommandInput.displayName = 'CommandInput'

/**
 * Scrollable list container for command items.
 */
const CommandList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)} {...props} />
  )
)
CommandList.displayName = 'CommandList'

/**
 * Empty state shown when no results match.
 */
const CommandEmpty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { search, itemCount } = useCommand()
    if (!search || itemCount > 0) return null
    return (
      <div ref={ref} className={cn('py-6 text-center text-sm text-muted-foreground', className)} {...props}>
        {children}
      </div>
    )
  }
)
CommandEmpty.displayName = 'CommandEmpty'

/** Props for CommandGroup. */
export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Group heading text. */
  heading?: string
}

/**
 * Group of command items with an optional heading.
 */
const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => (
    <div ref={ref} className={cn('overflow-hidden p-1', className)} role="group" {...props}>
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{heading}</div>
      )}
      {children}
    </div>
  )
)
CommandGroup.displayName = 'CommandGroup'

/** Props for CommandItem. */
export interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value used for filtering and selection callback. */
  value: string
  /** Whether the item is disabled. */
  disabled?: boolean
}

/**
 * Individual selectable item in the command list.
 */
const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, value, disabled, children, ...props }, ref) => {
    const { search, selectedIndex, onItemSelect } = useCommand()
    const filter = React.useContext(CommandFilterContext)
    const indexRef = React.useRef(-1)
    const { registerItem, unregisterItem } = useCommand()

    // Check if item matches filter
    const isVisible = !search || filter(value, search)

    React.useEffect(() => {
      if (isVisible) {
        indexRef.current = registerItem()
        return () => unregisterItem()
      }
    }, [isVisible, registerItem, unregisterItem, search])

    if (!isVisible) return null

    const isSelected = indexRef.current === selectedIndex

    const handleSelect = () => {
      if (disabled) return
      onItemSelect(value)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSelect()
      }
    }

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled}
        data-selected={isSelected || undefined}
        className={cn(
          'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
          isSelected && 'bg-accent text-accent-foreground',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CommandItem.displayName = 'CommandItem'

/**
 * Visual separator between command groups.
 */
const CommandSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('-mx-1 h-px bg-border', className)} {...props} />
  )
)
CommandSeparator.displayName = 'CommandSeparator'

/**
 * Keyboard shortcut indicator for a command item.
 *
 * @example
 * ```tsx
 * <CommandItem value="save">
 *   Save <CommandShortcut>Ctrl+S</CommandShortcut>
 * </CommandItem>
 * ```
 */
const CommandShortcut = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  )
)
CommandShortcut.displayName = 'CommandShortcut'

export {
  Command,
  commandVariants,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
}
