import React from 'react'
import { ScrollView, type ScrollViewProps } from 'react-native'
import { cn } from '@grit-ui/core'

interface ScrollAreaProps extends Omit<ScrollViewProps, 'style'> {
  className?: string
  horizontal?: boolean
  children?: React.ReactNode
}

function ScrollArea({
  className,
  horizontal = false,
  children,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollView
      horizontal={horizontal}
      showsVerticalScrollIndicator={!horizontal}
      showsHorizontalScrollIndicator={horizontal}
      className={cn('flex-1', className)}
      {...props}
    >
      {children}
    </ScrollView>
  )
}

export { ScrollArea }
export type { ScrollAreaProps }
