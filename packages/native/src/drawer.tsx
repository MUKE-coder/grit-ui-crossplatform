import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions, Modal, Pressable, View } from 'react-native'
import { cn } from '@grit-ui/core'

type DrawerSide = 'left' | 'right' | 'bottom' | 'top'

interface DrawerProps {
  className?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: DrawerSide
  children?: React.ReactNode
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window')

function getTranslation(side: DrawerSide, open: boolean) {
  switch (side) {
    case 'left':
      return { translateX: open ? 0 : -SCREEN_W }
    case 'right':
      return { translateX: open ? 0 : SCREEN_W }
    case 'bottom':
      return { translateY: open ? 0 : SCREEN_H }
    case 'top':
      return { translateY: open ? 0 : -SCREEN_H }
  }
}

function getPositionClasses(side: DrawerSide) {
  switch (side) {
    case 'left':
      return 'absolute left-0 top-0 bottom-0 w-4/5 max-w-sm'
    case 'right':
      return 'absolute right-0 top-0 bottom-0 w-4/5 max-w-sm'
    case 'bottom':
      return 'absolute bottom-0 left-0 right-0 max-h-[80%]'
    case 'top':
      return 'absolute top-0 left-0 right-0 max-h-[80%]'
  }
}

function Drawer({
  className,
  open,
  onOpenChange,
  side = 'left',
  children,
}: DrawerProps) {
  const translateAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(translateAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [open, translateAnim, opacityAnim])

  const closedTranslation = getTranslation(side, false)
  const openTranslation = getTranslation(side, true)

  const translateKey = 'translateX' in closedTranslation ? 'translateX' : 'translateY'
  const closedVal = closedTranslation[translateKey as keyof typeof closedTranslation] as number
  const openVal = openTranslation[translateKey as keyof typeof openTranslation] as number

  const animatedTransform = {
    transform: [
      {
        [translateKey]: translateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [closedVal, openVal],
        }),
      },
    ],
  }

  return (
    <Modal visible={open} transparent animationType="none">
      <View className="flex-1">
        <Animated.View
          className="absolute inset-0 bg-black/50"
          // @ts-expect-error — NativeWind supports style alongside className
          style={{ opacity: opacityAnim }}
        >
          <Pressable className="flex-1" onPress={() => onOpenChange(false)} />
        </Animated.View>

        <Animated.View
          className={cn(
            getPositionClasses(side),
            'border-border bg-background',
            side === 'left' && 'border-r',
            side === 'right' && 'border-l',
            side === 'bottom' && 'border-t rounded-t-xl',
            side === 'top' && 'border-b rounded-b-xl',
            className
          )}
          // @ts-expect-error — NativeWind supports style alongside className
          style={animatedTransform}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  )
}

export { Drawer }
export type { DrawerProps, DrawerSide }
