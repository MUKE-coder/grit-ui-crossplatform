import React from 'react'
import { Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface FooterProps {
  className?: string
  children?: React.ReactNode
}

function Footer({ className, children }: FooterProps) {
  return (
    <View
      className={cn(
        'border-t border-border bg-background px-4 py-6',
        className
      )}
    >
      {children}
    </View>
  )
}

interface FooterSectionProps {
  className?: string
  title?: string
  children?: React.ReactNode
}

function FooterSection({ className, title, children }: FooterSectionProps) {
  return (
    <View className={cn('mb-4', className)}>
      {title && (
        <Text className="mb-2 text-sm font-semibold text-foreground">{title}</Text>
      )}
      {children}
    </View>
  )
}

interface FooterLinkProps {
  className?: string
  children?: React.ReactNode
  onPress?: () => void
}

function FooterLink({ className, children, onPress }: FooterLinkProps) {
  return (
    <Text
      onPress={onPress}
      className={cn('text-sm text-muted-foreground py-1', className)}
    >
      {children}
    </Text>
  )
}

export { Footer, FooterSection, FooterLink }
export type { FooterProps, FooterSectionProps, FooterLinkProps }
