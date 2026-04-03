import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface TooltipProps {
  className?: string
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom'
  delayMs?: number
}

function Tooltip({
  className,
  content,
  children,
  position = 'top',
}: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <View className={cn('relative', className)}>
      <Pressable
        onLongPress={() => setVisible(true)}
        onPressOut={() => setVisible(false)}
        delayLongPress={300}
      >
        {children}
      </Pressable>

      {visible && (
        <View
          className={cn(
            'absolute z-50 rounded-md bg-popover border border-border px-3 py-1.5 shadow-md',
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
            'left-0'
          )}
        >
          <Text className="text-xs text-popover-foreground">{content}</Text>
        </View>
      )}
    </View>
  )
}

export { Tooltip }
export type { TooltipProps }
