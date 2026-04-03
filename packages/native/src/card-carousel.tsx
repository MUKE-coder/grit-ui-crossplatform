import React, { useRef } from 'react'
import { View, Text, FlatList, useWindowDimensions } from 'react-native'
import { cn } from '@grit-ui/core'

interface CardCarouselItem {
  key: string
  title?: string
  description?: string
  content?: React.ReactNode
}

interface CardCarouselProps {
  className?: string
  data: CardCarouselItem[]
  cardWidth?: number
  gap?: number
  renderCard?: (item: CardCarouselItem, index: number) => React.ReactNode
}

function CardCarousel({
  className,
  data,
  cardWidth,
  gap = 12,
  renderCard,
}: CardCarouselProps) {
  const { width: screenWidth } = useWindowDimensions()
  const finalWidth = cardWidth || screenWidth * 0.75

  return (
    <View className={cn(className)}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={finalWidth + gap}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: gap }}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => (
          <View style={{ width: finalWidth, marginRight: gap }}>
            {renderCard ? (
              renderCard(item, index)
            ) : (
              <View className="rounded-lg border border-border bg-background p-4">
                {item.content || (
                  <>
                    {item.title && (
                      <Text className="text-base font-semibold text-foreground">{item.title}</Text>
                    )}
                    {item.description && (
                      <Text className="mt-1 text-sm text-muted-foreground">{item.description}</Text>
                    )}
                  </>
                )}
              </View>
            )}
          </View>
        )}
      />
    </View>
  )
}

export { CardCarousel }
export type { CardCarouselProps, CardCarouselItem }
