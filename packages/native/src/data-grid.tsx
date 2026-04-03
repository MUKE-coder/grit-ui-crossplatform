import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { cn } from '@grit-ui/core'

interface DataGridCell {
  key: string
  content: React.ReactNode | string
  colSpan?: number
}

interface DataGridRow {
  key: string
  cells: DataGridCell[]
}

interface DataGridProps {
  className?: string
  headers: string[]
  rows: DataGridRow[]
  columnWidth?: number
}

function DataGrid({
  className,
  headers,
  rows,
  columnWidth = 120,
}: DataGridProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View className={cn('rounded-lg border border-border', className)}>
        {/* Header */}
        <View className="flex-row bg-muted/50">
          {headers.map((header, i) => (
            <View
              key={i}
              className="border-r border-border px-3 py-2 last:border-r-0"
              style={{ width: columnWidth }}
            >
              <Text className="text-xs font-medium text-muted-foreground">{header}</Text>
            </View>
          ))}
        </View>

        {/* Rows */}
        {rows.map((row) => (
          <View key={row.key} className="flex-row border-t border-border">
            {row.cells.map((cell, i) => (
              <View
                key={cell.key}
                className="border-r border-border px-3 py-2 last:border-r-0"
                style={{ width: columnWidth * (cell.colSpan || 1) }}
              >
                {typeof cell.content === 'string' ? (
                  <Text className="text-sm text-foreground">{cell.content}</Text>
                ) : (
                  cell.content
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export { DataGrid }
export type { DataGridProps, DataGridRow, DataGridCell }
