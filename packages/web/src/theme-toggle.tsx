import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/** Theme mode type. */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * ThemeToggle variant definitions using CVA.
 */
const themeToggleVariants = cva(
  'inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'hover:bg-accent hover:text-accent-foreground',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent/50',
      },
      size: {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

/** Sun icon SVG. */
function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

/** Moon icon SVG. */
function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

/** Monitor icon SVG for system mode. */
function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

/** Props for the ThemeToggle component. */
export interface ThemeToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof themeToggleVariants> {
  /** Current theme mode. If not provided, uses internal state. */
  mode?: ThemeMode
  /** Called when theme changes. */
  onChange?: (mode: ThemeMode) => void
  /** Show label text next to icon. */
  showLabel?: boolean
  /** Include 'system' as a third option. Default true. */
  includeSystem?: boolean
  /** LocalStorage key for persistence. Default 'grit-theme'. */
  storageKey?: string
  /** Custom icon for light mode. */
  lightIcon?: React.ReactNode
  /** Custom icon for dark mode. */
  darkIcon?: React.ReactNode
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Dark/light mode toggle button. Uses system preference by default
 * and persists the user's choice to localStorage.
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * <ThemeToggle variant="outline" showLabel />
 * <ThemeToggle mode={theme} onChange={setTheme} includeSystem={false} />
 * ```
 */
const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  (
    {
      className,
      variant,
      size,
      mode: controlledMode,
      onChange,
      showLabel = false,
      includeSystem = true,
      storageKey = 'grit-theme',
      lightIcon,
      darkIcon,
      ...props
    },
    ref
  ) => {
    const [internalMode, setInternalMode] = React.useState<ThemeMode>(() => {
      if (typeof window === 'undefined') return 'system'
      const stored = localStorage.getItem(storageKey)
      if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
      return 'system'
    })

    const currentMode = controlledMode ?? internalMode

    // Apply theme to document
    React.useEffect(() => {
      if (typeof document === 'undefined') return
      const resolved = currentMode === 'system' ? getSystemTheme() : currentMode
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(resolved)
    }, [currentMode])

    // Listen for system theme changes
    React.useEffect(() => {
      if (currentMode !== 'system' || typeof window === 'undefined') return
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => {
        const resolved = getSystemTheme()
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(resolved)
      }
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }, [currentMode])

    const cycle = () => {
      const modes: ThemeMode[] = includeSystem ? ['light', 'dark', 'system'] : ['light', 'dark']
      const idx = modes.indexOf(currentMode)
      const next = modes[(idx + 1) % modes.length]

      if (controlledMode === undefined) {
        setInternalMode(next)
        try {
          localStorage.setItem(storageKey, next)
        } catch {}
      }
      onChange?.(next)
    }

    const resolvedDisplay = currentMode === 'system' ? getSystemTheme() : currentMode

    const icon =
      currentMode === 'system' ? (
        <MonitorIcon />
      ) : resolvedDisplay === 'dark' ? (
        darkIcon || <MoonIcon />
      ) : (
        lightIcon || <SunIcon />
      )

    const label =
      currentMode === 'system' ? 'System' : currentMode === 'dark' ? 'Dark' : 'Light'

    return (
      <button
        ref={ref}
        type="button"
        onClick={cycle}
        className={cn(themeToggleVariants({ variant, size }), showLabel && 'w-auto px-3 gap-2', className)}
        aria-label={'Toggle theme. Current: ' + label}
        {...props}
      >
        {icon}
        {showLabel && <span className="text-sm">{label}</span>}
      </button>
    )
  }
)
ThemeToggle.displayName = 'ThemeToggle'

export { ThemeToggle, themeToggleVariants }
