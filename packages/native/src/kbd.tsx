import React from 'react'
import { Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface KbdProps {
  className?: string
  children?: React.ReactNode
}

function Kbd({ className, children }: KbdProps) {
  return (
    <View
      className={cn(
        'rounded border border-border bg-muted px-1.5 py-0.5',
        className
      )}
    >
      <Text className="text-xs font-mono text-muted-foreground">
        {children}
      </Text>
    </View>
  )
}

export { Kbd }
export type { KbdProps }
