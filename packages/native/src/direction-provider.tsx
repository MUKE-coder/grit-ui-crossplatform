import React, { createContext, useContext, useEffect } from 'react'
import { I18nManager, View } from 'react-native'
import { cn } from '@grit-ui/core'

type Direction = 'ltr' | 'rtl'

interface DirectionContextValue {
  direction: Direction
  isRTL: boolean
}

interface DirectionProviderProps {
  direction: Direction
  className?: string
  children?: React.ReactNode
}

const DirectionContext = createContext<DirectionContextValue>({
  direction: 'ltr',
  isRTL: false,
})

function useDirection(): DirectionContextValue {
  return useContext(DirectionContext)
}

function DirectionProvider({ direction, className, children }: DirectionProviderProps) {
  const isRTL = direction === 'rtl'

  useEffect(() => {
    const currentRTL = I18nManager.isRTL

    if (isRTL !== currentRTL) {
      I18nManager.forceRTL(isRTL)
      I18nManager.allowRTL(isRTL)
    }
  }, [isRTL])

  return (
    <DirectionContext.Provider value={{ direction, isRTL }}>
      <View className={cn('flex-1', className)} style={{ direction }}>
        {children}
      </View>
    </DirectionContext.Provider>
  )
}

export { DirectionProvider, useDirection }
export type { Direction, DirectionProviderProps, DirectionContextValue }
