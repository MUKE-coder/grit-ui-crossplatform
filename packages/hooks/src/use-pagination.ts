import { useState, useMemo, useCallback } from 'react'

interface UsePaginationOptions {
  total: number
  pageSize: number
  initialPage?: number
}

interface UsePaginationReturn {
  page: number
  pages: number
  nextPage: () => void
  prevPage: () => void
  setPage: (page: number) => void
  hasNext: boolean
  hasPrev: boolean
  range: { start: number; end: number }
}

/**
 * Pagination state management with page navigation and range calculation.
 *
 * @example
 * const { page, pages, nextPage, prevPage, range } = usePagination({ total: 100, pageSize: 10 })
 */
export function usePagination({
  total,
  pageSize,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn {
  const [page, setPageState] = useState(initialPage)

  const pages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  const setPage = useCallback(
    (p: number) => {
      setPageState(Math.max(1, Math.min(p, pages)))
    },
    [pages]
  )

  const nextPage = useCallback(() => setPage(page + 1), [page, setPage])
  const prevPage = useCallback(() => setPage(page - 1), [page, setPage])

  const range = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = Math.min(start + pageSize, total)
    return { start, end }
  }, [page, pageSize, total])

  return {
    page,
    pages,
    nextPage,
    prevPage,
    setPage,
    hasNext: page < pages,
    hasPrev: page > 1,
    range,
  }
}
