import { useState, useCallback } from 'react'

/**
 * Date picker day click handler. Manages selected date state
 * and invokes the onSelect callback.
 *
 * @example
 * const { handleDayClick, selectedDate } = useHandleDayClick((date) => console.log(date))
 */
export function useHandleDayClick(onSelect: (date: Date) => void): {
  handleDayClick: (date: Date) => void
  selectedDate: Date | null
} {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleDayClick = useCallback(
    (date: Date) => {
      setSelectedDate(date)
      onSelect(date)
    },
    [onSelect]
  )

  return { handleDayClick, selectedDate }
}
