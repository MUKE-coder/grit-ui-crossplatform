import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * ActionBar variant definitions using CVA.
 */
const actionBarVariants = cva(
  'fixed left-0 right-0 z-50 flex items-center justify-center transition-transform duration-300',
  {
    variants: {
      position: {
        top: 'top-0',
        bottom: 'bottom-0',
      },
      variant: {
        default: 'bg-background/95 backdrop-blur-sm border-border shadow-lg',
        solid: 'bg-background border-border shadow-lg',
        transparent: 'bg-transparent',
      },
    },
    compoundVariants: [
      { position: 'top', variant: 'default', className: 'border-b' },
      { position: 'top', variant: 'solid', className: 'border-b' },
      { position: 'bottom', variant: 'default', className: 'border-t' },
      { position: 'bottom', variant: 'solid', className: 'border-t' },
    ],
    defaultVariants: {
      position: 'bottom',
      variant: 'default',
    },
  }
)

/** Props for the ActionBar component. */
export interface ActionBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof actionBarVariants> {
  /** Hide/show on scroll. When true, bar hides when scrolling in the direction away from it. */
  hideOnScroll?: boolean
  /** Scroll threshold in pixels before hiding. Default 50. */
  scrollThreshold?: number
  /** Fixed visible (overrides hideOnScroll). */
  visible?: boolean
  /** Padding for the inner content. */
  innerClassName?: string
}

/**
 * Sticky action bar (floating toolbar) that can be positioned at top or bottom.
 * Supports show/hide on scroll and accepts actions as children.
 *
 * @example
 * ```tsx
 * <ActionBar position="bottom" hideOnScroll>
 *   <button>Save</button>
 *   <button>Cancel</button>
 * </ActionBar>
 *
 * <ActionBar position="top" variant="solid">
 *   <nav>Navigation items</nav>
 * </ActionBar>
 * ```
 */
const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(
  (
    {
      className,
      position = 'bottom',
      variant,
      hideOnScroll = false,
      scrollThreshold = 50,
      visible: controlledVisible,
      innerClassName,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true)
    const lastScrollY = React.useRef(0)

    React.useEffect(() => {
      if (!hideOnScroll || controlledVisible !== undefined) return

      const handleScroll = () => {
        const currentScrollY = window.scrollY
        const delta = currentScrollY - lastScrollY.current

        if (position === 'bottom') {
          // Hide when scrolling down, show when scrolling up
          if (delta > scrollThreshold) {
            setIsVisible(false)
            lastScrollY.current = currentScrollY
          } else if (delta < -scrollThreshold) {
            setIsVisible(true)
            lastScrollY.current = currentScrollY
          }
        } else {
          // Top bar: hide when scrolling up (away), show when scrolling down
          if (delta < -scrollThreshold) {
            setIsVisible(false)
            lastScrollY.current = currentScrollY
          } else if (delta > scrollThreshold) {
            setIsVisible(true)
            lastScrollY.current = currentScrollY
          }
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }, [hideOnScroll, scrollThreshold, position, controlledVisible])

    const shown = controlledVisible !== undefined ? controlledVisible : isVisible

    const hiddenTransform =
      position === 'bottom' ? 'translateY(100%)' : 'translateY(-100%)'

    return (
      <div
        ref={ref}
        className={cn(actionBarVariants({ position, variant }), className)}
        style={{
          transform: shown ? 'translateY(0)' : hiddenTransform,
        }}
        {...props}
      >
        <div className={cn('flex items-center gap-2 px-4 py-2 w-full max-w-screen-xl mx-auto', innerClassName)}>
          {children}
        </div>
      </div>
    )
  }
)
ActionBar.displayName = 'ActionBar'

export { ActionBar, actionBarVariants }
