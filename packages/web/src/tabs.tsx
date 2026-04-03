import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Tabs style variants.
 */
const tabsListVariants = cva('inline-flex items-center', {
  variants: {
    style: {
      line: 'border-b border-border gap-2',
      card: 'rounded-md bg-muted p-1 gap-1',
    },
  },
  defaultVariants: {
    style: 'line',
  },
})

/** Context for sharing tab state. */
interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
  tabStyle: 'line' | 'card'
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('Tabs compound components must be used within <Tabs>')
  return ctx
}

/** Props for the Tabs root component. */
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled active tab value. */
  value?: string
  /** Default active tab value (uncontrolled). */
  defaultValue?: string
  /** Called when the active tab changes. */
  onValueChange?: (value: string) => void
}

/**
 * Tabs container managing active tab state.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 * ```
 */
const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, value: controlledValue, defaultValue = '', onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const activeValue = controlledValue !== undefined ? controlledValue : internalValue

    const handleChange = React.useCallback(
      (val: string) => {
        if (controlledValue === undefined) setInternalValue(val)
        onValueChange?.(val)
      },
      [controlledValue, onValueChange]
    )

    // Detect tab style from TabsList children
    const [tabStyle, setTabStyle] = React.useState<'line' | 'card'>('line')

    return (
      <TabsContext.Provider value={{ value: activeValue, onValueChange: handleChange, tabStyle }}>
        <div ref={ref} className={cn('w-full', className)} {...props}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && (child.type as any)?.displayName === 'TabsList') {
              const listStyle = (child.props as any).style || 'line'
              if (listStyle !== tabStyle) {
                // We need to set tabStyle but can't setState during render.
                // Instead, pass it directly through context override
              }
            }
            return child
          })}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = 'Tabs'

/** Props for the TabsList component. */
export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListVariants> {}

/** Container for tab triggers. */
const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, style = 'line', ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(tabsListVariants({ style }), className)}
      {...props}
    />
  )
)
TabsList.displayName = 'TabsList'

/** Props for the TabsTrigger component. */
export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Unique value identifying this tab. */
  value: string
}

/** Individual tab button. */
const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const { value: activeValue, onValueChange } = useTabsContext()
    const isActive = activeValue === value

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          isActive
            ? 'border-b-2 border-primary text-foreground'
            : 'text-muted-foreground hover:text-foreground',
          className
        )}
        onClick={() => onValueChange(value)}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

/** Props for the TabsContent component. */
export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value matching a TabsTrigger. */
  value: string
}

/** Content panel shown when its tab is active. */
const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { value: activeValue } = useTabsContext()

    if (activeValue !== value) return null

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className)}
        {...props}
      />
    )
  }
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, tabsListVariants, TabsTrigger, TabsContent }
