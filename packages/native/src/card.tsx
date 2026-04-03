import React from 'react'
import { Text, View } from 'react-native'
import { cn } from '@grit-ui/core'

interface CardProps {
  className?: string
  children?: React.ReactNode
}

function Card({ className, children }: CardProps) {
  return (
    <View
      className={cn(
        'rounded-lg border border-border bg-card',
        className
      )}
    >
      {children}
    </View>
  )
}

interface CardHeaderProps {
  className?: string
  children?: React.ReactNode
}

function CardHeader({ className, children }: CardHeaderProps) {
  return <View className={cn('p-4 pb-2', className)}>{children}</View>
}

interface CardTitleProps {
  className?: string
  children?: React.ReactNode
}

function CardTitle({ className, children }: CardTitleProps) {
  return (
    <Text className={cn('text-lg font-semibold text-foreground', className)}>
      {children}
    </Text>
  )
}

interface CardDescriptionProps {
  className?: string
  children?: React.ReactNode
}

function CardDescription({ className, children }: CardDescriptionProps) {
  return (
    <Text className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </Text>
  )
}

interface CardContentProps {
  className?: string
  children?: React.ReactNode
}

function CardContent({ className, children }: CardContentProps) {
  return <View className={cn('p-4 pt-2', className)}>{children}</View>
}

interface CardFooterProps {
  className?: string
  children?: React.ReactNode
}

function CardFooter({ className, children }: CardFooterProps) {
  return (
    <View className={cn('flex-row items-center p-4 pt-0', className)}>
      {children}
    </View>
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
}
