import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { cn } from '@grit-ui/core'

interface TableProps {
  className?: string
  children: React.ReactNode
}

function Table({ className, children }: TableProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className={cn('min-w-full', className)}>{children}</View>
    </ScrollView>
  )
}

interface TableHeaderProps {
  className?: string
  children: React.ReactNode
}

function TableHeader({ className, children }: TableHeaderProps) {
  return (
    <View className={cn('flex-row border-b border-border bg-muted/50', className)}>
      {children}
    </View>
  )
}

interface TableRowProps {
  className?: string
  children: React.ReactNode
}

function TableRow({ className, children }: TableRowProps) {
  return (
    <View className={cn('flex-row border-b border-border', className)}>{children}</View>
  )
}

interface TableHeadProps {
  className?: string
  children: React.ReactNode
  width?: number
}

function TableHead({ className, children, width }: TableHeadProps) {
  return (
    <View className={cn('justify-center px-3 py-2', className)} style={width ? { width } : { flex: 1 }}>
      <Text className="text-xs font-medium text-muted-foreground">{children}</Text>
    </View>
  )
}

interface TableCellProps {
  className?: string
  children: React.ReactNode
  width?: number
}

function TableCell({ className, children, width }: TableCellProps) {
  return (
    <View className={cn('justify-center px-3 py-2', className)} style={width ? { width } : { flex: 1 }}>
      {typeof children === 'string' ? (
        <Text className="text-sm text-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  )
}

interface TableBodyProps {
  className?: string
  children: React.ReactNode
}

function TableBody({ className, children }: TableBodyProps) {
  return <View className={cn(className)}>{children}</View>
}

export { Table, TableHeader, TableRow, TableHead, TableCell, TableBody }
export type { TableProps, TableHeaderProps, TableRowProps, TableHeadProps, TableCellProps, TableBodyProps }
