import * as React from 'react'
import { cn } from '@grit-ui/core'

/* ---------------------------------- Root ----------------------------------- */

/** Props for the InputGroup component. */
export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Composite input group: icon prefix + input + button suffix.
 * Children should be InputGroupIcon, an input element, and/or InputGroupButton.
 *
 * @example
 * ```tsx
 * <InputGroup>
 *   <InputGroupIcon>
 *     <SearchIcon />
 *   </InputGroupIcon>
 *   <input type="text" placeholder="Search..." />
 *   <InputGroupButton>Go</InputGroupButton>
 * </InputGroup>
 * ```
 */
const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex h-10 w-full items-center rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 [&>input]:flex [&>input]:h-full [&>input]:w-full [&>input]:border-0 [&>input]:bg-transparent [&>input]:px-3 [&>input]:py-2 [&>input]:text-sm [&>input]:placeholder:text-muted-foreground [&>input]:focus-visible:outline-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
InputGroup.displayName = 'InputGroup'

/* ---------------------------------- Icon ----------------------------------- */

/** Props for InputGroupIcon. */
export interface InputGroupIconProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Icon prefix for the input group.
 */
const InputGroupIcon = React.forwardRef<HTMLSpanElement, InputGroupIconProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'flex items-center justify-center px-3 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4',
        className
      )}
      {...props}
    />
  )
)
InputGroupIcon.displayName = 'InputGroupIcon'

/* --------------------------------- Button ---------------------------------- */

/** Props for InputGroupButton. */
export interface InputGroupButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Button suffix for the input group.
 */
const InputGroupButton = React.forwardRef<HTMLButtonElement, InputGroupButtonProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex h-full items-center justify-center rounded-r-md border-l bg-muted px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
)
InputGroupButton.displayName = 'InputGroupButton'

export { InputGroup, InputGroupIcon, InputGroupButton }
