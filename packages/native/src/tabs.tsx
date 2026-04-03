import React, { createContext, useContext, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue>({
  value: '',
  onValueChange: () => {},
})

interface TabsProps {
  className?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
}

function Tabs({
  className,
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  children,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const current = controlledValue !== undefined ? controlledValue : internalValue

  function handleChange(val: string) {
    setInternalValue(val)
    onValueChange?.(val)
  }

  return (
    <TabsContext.Provider value={{ value: current, onValueChange: handleChange }}>
      <View className={cn('w-full', className)}>{children}</View>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  className?: string
  children?: React.ReactNode
}

function TabsList({ className, children }: TabsListProps) {
  return (
    <View
      className={cn(
        'flex-row rounded-lg bg-muted p-1',
        className
      )}
    >
      {children}
    </View>
  )
}

interface TabsTriggerProps {
  className?: string
  value: string
  children?: React.ReactNode
  disabled?: boolean
}

function TabsTrigger({ className, value, children, disabled }: TabsTriggerProps) {
  const ctx = useContext(TabsContext)
  const isActive = ctx.value === value

  return (
    <Pressable
      onPress={() => !disabled && ctx.onValueChange(value)}
      disabled={disabled}
      className={cn(
        'flex-1 items-center justify-center rounded-md px-3 py-1.5',
        isActive && 'bg-background shadow-sm',
        disabled && 'opacity-50',
        className
      )}
    >
      <Text
        className={cn(
          'text-sm font-medium',
          isActive ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        {children}
      </Text>
    </Pressable>
  )
}

interface TabsContentProps {
  className?: string
  value: string
  children?: React.ReactNode
}

function TabsContent({ className, value, children }: TabsContentProps) {
  const ctx = useContext(TabsContext)
  if (ctx.value !== value) return null

  return <View className={cn('mt-2', className)}>{children}</View>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps }
