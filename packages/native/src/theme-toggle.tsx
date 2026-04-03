import React, { useCallback, useEffect, useState } from 'react'
import { Appearance, Pressable, Text, useColorScheme } from 'react-native'
import { cn } from '@grit-ui/core'

type Theme = 'light' | 'dark'

interface ThemeToggleProps {
  className?: string
  onChange?: (theme: Theme) => void
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
} as const

const iconSizes = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl',
} as const

function ThemeToggle({ className, onChange, size = 'md' }: ThemeToggleProps) {
  const systemScheme = useColorScheme()
  const [theme, setTheme] = useState<Theme>(systemScheme ?? 'light')

  useEffect(() => {
    if (systemScheme) {
      setTheme(systemScheme)
    }
  }, [systemScheme])

  const toggle = useCallback(() => {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(next)

    // Appearance.setColorScheme is available on RN 0.72+
    if (typeof Appearance.setColorScheme === 'function') {
      Appearance.setColorScheme(next)
    }

    onChange?.(next)
  }, [theme, onChange])

  const isDark = theme === 'dark'

  return (
    <Pressable
      onPress={toggle}
      className={cn(
        'items-center justify-center rounded-full bg-muted active:bg-muted/80',
        sizeClasses[size],
        className
      )}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Text className={cn(iconSizes[size])}>
        {isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'}
      </Text>
    </Pressable>
  )
}

export { ThemeToggle }
export type { ThemeToggleProps, Theme }
