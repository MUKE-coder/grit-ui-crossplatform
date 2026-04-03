import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface PaginationProps {
  className?: string
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

function getPageNumbers(current: number, total: number, siblings: number): (number | '...')[] {
  const pages: (number | '...')[] = []
  const left = Math.max(1, current - siblings)
  const right = Math.min(total, current + siblings)

  if (left > 1) {
    pages.push(1)
    if (left > 2) pages.push('...')
  }

  for (let i = left; i <= right; i++) {
    pages.push(i)
  }

  if (right < total) {
    if (right < total - 1) pages.push('...')
    pages.push(total)
  }

  return pages
}

function Pagination({
  className,
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages, siblingCount)

  return (
    <View className={cn('flex-row items-center gap-1', className)}>
      <Pressable
        onPress={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'h-9 w-9 items-center justify-center rounded-md',
          currentPage <= 1 ? 'opacity-50' : 'bg-muted'
        )}
      >
        <Text className="text-sm text-foreground">‹</Text>
      </Pressable>

      {pages.map((page, i) =>
        page === '...' ? (
          <Text key={'dots-' + i} className="px-2 text-sm text-muted-foreground">
            ...
          </Text>
        ) : (
          <Pressable
            key={page}
            onPress={() => onPageChange(page)}
            className={cn(
              'h-9 w-9 items-center justify-center rounded-md',
              page === currentPage ? 'bg-primary' : 'bg-muted'
            )}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                page === currentPage ? 'text-primary-foreground' : 'text-foreground'
              )}
            >
              {page}
            </Text>
          </Pressable>
        )
      )}

      <Pressable
        onPress={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'h-9 w-9 items-center justify-center rounded-md',
          currentPage >= totalPages ? 'opacity-50' : 'bg-muted'
        )}
      >
        <Text className="text-sm text-foreground">›</Text>
      </Pressable>
    </View>
  )
}

export { Pagination }
export type { PaginationProps }
