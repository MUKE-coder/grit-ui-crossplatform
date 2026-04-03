import React from 'react'
import { View } from 'react-native'
import { cn } from '@grit-ui/core'

interface BentoGridProps {
  className?: string
  children: React.ReactNode
  columns?: number
  gap?: number
}

function BentoGrid({ className, children, columns = 2, gap = 8 }: BentoGridProps) {
  return (
    <View
      className={cn('flex-row flex-wrap', className)}
      style={{ gap }}
    >
      {React.Children.map(children, (child) => (
        <View style={{ width: (100 / columns).toFixed(2) + '%', flexBasis: 'auto' }}>
          {child}
        </View>
      ))}
    </View>
  )
}

interface BentoCardProps {
  className?: string
  children: React.ReactNode
  span?: number
}

function BentoCard({ className, children, span = 1 }: BentoCardProps) {
  return (
    <View
      className={cn('rounded-lg border border-border bg-background p-4', className)}
      style={span > 1 ? { flex: span } : undefined}
    >
      {children}
    </View>
  )
}

export { BentoGrid, BentoCard }
export type { BentoGridProps, BentoCardProps }
