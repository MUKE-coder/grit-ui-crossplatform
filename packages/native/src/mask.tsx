import React from 'react'
import { View } from 'react-native'
import { cn } from '@grit-ui/core'

interface MaskProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Mask — placeholder for React Native.
 *
 * CSS mask / clip-path effects are not supported in React Native.
 * On native this renders children inside a View with overflow hidden.
 * For web-only mask effects, use the web version of this component.
 */
function Mask({ className, children }: MaskProps) {
  return <View className={cn('overflow-hidden', className)}>{children}</View>
}

export { Mask }
export type { MaskProps }
