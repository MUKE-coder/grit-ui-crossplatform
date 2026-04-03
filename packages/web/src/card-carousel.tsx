import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * CardCarousel variant definitions using CVA.
 */
const cardCarouselVariants = cva('relative overflow-hidden', {
  variants: {
    gap: {
      sm: 'px-2',
      default: 'px-4',
      lg: 'px-8',
    },
  },
  defaultVariants: {
    gap: 'default',
  },
})

/** Props for the CardCarousel component. */
export interface CardCarouselProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardCarouselVariants> {
  /** Number of fully visible cards. Default 3. */
  visibleCards?: number
  /** Peek amount in pixels for partial next/previous cards. Default 40. */
  peekAmount?: number
  /** Auto-play interval in ms. 0 to disable. */
  autoPlay?: number
  /** Enable infinite loop. */
  loop?: boolean
  /** Gap between cards in pixels. Default 16. */
  cardGap?: number
  /** Show navigation arrows. */
  showArrows?: boolean
  /** Show dot indicators. */
  showDots?: boolean
}

/**
 * Card-based carousel with peek effect showing partial next/previous cards.
 *
 * @example
 * ```tsx
 * <CardCarousel visibleCards={3} peekAmount={40} showArrows showDots>
 *   <div className="bg-card p-6 rounded-lg">Card 1</div>
 *   <div className="bg-card p-6 rounded-lg">Card 2</div>
 *   <div className="bg-card p-6 rounded-lg">Card 3</div>
 *   <div className="bg-card p-6 rounded-lg">Card 4</div>
 *   <div className="bg-card p-6 rounded-lg">Card 5</div>
 * </CardCarousel>
 * ```
 */
const CardCarousel = React.forwardRef<HTMLDivElement, CardCarouselProps>(
  (
    {
      className,
      gap,
      visibleCards = 3,
      peekAmount = 40,
      autoPlay = 0,
      loop = false,
      cardGap = 16,
      showArrows = true,
      showDots = false,
      children,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [dragOffset, setDragOffset] = React.useState(0)
    const isDragging = React.useRef(false)
    const dragStartX = React.useRef(0)
    const trackRef = React.useRef<HTMLDivElement>(null)

    const items = React.Children.toArray(children)
    const totalItems = items.length
    const maxIndex = Math.max(0, totalItems - visibleCards)

    const goTo = React.useCallback(
      (i: number) => {
        if (loop) {
          setCurrentIndex(((i % totalItems) + totalItems) % totalItems)
        } else {
          setCurrentIndex(Math.max(0, Math.min(maxIndex, i)))
        }
      },
      [loop, totalItems, maxIndex]
    )

    const goNext = React.useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])
    const goPrev = React.useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])

    // Auto-play
    React.useEffect(() => {
      if (autoPlay <= 0 || totalItems <= visibleCards) return
      const timer = setInterval(goNext, autoPlay)
      return () => clearInterval(timer)
    }, [autoPlay, goNext, totalItems, visibleCards])

    // Keyboard
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }

    // Drag
    const handlePointerDown = (e: React.PointerEvent) => {
      isDragging.current = true
      dragStartX.current = e.clientX
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    }

    const handlePointerMove = (e: React.PointerEvent) => {
      if (!isDragging.current) return
      setDragOffset(e.clientX - dragStartX.current)
    }

    const handlePointerUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      if (dragOffset < -50) goNext()
      else if (dragOffset > 50) goPrev()
      setDragOffset(0)
    }

    // Calculate card width percentage
    const cardWidthCalc = '(100% - ' + peekAmount * 2 + 'px - ' + (visibleCards - 1) * cardGap + 'px) / ' + visibleCards
    const translateX = 'calc(-' + currentIndex + ' * ((' + cardWidthCalc + ') + ' + cardGap + 'px) + ' + peekAmount + 'px + ' + dragOffset + 'px)'

    return (
      <div
        ref={ref}
        className={cn(cardCarouselVariants({ gap }), className)}
        role="region"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{
            transform: 'translateX(' + translateX + ')',
            transition: isDragging.current ? 'none' : 'transform 300ms ease-in-out',
            gap: cardGap + 'px',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {items.map((child, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{ width: 'calc(' + cardWidthCalc + ')' }}
              role="group"
              aria-roledescription="slide"
            >
              {child}
            </div>
          ))}
        </div>

        {showArrows && totalItems > visibleCards && (
          <>
            <button
              type="button"
              onClick={goPrev}
              disabled={!loop && currentIndex === 0}
              className={cn(
                'absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 border border-border',
                'flex items-center justify-center shadow-sm hover:bg-accent transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!loop && currentIndex >= maxIndex}
              className={cn(
                'absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 border border-border',
                'flex items-center justify-center shadow-sm hover:bg-accent transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </>
        )}

        {showDots && totalItems > visibleCards && (
          <div className="flex justify-center gap-1.5 py-2 mt-2">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={cn(
                  'h-2 w-2 rounded-full transition-all',
                  i === currentIndex ? 'bg-primary w-4' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
                aria-label={'Go to position ' + (i + 1)}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)
CardCarousel.displayName = 'CardCarousel'

export { CardCarousel, cardCarouselVariants }
