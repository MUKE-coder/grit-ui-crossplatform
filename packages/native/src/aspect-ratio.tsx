import React from 'react'
import { View } from 'react-native'
import { cn } from '@grit-ui/core'

interface AspectRatioProps {
  className?: string
  ratio?: number
  children?: React.ReactNode
}

function AspectRatio({ className, ratio = 16 / 9, children }: AspectRatioProps) {
  return (
    <View
      className={cn('w-full overflow-hidden', className)}
      // @ts-expect-error — NativeWind supports style alongside className
      style={{ aspectRatio: ratio }}
    >
      {children}
    </View>
  )
}

export { AspectRatio }
export type { AspectRatioProps }
