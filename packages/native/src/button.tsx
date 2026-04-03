import React from 'react'
import { ActivityIndicator, Pressable, Text } from 'react-native'
import { cn } from '@grit-ui/core'
import { cva, type VariantProps } from '@grit-ui/core'

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        secondary: 'bg-secondary',
        destructive: 'bg-destructive',
        outline: 'border border-border bg-transparent',
        ghost: 'bg-transparent',
        link: 'bg-transparent',
        premium: 'bg-amber-500',
      },
      size: {
        xs: 'h-7 px-2',
        sm: 'h-8 px-3',
        default: 'h-10 px-4',
        lg: 'h-12 px-6',
        xl: 'h-14 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const buttonTextVariants = cva('text-center font-medium', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
      ghost: 'text-foreground',
      link: 'text-primary underline',
      premium: 'text-white',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      default: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
      icon: 'text-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string
  textClassName?: string
  onPress?: () => void
  children?: React.ReactNode
  disabled?: boolean
  loading?: boolean
}

function Button({
  className,
  textClassName,
  variant,
  size,
  onPress,
  disabled,
  loading,
  children,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        buttonVariants({ variant, size }),
        disabled && 'opacity-50',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? '#666' : '#fff'}
        />
      ) : typeof children === 'string' ? (
        <Text className={cn(buttonTextVariants({ variant, size }), textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  )
}

export { Button, buttonVariants, buttonTextVariants }
export type { ButtonProps }
