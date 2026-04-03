import React, { forwardRef, useState } from 'react'
import { TextInput, type TextInputProps } from 'react-native'
import { cn } from '@grit-ui/core'
import { cva, type VariantProps } from '@grit-ui/core'

const textareaVariants = cva(
  'rounded-md border px-3 py-2 text-sm text-foreground align-top',
  {
    variants: {
      variant: {
        default: 'border-border bg-background',
        error: 'border-destructive bg-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface TextareaProps
  extends Omit<TextInputProps, 'style'>,
    VariantProps<typeof textareaVariants> {
  className?: string
  autoGrow?: boolean
  minHeight?: number
  maxHeight?: number
}

const Textarea = forwardRef<TextInput, TextareaProps>(
  (
    {
      className,
      variant,
      autoGrow = false,
      minHeight = 80,
      maxHeight = 200,
      ...props
    },
    ref
  ) => {
    const [height, setHeight] = useState(minHeight)

    return (
      <TextInput
        ref={ref}
        multiline
        placeholderTextColor="#9090a8"
        textAlignVertical="top"
        onContentSizeChange={
          autoGrow
            ? (e) => {
                const newHeight = e.nativeEvent.contentSize.height
                setHeight(Math.min(Math.max(newHeight, minHeight), maxHeight))
              }
            : undefined
        }
        className={cn(textareaVariants({ variant }), className)}
        // @ts-expect-error — NativeWind supports style alongside className
        style={autoGrow ? { height } : { minHeight }}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
export type { TextareaProps }
