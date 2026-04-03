import React, { useState } from 'react'
import {
  ActivityIndicator,
  Image as RNImage,
  Text,
  View,
  type ImageProps as RNImageProps,
} from 'react-native'
import { cn } from '@grit-ui/core'

interface ImageProps extends Omit<RNImageProps, 'style'> {
  className?: string
  fallbackText?: string
  showLoader?: boolean
}

function Image({
  className,
  fallbackText = '?',
  showLoader = true,
  source,
  ...props
}: ImageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  if (error) {
    return (
      <View
        className={cn(
          'items-center justify-center bg-muted rounded-md',
          className
        )}
      >
        <Text className="text-sm text-muted-foreground">{fallbackText}</Text>
      </View>
    )
  }

  return (
    <View className={cn('overflow-hidden', className)}>
      <RNImage
        source={source}
        className="h-full w-full"
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false)
          setError(true)
        }}
        {...props}
      />
      {loading && showLoader && (
        <View className="absolute inset-0 items-center justify-center bg-muted">
          <ActivityIndicator size="small" color="#6c5ce7" />
        </View>
      )}
    </View>
  )
}

export { Image }
export type { ImageProps }
