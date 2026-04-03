import React, { forwardRef } from 'react'
import { TextInput, type TextInputProps } from 'react-native'
import { cn } from '@grit-ui/core'
import { cva, type VariantProps } from '@grit-ui/core'

const inputVariants = cva(
  'rounded-md border px-3 py-2 text-sm text-foreground',
  {
    variants: {
      variant: {
        default: 'border-border bg-background',
        error: 'border-destructive bg-background',
      },
      inputSize: {
        sm: 'h-8 text-xs',
        default: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
)

interface InputProps
  extends Omit<TextInputProps, 'style'>,
    VariantProps<typeof inputVariants> {
  className?: string
}

const Input = forwardRef<TextInput, InputProps>(
  ({ className, variant, inputSize, editable = true, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        editable={editable}
        placeholderTextColor="#9090a8"
        className={cn(
          inputVariants({ variant, inputSize }),
          !editable && 'opacity-50',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
export type { InputProps }
