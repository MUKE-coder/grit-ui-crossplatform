import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Animated, Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'
import { cva, type VariantProps } from '@grit-ui/core'

const toastVariants = cva(
  'mx-4 rounded-lg border p-4 shadow-lg',
  {
    variants: {
      variant: {
        default: 'border-border bg-background',
        success: 'border-green-600/50 bg-green-600/10',
        destructive: 'border-destructive/50 bg-destructive/10',
        warning: 'border-amber-500/50 bg-amber-500/10',
        info: 'border-blue-500/50 bg-blue-500/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const toastTextVariants = cva('text-sm font-medium', {
  variants: {
    variant: {
      default: 'text-foreground',
      success: 'text-green-600',
      destructive: 'text-destructive',
      warning: 'text-amber-500',
      info: 'text-blue-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type ToastVariant = 'default' | 'success' | 'destructive' | 'warning' | 'info'
type ToastPosition = 'top' | 'bottom'

interface ToastData {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextValue {
  toast: (data: Omit<ToastData, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
})

function useToast() {
  return useContext(ToastContext)
}

interface ToastProviderProps {
  children?: React.ReactNode
  position?: ToastPosition
}

function ToastProvider({ children, position = 'top' }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const toast = useCallback((data: Omit<ToastData, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, ...data }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <View
        className={cn(
          'absolute left-0 right-0 z-50',
          position === 'top' ? 'top-12' : 'bottom-12'
        )}
        pointerEvents="box-none"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} data={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </View>
    </ToastContext.Provider>
  )
}

interface ToastItemProps {
  data: ToastData
  onDismiss: () => void
}

function ToastItem({ data, onDismiss }: ToastItemProps) {
  const translateY = useRef(new Animated.Value(-40)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start()

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -40, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => onDismiss())
    }, data.duration || 3000)

    return () => clearTimeout(timer)
  }, [data.duration, onDismiss, translateY, opacity])

  return (
    <Animated.View
      // @ts-expect-error — NativeWind supports style alongside className
      style={{ transform: [{ translateY }], opacity }}
      className="mb-2"
    >
      <Pressable onPress={onDismiss}>
        <View className={cn(toastVariants({ variant: data.variant }))}>
          <Text className={cn(toastTextVariants({ variant: data.variant }))}>
            {data.title}
          </Text>
          {data.description && (
            <Text className="mt-1 text-xs text-muted-foreground">{data.description}</Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  )
}

export { ToastProvider, useToast, toastVariants }
export type { ToastData, ToastProviderProps, ToastPosition }
