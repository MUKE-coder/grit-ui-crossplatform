import { useState, useCallback } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

/**
 * Breadcrumb path management. Push, pop, or replace the entire breadcrumb trail.
 *
 * @example
 * const { items, push, pop } = useBreadcrumb()
 * push({ label: 'Products', href: '/products' })
 */
export function useBreadcrumb(initialItems: BreadcrumbItem[] = []): {
  items: BreadcrumbItem[]
  push: (item: BreadcrumbItem) => void
  pop: () => void
  set: (items: BreadcrumbItem[]) => void
} {
  const [items, setItems] = useState<BreadcrumbItem[]>(initialItems)

  const push = useCallback((item: BreadcrumbItem) => {
    setItems((prev) => [...prev, item])
  }, [])

  const pop = useCallback(() => {
    setItems((prev) => prev.slice(0, -1))
  }, [])

  const set = useCallback((newItems: BreadcrumbItem[]) => {
    setItems(newItems)
  }, [])

  return { items, push, pop, set }
}
