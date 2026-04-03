import * as React from 'react'
import { cn } from '@grit-ui/core'

/** Text direction type. */
export type Direction = 'ltr' | 'rtl'

/** Context value for direction. */
interface DirectionContextValue {
  /** Current text direction. */
  dir: Direction
  /** Update the direction. */
  setDir: (dir: Direction) => void
}

const DirectionContext = React.createContext<DirectionContextValue>({
  dir: 'ltr',
  setDir: () => {},
})

/**
 * Hook to access the current text direction and setter.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { dir, setDir } = useDirection()
 *   return (
 *     <button onClick={() => setDir(dir === 'ltr' ? 'rtl' : 'ltr')}>
 *       Current: {dir}
 *     </button>
 *   )
 * }
 * ```
 */
export function useDirection() {
  return React.useContext(DirectionContext)
}

/** Props for the DirectionProvider component. */
export interface DirectionProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Initial direction. Default 'ltr'. */
  defaultDir?: Direction
  /** Controlled direction. */
  dir?: Direction
  /** Called when direction changes. */
  onDirChange?: (dir: Direction) => void
}

/**
 * RTL/LTR context provider. Wraps children with the dir attribute
 * and provides direction state via useDirection hook.
 *
 * @example
 * ```tsx
 * <DirectionProvider defaultDir="ltr">
 *   <App />
 * </DirectionProvider>
 *
 * // Nested for specific section
 * <DirectionProvider dir="rtl">
 *   <ArabicContent />
 * </DirectionProvider>
 * ```
 */
const DirectionProvider = React.forwardRef<HTMLDivElement, DirectionProviderProps>(
  ({ className, defaultDir = 'ltr', dir: controlledDir, onDirChange, children, ...props }, ref) => {
    const [internalDir, setInternalDir] = React.useState<Direction>(defaultDir)

    const currentDir = controlledDir ?? internalDir

    const setDir = React.useCallback(
      (newDir: Direction) => {
        if (controlledDir === undefined) {
          setInternalDir(newDir)
        }
        onDirChange?.(newDir)
      },
      [controlledDir, onDirChange]
    )

    const ctx: DirectionContextValue = { dir: currentDir, setDir }

    return (
      <DirectionContext.Provider value={ctx}>
        <div ref={ref} dir={currentDir} className={cn(className)} {...props}>
          {children}
        </div>
      </DirectionContext.Provider>
    )
  }
)
DirectionProvider.displayName = 'DirectionProvider'

export { DirectionProvider }
