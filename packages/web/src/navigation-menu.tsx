import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Context for navigation menu state. */
interface NavigationMenuContextValue {
  activeItem: string | null
  setActiveItem: (id: string | null) => void
}

const NavigationMenuContext = React.createContext<NavigationMenuContextValue>({
  activeItem: null,
  setActiveItem: () => {},
})

/**
 * Horizontal navigation menu with dropdown mega-menus.
 *
 * @example
 * ```tsx
 * <NavigationMenu>
 *   <NavigationMenuList>
 *     <NavigationMenuItem>
 *       <NavigationMenuTrigger>Products</NavigationMenuTrigger>
 *       <NavigationMenuContent>
 *         <div className="grid gap-3 p-4 w-[400px]">...</div>
 *       </NavigationMenuContent>
 *     </NavigationMenuItem>
 *   </NavigationMenuList>
 * </NavigationMenu>
 * ```
 */
const NavigationMenu = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const [activeItem, setActiveItem] = React.useState<string | null>(null)
    const navRef = React.useRef<HTMLElement>(null)

    React.useImperativeHandle(ref, () => navRef.current!)

    React.useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (navRef.current && !navRef.current.contains(e.target as Node)) {
          setActiveItem(null)
        }
      }
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
      <NavigationMenuContext.Provider value={{ activeItem, setActiveItem }}>
        <nav
          ref={navRef}
          className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}
          {...props}
        />
      </NavigationMenuContext.Provider>
    )
  }
)
NavigationMenu.displayName = 'NavigationMenu'

/** List container for navigation items. */
const NavigationMenuList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn('group flex flex-1 list-none items-center justify-center space-x-1', className)}
      {...props}
    />
  )
)
NavigationMenuList.displayName = 'NavigationMenuList'

/** Individual menu item identity context. */
const NavigationMenuItemContext = React.createContext<string>('')

/** Single navigation menu item wrapper. */
const NavigationMenuItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, children, ...props }, ref) => {
    const id = React.useId()
    return (
      <NavigationMenuItemContext.Provider value={id}>
        <li ref={ref} className={cn('relative', className)} {...props}>
          {children}
        </li>
      </NavigationMenuItemContext.Provider>
    )
  }
)
NavigationMenuItem.displayName = 'NavigationMenuItem'

/** Trigger button that opens the dropdown content. */
const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const itemId = React.useContext(NavigationMenuItemContext)
    const { activeItem, setActiveItem } = React.useContext(NavigationMenuContext)
    const isOpen = activeItem === itemId

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:bg-accent focus:text-accent-foreground focus:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          isOpen && 'bg-accent/50',
          className
        )}
        onClick={() => setActiveItem(isOpen ? null : itemId)}
        onMouseEnter={() => {
          if (activeItem !== null) setActiveItem(itemId)
        }}
        {...props}
      >
        {children}
        <svg
          className={cn('relative top-px ml-1 h-3 w-3 transition-transform duration-200', isOpen && 'rotate-180')}
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
    )
  }
)
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger'

/** Dropdown content for a navigation menu item. */
const NavigationMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const itemId = React.useContext(NavigationMenuItemContext)
    const { activeItem } = React.useContext(NavigationMenuContext)

    if (activeItem !== itemId) return null

    return (
      <div
        ref={ref}
        className={cn(
          'absolute left-0 top-full mt-1.5 w-auto overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg',
          'animate-in fade-in-0 zoom-in-95',
          className
        )}
        {...props}
      />
    )
  }
)
NavigationMenuContent.displayName = 'NavigationMenuContent'

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
}
