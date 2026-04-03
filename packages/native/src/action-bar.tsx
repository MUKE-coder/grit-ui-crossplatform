import React from 'react'
import { View } from 'react-native'
import { cn } from '@grit-ui/core'

interface ActionBarProps {
  className?: string
  children?: React.ReactNode
  position?: 'top' | 'bottom'
}

function ActionBar({ className, children, position = 'bottom' }: ActionBarProps) {
  return (
    <View
      className={cn(
        'absolute left-0 right-0 flex-row items-center justify-between px-4 py-3 bg-background border-border',
        position === 'bottom' ? 'bottom-0 border-t' : 'top-0 border-b',
        className
      )}
    >
      {children}
    </View>
  )
}

export { ActionBar }
export type { ActionBarProps }
