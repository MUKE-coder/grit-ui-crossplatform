import * as React from 'react'
import { cn } from '@grit-ui/core'

/* ---------------------------------- Context --------------------------------- */

interface InputOTPContextValue {
  value: string[]
  focusedIndex: number
  setFocusedIndex: (index: number) => void
  handleChange: (index: number, char: string) => void
  handleKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
}

const InputOTPContext = React.createContext<InputOTPContextValue | undefined>(undefined)

function useInputOTPContext() {
  const ctx = React.useContext(InputOTPContext)
  if (!ctx) throw new Error('InputOTP compound components must be used within <InputOTP>')
  return ctx
}

/* ---------------------------------- Root ----------------------------------- */

/** Props for the InputOTP component. */
export interface InputOTPProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Number of OTP digits. */
  maxLength?: number
  /** Current value as a string. */
  value?: string
  /** Callback when the value changes. */
  onChange?: (value: string) => void
  /** Called when all slots are filled. */
  onComplete?: (value: string) => void
}

/**
 * One-time password input with individual digit slots.
 * Auto-focuses next slot on input, supports paste.
 *
 * @example
 * ```tsx
 * <InputOTP maxLength={6} onComplete={(code) => verify(code)}>
 *   <InputOTPGroup>
 *     <InputOTPSlot index={0} />
 *     <InputOTPSlot index={1} />
 *     <InputOTPSlot index={2} />
 *   </InputOTPGroup>
 *   <InputOTPSeparator />
 *   <InputOTPGroup>
 *     <InputOTPSlot index={3} />
 *     <InputOTPSlot index={4} />
 *     <InputOTPSlot index={5} />
 *   </InputOTPGroup>
 * </InputOTP>
 * ```
 */
const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  ({ className, maxLength = 6, value: controlledValue, onChange, onComplete, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string[]>(() => Array(maxLength).fill(''))
    const [focusedIndex, setFocusedIndex] = React.useState(-1)
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

    // Sync controlled value
    React.useEffect(() => {
      if (controlledValue !== undefined) {
        const chars = controlledValue.split('').slice(0, maxLength)
        const padded = [...chars, ...Array(maxLength - chars.length).fill('')]
        setInternalValue(padded)
      }
    }, [controlledValue, maxLength])

    const emitChange = React.useCallback(
      (newValue: string[]) => {
        const str = newValue.join('')
        onChange?.(str)
        if (str.length === maxLength && newValue.every((c) => c !== '')) {
          onComplete?.(str)
        }
      },
      [onChange, onComplete, maxLength]
    )

    const handleChange = React.useCallback(
      (index: number, char: string) => {
        if (!/^\d?$/.test(char)) return

        setInternalValue((prev) => {
          const next = [...prev]
          next[index] = char
          emitChange(next)
          return next
        })

        if (char && index < maxLength - 1) {
          inputRefs.current[index + 1]?.focus()
        }
      },
      [maxLength, emitChange]
    )

    const handleKeyDown = React.useCallback(
      (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
          if (internalValue[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus()
            setInternalValue((prev) => {
              const next = [...prev]
              next[index - 1] = ''
              emitChange(next)
              return next
            })
          } else {
            setInternalValue((prev) => {
              const next = [...prev]
              next[index] = ''
              emitChange(next)
              return next
            })
          }
        } else if (e.key === 'ArrowLeft' && index > 0) {
          inputRefs.current[index - 1]?.focus()
        } else if (e.key === 'ArrowRight' && index < maxLength - 1) {
          inputRefs.current[index + 1]?.focus()
        }
      },
      [internalValue, maxLength, emitChange]
    )

    const handlePaste = React.useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, maxLength)
        const chars = pasted.split('')
        setInternalValue((prev) => {
          const next = [...prev]
          chars.forEach((c, i) => {
            if (i < maxLength) next[i] = c
          })
          emitChange(next)
          return next
        })
        const nextIndex = Math.min(chars.length, maxLength - 1)
        inputRefs.current[nextIndex]?.focus()
      },
      [maxLength, emitChange]
    )

    return (
      <InputOTPContext.Provider
        value={{
          value: internalValue,
          focusedIndex,
          setFocusedIndex,
          handleChange,
          handleKeyDown,
          handlePaste,
          inputRefs,
        }}
      >
        <div ref={ref} className={cn('flex items-center gap-2', className)} {...props}>
          {children}
        </div>
      </InputOTPContext.Provider>
    )
  }
)
InputOTP.displayName = 'InputOTP'

/* ---------------------------------- Group ---------------------------------- */

/**
 * Groups OTP slots together visually.
 */
const InputOTPGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center', className)} {...props} />
  )
)
InputOTPGroup.displayName = 'InputOTPGroup'

/* ---------------------------------- Slot ----------------------------------- */

/** Props for InputOTPSlot. */
export interface InputOTPSlotProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Zero-based index of this slot. */
  index: number
}

/**
 * Individual OTP digit input slot.
 */
const InputOTPSlot = React.forwardRef<HTMLInputElement, InputOTPSlotProps>(
  ({ className, index, ...props }, ref) => {
    const { value, focusedIndex, setFocusedIndex, handleChange, handleKeyDown, handlePaste, inputRefs } =
      useInputOTPContext()

    const isFocused = focusedIndex === index
    const hasValue = value[index] !== ''

    return (
      <input
        ref={(node) => {
          inputRefs.current[index] = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
        }}
        type="text"
        inputMode="numeric"
        pattern="\d"
        maxLength={1}
        autoComplete="one-time-code"
        value={value[index] ?? ''}
        onChange={(e) => handleChange(index, e.target.value.slice(-1))}
        onKeyDown={(e) => handleKeyDown(index, e)}
        onPaste={handlePaste}
        onFocus={() => setFocusedIndex(index)}
        onBlur={() => setFocusedIndex(-1)}
        className={cn(
          'relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-center text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
          isFocused && 'z-10 ring-2 ring-ring ring-offset-background',
          className
        )}
        {...props}
      />
    )
  }
)
InputOTPSlot.displayName = 'InputOTPSlot'

/* -------------------------------- Separator -------------------------------- */

/**
 * Visual separator between OTP groups (e.g., a dash).
 */
const InputOTPSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="separator" className={cn('flex items-center', className)} {...props}>
      <span className="text-muted-foreground">-</span>
    </div>
  )
)
InputOTPSeparator.displayName = 'InputOTPSeparator'

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
