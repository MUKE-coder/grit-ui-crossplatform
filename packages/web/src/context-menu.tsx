import * as React from 'react'
import { cn } from '@grit-ui/core'

/* ---------------------------------- Context --------------------------------- */

interface ContextMenuContextValue {
  open: boolean
  position: { x: number; y: number }
  onOpenChange: (open: boolean) => void
  setPosition: (pos: { x: number; y: number }) => void
}

const ContextMenuContext = React.createContext<ContextMenuContextValue | undefined>(undefined)

function useContextMenuContext() {
  const ctx = React.useContext(ContextMenuContext)
  if (!ctx) throw new Error('ContextMenu compound components must be used within <ContextMenu>')
  return ctx
}

/* -------------------------------- SubMenu Context ----------------------------- */

interface SubMenuContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement>
}

const SubMenuContext = React.createContext<SubMenuContextValue | undefined>(undefined)

function useSubMenuContext() {
  const ctx = React.useContext(SubMenuContext)
  if (!ctx) throw new Error('ContextMenuSub compound components must be used within <ContextMenuSub>')
  return ctx
}

/* ---------------------------------- Root ----------------------------------- */

/** Props for the ContextMenu root component. */
export interface ContextMenuProps {
  children: React.ReactNode
}

/**
 * Right-click context menu with nested submenus.
 *
 * @example
 * ```tsx
 * <ContextMenu>
 *   <ContextMenuTrigger className="h-40 w-full border border-dashed">
 *     Right click here
 *   </ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <ContextMenuItem>Copy</ContextMenuItem>
 *     <ContextMenuItem>Paste</ContextMenuItem>
 *     <ContextMenuSeparator />
 *     <ContextMenuSub>
 *       <ContextMenuSubTrigger>More</ContextMenuSubTrigger>
 *       <ContextMenuSubContent>
 *         <ContextMenuItem>Save As</ContextMenuItem>
 *       </ContextMenuSubContent>
 *     </ContextMenuSub>
 *   </ContextMenuContent>
 * </ContextMenu>
 * ```
 */
function ContextMenu({ children }: ContextMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  return (
    <ContextMenuContext.Provider value={{ open, position, onOpenChange: setOpen, setPosition }}>
      {children}
    </ContextMenuContext.Provider>
  )
}
ContextMenu.displayName = 'ContextMenu'

/* --------------------------------- Trigger --------------------------------- */

export interface ContextMenuTriggerProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * The area that triggers the context menu on right-click.
 */
const ContextMenuTrigger = React.forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  ({ className, onContextMenu, children, ...props }, ref) => {
    const { onOpenChange, setPosition } = useContextMenuContext()

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      onContextMenu?.(e)
      setPosition({ x: e.clientX, y: e.clientY })
      onOpenChange(true)
    }

    return (
      <div ref={ref} onContextMenu={handleContextMenu} className={className} {...props}>
        {children}
      </div>
    )
  }
)
ContextMenuTrigger.displayName = 'ContextMenuTrigger'

/* --------------------------------- Content --------------------------------- */

export interface ContextMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * The context menu content panel.
 */
const ContextMenuContent = React.forwardRef<HTMLDivElement, ContextMenuContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, position, onOpenChange } = useContextMenuContext()
    const contentRef = React.useRef<HTMLDivElement>(null)

    // Click outside to close
    React.useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
          onOpenChange(false)
        }
      }
      // Use setTimeout to avoid closing immediately on the contextmenu event
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handler)
      }, 0)
      return () => {
        clearTimeout(timer)
        document.removeEventListener('mousedown', handler)
      }
    }, [open, onOpenChange])

    // Escape to close
    React.useEffect(() => {
      if (!open) return
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onOpenChange(false)
      }
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }, [open, onOpenChange])

    if (!open) return null

    const ReactDOM = require('react-dom') as typeof import('react-dom')
    return ReactDOM.createPortal(
      <div
        ref={(node) => {
          ;(contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          zIndex: 50,
        }}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
          className
        )}
        {...props}
      >
        {children}
      </div>,
      document.body
    )
  }
)
ContextMenuContent.displayName = 'ContextMenuContent'

/* ---------------------------------- Item ----------------------------------- */

export interface ContextMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the item is disabled. */
  disabled?: boolean
  /** Keyboard shortcut to display. */
  shortcut?: string
}

/**
 * A single context menu item.
 */
const ContextMenuItem = React.forwardRef<HTMLDivElement, ContextMenuItemProps>(
  ({ className, disabled = false, shortcut, children, onClick, ...props }, ref) => {
    const { onOpenChange } = useContextMenuContext()

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return
      onClick?.(e)
      onOpenChange(false)
    }

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={handleClick}
        className={cn(
          'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
          disabled ? 'pointer-events-none opacity-50' : 'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          className
        )}
        {...props}
      >
        {children}
        {shortcut && (
          <span className="ml-auto text-xs tracking-widest text-muted-foreground">{shortcut}</span>
        )}
      </div>
    )
  }
)
ContextMenuItem.displayName = 'ContextMenuItem'

/* -------------------------------- Separator -------------------------------- */

/**
 * A visual separator between menu items.
 */
const ContextMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="separator" className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
  )
)
ContextMenuSeparator.displayName = 'ContextMenuSeparator'

/* ----------------------------------- Sub ----------------------------------- */

export interface ContextMenuSubProps {
  children: React.ReactNode
}

/**
 * Container for a submenu.
 */
function ContextMenuSub({ children }: ContextMenuSubProps) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLElement>(null!)

  return (
    <SubMenuContext.Provider value={{ open, onOpenChange: setOpen, triggerRef }}>
      <div className="relative">{children}</div>
    </SubMenuContext.Provider>
  )
}
ContextMenuSub.displayName = 'ContextMenuSub'

/* ------------------------------ SubTrigger -------------------------------- */

export interface ContextMenuSubTriggerProps extends React.HTMLAttributes<HTMLDivElement> {}

const ContextMenuSubTrigger = React.forwardRef<HTMLDivElement, ContextMenuSubTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { onOpenChange, triggerRef } = useSubMenuContext()

    return (
      <div
        ref={(node) => {
          ;(triggerRef as React.MutableRefObject<HTMLElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        role="menuitem"
        tabIndex={0}
        onMouseEnter={() => onOpenChange(true)}
        onMouseLeave={() => onOpenChange(false)}
        className={cn(
          'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          className
        )}
        {...props}
      >
        {children}
        <svg className="ml-auto h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    )
  }
)
ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger'

/* ------------------------------- SubContent ------------------------------- */

export interface ContextMenuSubContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const ContextMenuSubContent = React.forwardRef<HTMLDivElement, ContextMenuSubContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = useSubMenuContext()

    if (!open) return null

    return (
      <div
        ref={ref}
        onMouseEnter={() => onOpenChange(true)}
        onMouseLeave={() => onOpenChange(false)}
        className={cn(
          'absolute left-full top-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ContextMenuSubContent.displayName = 'ContextMenuSubContent'

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
}
