import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/* ---------------------------------- Types ---------------------------------- */

type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

interface ToastData {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: 'default' | 'success' | 'destructive' | 'warning'
  duration?: number
}

/* ---------------------------------- Store ---------------------------------- */

type ToastListener = () => void

let toasts: ToastData[] = []
const listeners: Set<ToastListener> = new Set()

function notify() {
  listeners.forEach((l) => l())
}

function addToast(toast: Omit<ToastData, 'id'>): string {
  const id = Math.random().toString(36).slice(2, 10)
  toasts = [...toasts, { id, ...toast }]
  notify()
  return id
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id)
  notify()
}

function useToastStore() {
  const [, forceRender] = React.useState(0)

  React.useEffect(() => {
    const listener = () => forceRender((c) => c + 1)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return toasts
}

/* ---------------------------------- Hook ----------------------------------- */

/**
 * Hook to trigger toast notifications.
 *
 * @example
 * ```tsx
 * const { toast } = useToast()
 * toast({ title: "Saved", description: "Changes saved.", variant: "success" })
 * ```
 */
export function useToast() {
  return {
    toast: (props: Omit<ToastData, 'id'>) => addToast(props),
    dismiss: (id: string) => removeToast(id),
  }
}

/* -------------------------------- Variants --------------------------------- */

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        success: 'border-emerald-500/50 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
        destructive: 'destructive group border-destructive bg-destructive text-destructive-foreground',
        warning: 'border-amber-500/50 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const positionClasses: Record<ToastPosition, string> = {
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'top-center': 'top-0 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
}

/* --------------------------------- Toaster --------------------------------- */

/** Props for the Toaster container. */
export interface ToasterProps {
  /** Where toasts appear on screen. */
  position?: ToastPosition
  /** Default auto-dismiss duration in ms. */
  duration?: number
}

/**
 * Toast notification container. Place once at app root.
 *
 * @example
 * ```tsx
 * <Toaster position="bottom-right" />
 * ```
 */
function Toaster({ position = 'bottom-right', duration = 5000 }: ToasterProps) {
  const currentToasts = useToastStore()

  return (
    <div
      className={cn(
        'fixed z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[420px]',
        positionClasses[position]
      )}
    >
      {currentToasts.map((t) => (
        <Toast key={t.id} data={t} duration={t.duration ?? duration} />
      ))}
    </div>
  )
}
Toaster.displayName = 'Toaster'

/* ---------------------------------- Toast ---------------------------------- */

interface ToastInternalProps {
  data: ToastData
  duration: number
}

function Toast({ data, duration }: ToastInternalProps) {
  React.useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(() => removeToast(data.id), duration)
    return () => clearTimeout(timer)
  }, [data.id, duration])

  return (
    <div className={cn(toastVariants({ variant: data.variant }))}>
      <div className="grid gap-1">
        {data.title && <ToastTitle>{data.title}</ToastTitle>}
        {data.description && <ToastDescription>{data.description}</ToastDescription>}
      </div>
      {data.action && <ToastAction>{data.action}</ToastAction>}
      <ToastClose onClick={() => removeToast(data.id)} />
    </div>
  )
}

/* ---------------------------------- Title ---------------------------------- */

const ToastTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm font-semibold', className)} {...props} />
  )
)
ToastTitle.displayName = 'ToastTitle'

/* ------------------------------- Description ------------------------------- */

const ToastDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm opacity-90', className)} {...props} />
  )
)
ToastDescription.displayName = 'ToastDescription'

/* --------------------------------- Action ---------------------------------- */

const ToastAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('shrink-0', className)} {...props} />
  )
)
ToastAction.displayName = 'ToastAction'

/* ---------------------------------- Close ---------------------------------- */

export interface ToastCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
        className
      )}
      {...props}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  )
)
ToastClose.displayName = 'ToastClose'

export {
  Toaster,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  toastVariants,
}
