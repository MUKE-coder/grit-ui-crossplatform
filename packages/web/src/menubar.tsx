import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Context for the active menu. */
interface MenubarContextValue {
  activeMenu: string | null
  setActiveMenu: (id: string | null) => void
}

const MenubarContext = React.createContext<MenubarContextValue>({
  activeMenu: null,
  setActiveMenu: () => {},
})

/**
 * macOS-style menu bar.
 *
 * @example
 * ```tsx
 * <Menubar>
 *   <MenubarMenu>
 *     <MenubarTrigger>File</MenubarTrigger>
 *     <MenubarContent>
 *       <MenubarItem>New Tab <MenubarShortcut>Ctrl+T</MenubarShortcut></MenubarItem>
 *       <MenubarSeparator />
 *       <MenubarItem>Exit</MenubarItem>
 *     </MenubarContent>
 *   </MenubarMenu>
 * </Menubar>
 * ```
 */
const Menubar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const [activeMenu, setActiveMenu] = React.useState<string | null>(null)
    const menubarRef = React.useRef<HTMLDivElement>(null)

    React.useImperativeHandle(ref, () => menubarRef.current!)

    // Close on outside click
    React.useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (menubarRef.current && !menubarRef.current.contains(e.target as Node)) {
          setActiveMenu(null)
        }
      }
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
      <MenubarContext.Provider value={{ activeMenu, setActiveMenu }}>
        <div
          ref={menubarRef}
          className={cn(
            'flex h-10 items-center space-x-1 rounded-md border border-border bg-background p-1',
            className
          )}
          {...props}
        />
      </MenubarContext.Provider>
    )
  }
)
Menubar.displayName = 'Menubar'

/** Context for individual menu identity. */
const MenubarMenuContext = React.createContext<string>('')

/** Single menu within the menubar. */
const MenubarMenu: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const id = React.useId()
  return (
    <MenubarMenuContext.Provider value={id}>
      <div className="relative">{children}</div>
    </MenubarMenuContext.Provider>
  )
}
MenubarMenu.displayName = 'MenubarMenu'

/** Trigger button for a menu. */
const MenubarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const menuId = React.useContext(MenubarMenuContext)
    const { activeMenu, setActiveMenu } = React.useContext(MenubarContext)
    const isOpen = activeMenu === menuId

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none',
          isOpen ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground',
          className
        )}
        onClick={() => setActiveMenu(isOpen ? null : menuId)}
        onMouseEnter={() => {
          if (activeMenu !== null && activeMenu !== menuId) {
            setActiveMenu(menuId)
          }
        }}
        {...props}
      />
    )
  }
)
MenubarTrigger.displayName = 'MenubarTrigger'

/** Dropdown content for a menu. */
const MenubarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const menuId = React.useContext(MenubarMenuContext)
    const { activeMenu } = React.useContext(MenubarContext)

    if (activeMenu !== menuId) return null

    return (
      <div
        ref={ref}
        className={cn(
          'absolute left-0 top-full z-50 mt-1 min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
          'animate-in fade-in-0 zoom-in-95',
          className
        )}
        {...props}
      />
    )
  }
)
MenubarContent.displayName = 'MenubarContent'

/** Props for MenubarItem. */
export interface MenubarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether this item is an inset item (extra left padding). */
  inset?: boolean
}

/** Individual menu item. */
const MenubarItem = React.forwardRef<HTMLButtonElement, MenubarItemProps>(
  ({ className, inset, ...props }, ref) => {
    const { setActiveMenu } = React.useContext(MenubarContext)

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
          'hover:bg-accent hover:text-accent-foreground',
          'disabled:pointer-events-none disabled:opacity-50',
          inset && 'pl-8',
          className
        )}
        onClick={(e) => {
          props.onClick?.(e)
          setActiveMenu(null)
        }}
        {...props}
      />
    )
  }
)
MenubarItem.displayName = 'MenubarItem'

/** Separator within a menu dropdown. */
const MenubarSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
  )
)
MenubarSeparator.displayName = 'MenubarSeparator'

/** Shortcut label aligned to the right of a menu item. */
const MenubarShortcut = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...props} />
  )
)
MenubarShortcut.displayName = 'MenubarShortcut'

export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarShortcut }
