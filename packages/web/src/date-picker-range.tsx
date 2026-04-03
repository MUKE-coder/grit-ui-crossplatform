import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * DatePickerRange variant definitions using CVA.
 */
const datePickerRangeVariants = cva('relative inline-block', {
  variants: {
    variant: {
      default: '',
      bordered: '[&_button]:border-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

/** Date range value. */
export interface DateRange {
  start: Date | null
  end: Date | null
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isInRange(d: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false
  const t = d.getTime()
  return t >= start.getTime() && t <= end.getTime()
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

interface RangeMonthProps {
  month: Date
  range: DateRange
  hoverDate: Date | null
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  onDateClick: (date: Date) => void
  onDateHover: (date: Date | null) => void
}

/** Single month view for range picker. */
function RangeMonth({ month, range, hoverDate, minDate, maxDate, disabledDates, onDateClick, onDateHover }: RangeMonthProps) {
  const year = month.getFullYear()
  const mo = month.getMonth()
  const daysInMonth = getDaysInMonth(year, mo)
  const firstDay = getFirstDayOfWeek(year, mo)
  const today = new Date()

  const effectiveEnd = range.end || (range.start && hoverDate && hoverDate > range.start ? hoverDate : null)

  const isDisabled = (d: Date) => {
    if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true
    if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true
    if (disabledDates?.some((dd) => isSameDay(dd, d))) return true
    return false
  }

  const cells: React.ReactNode[] = []
  const prevMonthDays = getDaysInMonth(year, mo - 1)
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(year, mo - 1, prevMonthDays - i)
    cells.push(
      <button
        key={'prev-' + i}
        type="button"
        disabled
        className="h-8 w-8 rounded-md text-sm text-muted-foreground/40 inline-flex items-center justify-center"
      >
        {d.getDate()}
      </button>
    )
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, mo, day)
    const isStart = range.start ? isSameDay(d, range.start) : false
    const isEnd = range.end ? isSameDay(d, range.end) : false
    const inRange = isInRange(d, range.start, effectiveEnd)
    const isToday = isSameDay(d, today)
    const dis = isDisabled(d)

    cells.push(
      <button
        key={'day-' + day}
        type="button"
        disabled={dis}
        className={cn(
          'h-8 w-8 rounded-md text-sm inline-flex items-center justify-center transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          (isStart || isEnd) && 'bg-primary text-primary-foreground hover:bg-primary/90',
          inRange && !isStart && !isEnd && 'bg-primary/15 text-foreground',
          isToday && !isStart && !isEnd && 'border border-primary',
          dis && 'opacity-50 cursor-not-allowed pointer-events-none'
        )}
        onClick={() => onDateClick(d)}
        onMouseEnter={() => onDateHover(d)}
        onMouseLeave={() => onDateHover(null)}
      >
        {day}
      </button>
    )
  }

  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) {
    cells.push(
      <button
        key={'next-' + i}
        type="button"
        disabled
        className="h-8 w-8 rounded-md text-sm text-muted-foreground/40 inline-flex items-center justify-center"
      >
        {i}
      </button>
    )
  }

  const monthName = month.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="p-2">
      <div className="text-center text-sm font-medium text-foreground mb-2">{monthName}</div>
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

/** Props for the DatePickerRange component. */
export interface DatePickerRangeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof datePickerRangeVariants> {
  /** Currently selected range. */
  value?: DateRange
  /** Called when range changes. */
  onChange?: (range: DateRange) => void
  /** Placeholder text. */
  placeholder?: string
  /** Minimum selectable date. */
  minDate?: Date
  /** Maximum selectable date. */
  maxDate?: Date
  /** Dates that should be disabled. */
  disabledDates?: Date[]
  /** Format function for date display. */
  formatDate?: (date: Date) => string
  /** Whether the picker is disabled. */
  disabled?: boolean
}

/**
 * Date range picker with two calendar months side by side.
 * Supports start/end selection with visual range highlight.
 *
 * @example
 * ```tsx
 * <DatePickerRange value={range} onChange={setRange} placeholder="Select dates" />
 * ```
 */
const DatePickerRange = React.forwardRef<HTMLDivElement, DatePickerRangeProps>(
  (
    {
      className,
      variant,
      value = { start: null, end: null },
      onChange,
      placeholder = 'Select date range...',
      minDate,
      maxDate,
      disabledDates,
      formatDate,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [leftMonth, setLeftMonth] = React.useState(() => {
      const d = value.start || new Date()
      return new Date(d.getFullYear(), d.getMonth(), 1)
    })
    const [hoverDate, setHoverDate] = React.useState<Date | null>(null)
    const [selecting, setSelecting] = React.useState<'start' | 'end'>('start')
    const containerRef = React.useRef<HTMLDivElement>(null)

    const rightMonth = new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1)

    React.useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleDateClick = (date: Date) => {
      if (selecting === 'start') {
        onChange?.({ start: date, end: null })
        setSelecting('end')
      } else {
        if (value.start && date >= value.start) {
          onChange?.({ start: value.start, end: date })
        } else {
          onChange?.({ start: date, end: null })
        }
        setSelecting('start')
        if (value.start && date >= value.start) {
          setOpen(false)
        }
      }
    }

    const prevMonth = () => {
      setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() - 1, 1))
    }
    const nextMonth = () => {
      setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1))
    }

    const fmt = (d: Date) => (formatDate ? formatDate(d) : d.toLocaleDateString())
    const displayValue =
      value.start && value.end
        ? fmt(value.start) + ' - ' + fmt(value.end)
        : value.start
          ? fmt(value.start) + ' - ...'
          : placeholder

    return (
      <div ref={ref} className={cn(datePickerRangeVariants({ variant }), className)} {...props}>
        <div ref={containerRef} className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen((o) => !o)}
            className={cn(
              'flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              !value.start && 'text-muted-foreground'
            )}
          >
            <svg className="mr-2 h-4 w-4 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {displayValue}
          </button>
          {open && (
            <div className="absolute z-50 mt-1 rounded-lg border border-border bg-background shadow-md">
              <div className="flex items-center justify-between px-4 pt-2">
                <button type="button" onClick={prevMonth} className="p-1 rounded hover:bg-accent text-muted-foreground" aria-label="Previous month">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <button type="button" onClick={nextMonth} className="p-1 rounded hover:bg-accent text-muted-foreground" aria-label="Next month">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
              <div className="flex">
                <RangeMonth
                  month={leftMonth}
                  range={value}
                  hoverDate={hoverDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  disabledDates={disabledDates}
                  onDateClick={handleDateClick}
                  onDateHover={setHoverDate}
                />
                <div className="w-px bg-border" />
                <RangeMonth
                  month={rightMonth}
                  range={value}
                  hoverDate={hoverDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  disabledDates={disabledDates}
                  onDateClick={handleDateClick}
                  onDateHover={setHoverDate}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)
DatePickerRange.displayName = 'DatePickerRange'

export { DatePickerRange, datePickerRangeVariants }
