import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'
import type { Side } from '@grit-ui/core'

/* ---------------------------------- Context --------------------------------- */

interface DrawerContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  side: Side
}

const DrawerContext = React.createContext<DrawerContextValue | undefined>(undefined)

function useDrawerContext() {
  const ctx = React.useContext(DrawerContext)
  if (!ctx) throw new Error('Drawer compound components must be used within <Drawer>')
  return ctx
}

/* ---------------------------------- Root ----------------------------------- */

/** Props for the Drawer root component. */
export interface DrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  /** Which side the drawer slides in from. */
  side?: Side
  children: React.ReactNode
}

/**
 * Side panel that slides in from any edge of the screen.
 *
 * @example
 * ```tsx
 * <Drawer side="right">
 *   <DrawerTrigger asChild><Button>Open</Button></DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Settings</DrawerTitle>
 *     </DrawerHeader>
 *     <p>Content here</p>
 *     <DrawerFooter>
 *       <DrawerClose asChild><Button variant="outline">Close</Button></DrawerClose>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
function Drawer({ open: controlledOpen, onOpenChange, defaultOpen = false, side = 'right', children }: DrawerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  return (
    <DrawerContext.Provider value={{ open, onOpenChange: handleOpenChange, side }}>
      {children}
    </DrawerContext.Provider>
  )
}
Drawer.displayName = 'Drawer'

/* --------------------------------- Trigger --------------------------------- */

/** Props for DrawerTrigger. */
export interface DrawerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ asChild = false, onClick, children, ...props }, ref) => {
    const { onOpenChange } = useDrawerContext()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      onOpenChange(true)
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, { onClick: handleClick, ref })
    }

    return (
      <button ref={ref} type="button" onClick={handleClick} {...props}>
        {children}
      </button>
    )
  }
)
DrawerTrigger.displayName = 'DrawerTrigger'

/* --------------------------------- Content --------------------------------- */

const drawerContentVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b',
        right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
        bottom: 'inset-x-0 bottom-0 border-t',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
)

const slideIn: Record<Side, string> = {
  top: 'translate-y-0',
  right: 'translate-x-0',
  bottom: 'translate-y-0',
  left: 'translate-x-0',
}

const slideOut: Record<Side, string> = {
  top: '-translate-y-full',
  right: 'translate-x-full',
  bottom: 'translate-y-full',
  left: '-translate-x-full',
}

/** Props for DrawerContent. */
export interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * The drawer panel that slides in from the specified side.
 */
const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange, side } = useDrawerContext()

    React.useEffect(() => {
      if (!open) return
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onOpenChange(false)
      }
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }, [open, onOpenChange])

    React.useEffect(() => {
      if (!open) return
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }, [open])

    if (!open) return null

    const ReactDOM = require('react-dom') as typeof import('react-dom')
    return ReactDOM.createPortal(
      <>
        <div
          className="fixed inset-0 z-50 bg-black/80"
          onClick={() => onOpenChange(false)}
        />
        <div
          ref={ref}
          className={cn(
            drawerContentVariants({ side }),
            slideIn[side],
            className
          )}
          {...props}
        >
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
          {children}
        </div>
      </>,
      document.body
    )
  }
)
DrawerContent.displayName = 'DrawerContent'

/* --------------------------------- Header ---------------------------------- */

const DrawerHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
  )
)
DrawerHeader.displayName = 'DrawerHeader'

/* ---------------------------------- Title ---------------------------------- */

const DrawerTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  )
)
DrawerTitle.displayName = 'DrawerTitle'

/* ------------------------------- Description ------------------------------- */

const DrawerDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
DrawerDescription.displayName = 'DrawerDescription'

/* --------------------------------- Footer ---------------------------------- */

const DrawerFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
  )
)
DrawerFooter.displayName = 'DrawerFooter'

/* ---------------------------------- Close ---------------------------------- */

export interface DrawerCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ asChild = false, onClick, children, ...props }, ref) => {
    const { onOpenChange } = useDrawerContext()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      onOpenChange(false)
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, { onClick: handleClick, ref })
    }

    return (
      <button ref={ref} type="button" onClick={handleClick} {...props}>
        {children}
      </button>
    )
  }
)
DrawerClose.displayName = 'DrawerClose'

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  drawerContentVariants,
}
