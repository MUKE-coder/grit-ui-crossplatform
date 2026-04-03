import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Context for sidenav collapsed state. */
interface SidenavContextValue {
  collapsed: boolean
}

const SidenavContext = React.createContext<SidenavContextValue>({ collapsed: false })

/** Props for the Sidenav component. */
export interface SidenavProps extends React.HTMLAttributes<HTMLElement> {
  /** Whether the sidebar is in collapsed (icons only) mode. */
  collapsed?: boolean
}

/**
 * Sidebar navigation with collapsible mode.
 *
 * @example
 * ```tsx
 * <Sidenav collapsed={false}>
 *   <SidenavGroup label="Main">
 *     <SidenavItem icon={<HomeIcon />} active>Dashboard</SidenavItem>
 *     <SidenavItem icon={<UsersIcon />}>Users</SidenavItem>
 *   </SidenavGroup>
 *   <SidenavSeparator />
 *   <SidenavItem icon={<SettingsIcon />}>Settings</SidenavItem>
 * </Sidenav>
 * ```
 */
const Sidenav = React.forwardRef<HTMLElement, SidenavProps>(
  ({ className, collapsed = false, ...props }, ref) => (
    <SidenavContext.Provider value={{ collapsed }}>
      <aside
        ref={ref}
        className={cn(
          'flex h-full flex-col border-r border-border bg-background transition-[width] duration-200',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
        {...props}
      />
    </SidenavContext.Provider>
  )
)
Sidenav.displayName = 'Sidenav'

/** Props for SidenavItem. */
export interface SidenavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon element rendered before the label. */
  icon?: React.ReactNode
  /** Whether this item is currently active. */
  active?: boolean
}

/** Single navigation item in the sidebar. */
const SidenavItem = React.forwardRef<HTMLButtonElement, SidenavItemProps>(
  ({ className, icon, active = false, children, ...props }, ref) => {
    const { collapsed } = React.useContext(SidenavContext)

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          active
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          collapsed && 'justify-center px-0',
          className
        )}
        title={collapsed && typeof children === 'string' ? children : undefined}
        {...props}
      >
        {icon && <span className="shrink-0 [&_svg]:size-5">{icon}</span>}
        {!collapsed && <span className="truncate">{children}</span>}
      </button>
    )
  }
)
SidenavItem.displayName = 'SidenavItem'

/** Props for SidenavGroup. */
export interface SidenavGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Group heading label. */
  label?: string
}

/** Group of navigation items with an optional label. */
const SidenavGroup = React.forwardRef<HTMLDivElement, SidenavGroupProps>(
  ({ className, label, children, ...props }, ref) => {
    const { collapsed } = React.useContext(SidenavContext)

    return (
      <div ref={ref} className={cn('flex flex-col gap-1 px-2 py-2', className)} {...props}>
        {label && !collapsed && (
          <span className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        )}
        {children}
      </div>
    )
  }
)
SidenavGroup.displayName = 'SidenavGroup'

/** Visual separator between sidenav groups. */
const SidenavSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mx-2 my-1 h-px bg-border', className)} {...props} />
  )
)
SidenavSeparator.displayName = 'SidenavSeparator'

export { Sidenav, SidenavItem, SidenavGroup, SidenavSeparator }
