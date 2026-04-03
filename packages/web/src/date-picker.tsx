import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * DatePicker variant definitions using CVA.
 */
const datePickerVariants = cva('relative inline-block', {
  variants: {
    variant: {
      default: '',
      bordered: '[&_input]:border-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

/** Props for the Calendar sub-component. */
export interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Currently displayed month (Date object). */
  month: Date
  /** Currently selected date. */
  selected?: Date | null
  /** Dates that should be disabled. */
  disabledDates?: Date[]
  /** Minimum selectable date. */
  minDate?: Date
  /** Maximum selectable date. */
  maxDate?: Date
  /** Called when a date is selected. */
  onSelect?: (date: Date) => void
  /** Called when month changes. */
  onMonthChange?: (date: Date) => void
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

/**
 * Calendar header with month/year navigation.
 *
 * @example
 * ```tsx
 * <CalendarHeader month={currentMonth} onMonthChange={setMonth} />
 * ```
 */
const CalendarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    month: Date
    onMonthChange?: (date: Date) => void
  }
>(({ className, month, onMonthChange, ...props }, ref) => {
  const prevMonth = () => {
    const d = new Date(month)
    d.setMonth(d.getMonth() - 1)
    onMonthChange?.(d)
  }
  const nextMonth = () => {
    const d = new Date(month)
    d.setMonth(d.getMonth() + 1)
    onMonthChange?.(d)
  }
  const prevYear = () => {
    const d = new Date(month)
    d.setFullYear(d.getFullYear() - 1)
    onMonthChange?.(d)
  }
  const nextYear = () => {
    const d = new Date(month)
    d.setFullYear(d.getFullYear() + 1)
    onMonthChange?.(d)
  }

  const monthName = month.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div ref={ref} className={cn('flex items-center justify-between px-2 py-2', className)} {...props}>
      <div className="flex gap-1">
        <button type="button" onClick={prevYear} className="p-1 rounded hover:bg-accent text-muted-foreground text-xs" aria-label="Previous year">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
        </button>
        <button type="button" onClick={prevMonth} className="p-1 rounded hover:bg-accent text-muted-foreground text-xs" aria-label="Previous month">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      </div>
      <span className="text-sm font-medium text-foreground">{monthName}</span>
      <div className="flex gap-1">
        <button type="button" onClick={nextMonth} className="p-1 rounded hover:bg-accent text-muted-foreground text-xs" aria-label="Next month">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
        <button type="button" onClick={nextYear} className="p-1 rounded hover:bg-accent text-muted-foreground text-xs" aria-label="Next year">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
        </button>
      </div>
    </div>
  )
})
CalendarHeader.displayName = 'CalendarHeader'

/**
 * Single day cell in the calendar grid.
 */
const CalendarDay = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    date: Date
    isSelected?: boolean
    isToday?: boolean
    isOutsideMonth?: boolean
  }
>(({ className, date, isSelected, isToday, isOutsideMonth, disabled, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    disabled={disabled}
    className={cn(
      'h-8 w-8 rounded-md text-sm inline-flex items-center justify-center transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
      isToday && !isSelected && 'border border-primary text-primary',
      isOutsideMonth && 'text-muted-foreground/40',
      disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      className
    )}
    {...props}
  >
    {date.getDate()}
  </button>
))
CalendarDay.displayName = 'CalendarDay'

/**
 * Calendar grid that renders weeks and days.
 */
const CalendarGrid = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, month, selected, disabledDates, minDate, maxDate, onSelect, ...props }, ref) => {
    const year = month.getFullYear()
    const mo = month.getMonth()
    const daysInMonth = getDaysInMonth(year, mo)
    const firstDay = getFirstDayOfWeek(year, mo)
    const today = new Date()

    const isDisabled = (d: Date) => {
      if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true
      if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true
      if (disabledDates?.some((dd) => isSameDay(dd, d))) return true
      return false
    }

    // Build grid
    const cells: React.ReactNode[] = []
    // Previous month fill
    const prevMonthDays = getDaysInMonth(year, mo - 1)
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(year, mo - 1, prevMonthDays - i)
      cells.push(
        <CalendarDay
          key={'prev-' + i}
          date={d}
          isOutsideMonth
          disabled={isDisabled(d)}
          onClick={() => onSelect?.(d)}
        />
      )
    }
    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, mo, day)
      cells.push(
        <CalendarDay
          key={'day-' + day}
          date={d}
          isSelected={selected ? isSameDay(d, selected) : false}
          isToday={isSameDay(d, today)}
          disabled={isDisabled(d)}
          onClick={() => onSelect?.(d)}
        />
      )
    }
    // Next month fill
    const remaining = 42 - cells.length
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, mo + 1, i)
      cells.push(
        <CalendarDay
          key={'next-' + i}
          date={d}
          isOutsideMonth
          disabled={isDisabled(d)}
          onClick={() => onSelect?.(d)}
        />
      )
    }

    return (
      <div ref={ref} className={cn('p-2', className)} {...props}>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="h-8 w-8 text-xs text-muted-foreground flex items-center justify-center font-medium">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{cells}</div>
      </div>
    )
  }
)
CalendarGrid.displayName = 'CalendarGrid'

/**
 * Standalone calendar component combining header and grid.
 *
 * @example
 * ```tsx
 * <Calendar month={currentMonth} selected={date} onSelect={setDate} onMonthChange={setMonth} />
 * ```
 */
const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, month, onMonthChange, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-lg border border-border bg-background shadow-md w-[280px]', className)}>
      <CalendarHeader month={month} onMonthChange={onMonthChange} />
      <CalendarGrid month={month} onMonthChange={onMonthChange} {...props} />
    </div>
  )
)
Calendar.displayName = 'Calendar'

/** Props for the DatePicker component. */
export interface DatePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof datePickerVariants> {
  /** Currently selected date. */
  value?: Date | null
  /** Called when date changes. */
  onChange?: (date: Date | null) => void
  /** Placeholder text. */
  placeholder?: string
  /** Dates that should be disabled. */
  disabledDates?: Date[]
  /** Minimum selectable date. */
  minDate?: Date
  /** Maximum selectable date. */
  maxDate?: Date
  /** Format function for display. */
  formatDate?: (date: Date) => string
  /** Whether the picker is disabled. */
  disabled?: boolean
}

/**
 * Date picker with calendar popup for date selection.
 * Supports month/year navigation, disabled dates, and keyboard navigation.
 *
 * @example
 * ```tsx
 * <DatePicker value={date} onChange={setDate} placeholder="Select date" />
 * <DatePicker minDate={new Date()} disabledDates={[holiday1, holiday2]} />
 * ```
 */
const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      className,
      variant,
      value,
      onChange,
      placeholder = 'Select date...',
      disabledDates,
      minDate,
      maxDate,
      formatDate,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [month, setMonth] = React.useState(() => value || new Date())
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Close on outside click
    React.useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }

    const displayValue = value
      ? formatDate
        ? formatDate(value)
        : value.toLocaleDateString()
      : placeholder

    return (
      <div ref={ref} className={cn(datePickerVariants({ variant }), className)} {...props}>
        <div ref={containerRef} className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen((o) => !o)}
            onKeyDown={handleKeyDown}
            className={cn(
              'flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              !value && 'text-muted-foreground'
            )}
          >
            <svg className="mr-2 h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {displayValue}
          </button>
          {open && (
            <div className="absolute z-50 mt-1">
              <Calendar
                month={month}
                selected={value}
                disabledDates={disabledDates}
                minDate={minDate}
                maxDate={maxDate}
                onMonthChange={setMonth}
                onSelect={(date) => {
                  onChange?.(date)
                  setOpen(false)
                }}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
)
DatePicker.displayName = 'DatePicker'

export { DatePicker, datePickerVariants, Calendar, CalendarHeader, CalendarGrid, CalendarDay }
