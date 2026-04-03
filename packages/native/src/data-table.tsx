import React, { useState, useMemo, useCallback } from 'react'
import { View, Text, Pressable, FlatList } from 'react-native'
import { cn } from '@grit-ui/core'

interface Column<T> {
  key: string
  header: string
  width?: number
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  className?: string
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowPress?: (item: T) => void
  emptyMessage?: string
}

function DataTable<T extends Record<string, any>>({
  className,
  columns,
  data,
  keyExtractor,
  onRowPress,
  emptyMessage = 'No data',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)

  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortAsc(!sortAsc)
      } else {
        setSortKey(key)
        setSortAsc(true)
      }
    },
    [sortKey, sortAsc]
  )

  const sortedData = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal < bVal) return sortAsc ? -1 : 1
      if (aVal > bVal) return sortAsc ? 1 : -1
      return 0
    })
  }, [data, sortKey, sortAsc])

  const renderHeader = () => (
    <View className="flex-row border-b border-border bg-muted/50">
      {columns.map((col) => (
        <Pressable
          key={col.key}
          onPress={() => col.sortable && handleSort(col.key)}
          className="justify-center px-3 py-2"
          style={col.width ? { width: col.width } : { flex: 1 }}
        >
          <View className="flex-row items-center gap-1">
            <Text className="text-xs font-medium text-muted-foreground">{col.header}</Text>
            {col.sortable && sortKey === col.key && (
              <Text className="text-xs text-muted-foreground">{sortAsc ? '↑' : '↓'}</Text>
            )}
          </View>
        </Pressable>
      ))}
    </View>
  )

  const renderRow = ({ item }: { item: T }) => (
    <Pressable
      onPress={() => onRowPress?.(item)}
      className="flex-row border-b border-border"
    >
      {columns.map((col) => (
        <View
          key={col.key}
          className="justify-center px-3 py-2"
          style={col.width ? { width: col.width } : { flex: 1 }}
        >
          {col.render ? (
            col.render(item)
          ) : (
            <Text className="text-sm text-foreground">{String(item[col.key] ?? '')}</Text>
          )}
        </View>
      ))}
    </Pressable>
  )

  return (
    <View className={cn('rounded-lg border border-border', className)}>
      {renderHeader()}
      <FlatList
        data={sortedData}
        keyExtractor={keyExtractor}
        renderItem={renderRow}
        ListEmptyComponent={
          <View className="items-center py-8">
            <Text className="text-sm text-muted-foreground">{emptyMessage}</Text>
          </View>
        }
      />
    </View>
  )
}

export { DataTable }
export type { DataTableProps, Column }
