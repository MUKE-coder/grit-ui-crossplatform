import React, { useRef, useState, useCallback } from 'react'
import { View, FlatList, useWindowDimensions, type ViewToken } from 'react-native'
import { cn } from '@grit-ui/core'

interface CarouselProps {
  className?: string
  data: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  itemWidth?: number
  showDots?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
}

function Carousel({
  className,
  data,
  renderItem,
  itemWidth,
  showDots = true,
}: CarouselProps) {
  const { width: screenWidth } = useWindowDimensions()
  const finalWidth = itemWidth || screenWidth
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index)
      }
    },
    []
  )

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

  return (
    <View className={cn(className)}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={finalWidth}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item, index }) => (
          <View style={{ width: finalWidth }}>{renderItem(item, index)}</View>
        )}
      />
      {showDots && data.length > 1 && (
        <View className="mt-3 flex-row items-center justify-center gap-1.5">
          {data.map((_, i) => (
            <View
              key={i}
              className={cn(
                'h-2 rounded-full',
                i === activeIndex ? 'w-4 bg-primary' : 'w-2 bg-muted-foreground/30'
              )}
            />
          ))}
        </View>
      )}
    </View>
  )
}

export { Carousel }
export type { CarouselProps }
