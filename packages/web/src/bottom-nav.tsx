import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Props for the BottomNav component. */
export interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {}

/**
 * Fixed bottom navigation bar for mobile layouts.
 *
 * @example
 * ```tsx
 * <BottomNav>
 *   <BottomNavItem icon={<HomeIcon />} label="Home" active />
 *   <BottomNavItem icon={<SearchIcon />} label="Search" />
 *   <BottomNavItem icon={<BellIcon />} label="Alerts" badge={3} />
 * </BottomNav>
 * ```
 */
const BottomNav = React.forwardRef<HTMLElement, BottomNavProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background px-2 py-1 safe-area-pb',
        className
      )}
      {...props}
    />
  )
)
BottomNav.displayName = 'BottomNav'

/** Props for BottomNavItem. */
export interface BottomNavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon element. */
  icon: React.ReactNode
  /** Label text below the icon. */
  label: string
  /** Whether this item is currently active. */
  active?: boolean
  /** Badge count displayed on the icon. */
  badge?: number
}

/** Individual item in the bottom navigation bar. */
const BottomNavItem = React.forwardRef<HTMLButtonElement, BottomNavItemProps>(
  ({ className, icon, label, active = false, badge, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors',
        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
        className
      )}
      {...props}
    >
      <span className="relative [&_svg]:size-5">
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  )
)
BottomNavItem.displayName = 'BottomNavItem'

export { BottomNav, BottomNavItem }
