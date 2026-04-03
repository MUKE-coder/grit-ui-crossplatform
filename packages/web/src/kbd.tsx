import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Props for the Kbd component. */
export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Key combination as an array of keys (e.g. ['Ctrl', 'S']). If provided, overrides children. */
  keys?: string[]
}

/**
 * Keyboard shortcut indicator. Renders styled key caps.
 *
 * @example
 * ```tsx
 * <Kbd keys={['Ctrl', 'S']} />
 * <Kbd>Shift + Enter</Kbd>
 * ```
 */
const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, keys, children, ...props }, ref) => {
  if (keys && keys.length > 0) {
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={cn('inline-flex items-center gap-1', className)} {...props}>
        {keys.map((key, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-xs text-muted-foreground">+</span>}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              {key}
            </kbd>
          </React.Fragment>
        ))}
      </span>
    )
  }

  return (
    <kbd
      ref={ref}
      className={cn(
        'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
})
Kbd.displayName = 'Kbd'

export { Kbd }
