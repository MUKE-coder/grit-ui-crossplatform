import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Pressable variant definitions using CVA.
 */
const pressableVariants = cva('select-none', {
  variants: {
    feedback: {
      none: '',
      scale: 'transition-transform active:scale-95',
      opacity: 'transition-opacity active:opacity-70',
      both: 'transition-all active:scale-95 active:opacity-70',
    },
  },
  defaultVariants: {
    feedback: 'scale',
  },
})

/** Context for press state. */
export interface PressableContextValue {
  /** Whether the element is currently being pressed. */
  isPressed: boolean
}

const PressableContext = React.createContext<PressableContextValue>({ isPressed: false })

/**
 * Hook to access the current press state.
 *
 * @example
 * ```tsx
 * function Child() {
 *   const { isPressed } = usePressable()
 *   return <span>{isPressed ? 'Pressed!' : 'Not pressed'}</span>
 * }
 * ```
 */
export function usePressable() {
  return React.useContext(PressableContext)
}

/** Props for the Pressable component. */
export interface PressableProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pressableVariants> {
  /** Render prop alternative. Receives { isPressed }. */
  renderChildren?: (state: PressableContextValue) => React.ReactNode
  /** Called when press begins. */
  onPressStart?: () => void
  /** Called when press ends. */
  onPressEnd?: () => void
  /** Whether the pressable is disabled. */
  disabled?: boolean
  /** Render as inline element. */
  inline?: boolean
}

/**
 * Press state tracking component. Provides isPressed state to children
 * via context or render prop. Adds visual feedback on press.
 *
 * @example
 * ```tsx
 * <Pressable feedback="scale">
 *   <button>Press me</button>
 * </Pressable>
 *
 * <Pressable renderChildren={({ isPressed }) => (
 *   <div className={isPressed ? 'bg-blue-500' : 'bg-gray-500'}>
 *     {isPressed ? 'Pressed' : 'Not pressed'}
 *   </div>
 * )} />
 * ```
 */
const Pressable = React.forwardRef<HTMLDivElement, PressableProps>(
  (
    {
      className,
      feedback,
      renderChildren,
      onPressStart,
      onPressEnd,
      disabled = false,
      inline = false,
      children,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = React.useState(false)

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return
      setIsPressed(true)
      onPressStart?.()
      props.onPointerDown?.(e)
    }

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return
      setIsPressed(false)
      onPressEnd?.()
      props.onPointerUp?.(e)
    }

    const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
      if (isPressed) {
        setIsPressed(false)
        onPressEnd?.()
      }
      props.onPointerLeave?.(e)
    }

    const ctx: PressableContextValue = { isPressed }
    const Tag = inline ? 'span' : 'div'

    return (
      <PressableContext.Provider value={ctx}>
        <Tag
          ref={ref as any}
          className={cn(
            pressableVariants({ feedback }),
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={handlePointerUp}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          {...props}
        >
          {renderChildren ? renderChildren(ctx) : children}
        </Tag>
      </PressableContext.Provider>
    )
  }
)
Pressable.displayName = 'Pressable'

export { Pressable, pressableVariants }
