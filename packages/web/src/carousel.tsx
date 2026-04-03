import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Carousel variant definitions using CVA.
 */
const carouselVariants = cva('relative overflow-hidden', {
  variants: {
    variant: {
      default: '',
      bordered: 'border border-border rounded-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

/** Context for carousel state. */
interface CarouselContextValue {
  currentIndex: number
  totalSlides: number
  goTo: (index: number) => void
  goNext: () => void
  goPrev: () => void
  loop: boolean
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const ctx = React.useContext(CarouselContext)
  if (!ctx) throw new Error('Carousel compound components must be used within <Carousel>')
  return ctx
}

/** Props for the Carousel component. */
export interface CarouselProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof carouselVariants> {
  /** Auto-play interval in milliseconds. 0 to disable. */
  autoPlay?: number
  /** Enable infinite loop. */
  loop?: boolean
  /** Starting slide index. */
  defaultIndex?: number
  /** Controlled current index. */
  index?: number
  /** Called when slide changes. */
  onIndexChange?: (index: number) => void
}

/**
 * Slide carousel with auto-play, drag, and loop support.
 *
 * @example
 * ```tsx
 * <Carousel autoPlay={3000} loop>
 *   <CarouselContent>
 *     <CarouselItem>Slide 1</CarouselItem>
 *     <CarouselItem>Slide 2</CarouselItem>
 *   </CarouselContent>
 *   <CarouselPrevious />
 *   <CarouselNext />
 *   <CarouselDots />
 * </Carousel>
 * ```
 */
const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      className,
      variant,
      autoPlay = 0,
      loop = false,
      defaultIndex = 0,
      index: controlledIndex,
      onIndexChange,
      children,
      ...props
    },
    ref
  ) => {
    const [internalIndex, setInternalIndex] = React.useState(defaultIndex)
    const [totalSlides, setTotalSlides] = React.useState(0)

    const currentIndex = controlledIndex ?? internalIndex
    const setIndex = React.useCallback(
      (i: number) => {
        if (controlledIndex === undefined) setInternalIndex(i)
        onIndexChange?.(i)
      },
      [controlledIndex, onIndexChange]
    )

    // Count slides from children
    React.useEffect(() => {
      let count = 0
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && (child.type as any)?.displayName === 'CarouselContent') {
          React.Children.forEach((child.props as any).children, () => { count++ })
        }
      })
      if (count > 0) setTotalSlides(count)
    }, [children])

    const goTo = React.useCallback(
      (i: number) => {
        if (totalSlides === 0) return
        let next = i
        if (loop) {
          next = ((i % totalSlides) + totalSlides) % totalSlides
        } else {
          next = Math.max(0, Math.min(totalSlides - 1, i))
        }
        setIndex(next)
      },
      [totalSlides, loop, setIndex]
    )

    const goNext = React.useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])
    const goPrev = React.useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])

    // Auto-play
    React.useEffect(() => {
      if (autoPlay <= 0 || totalSlides <= 1) return
      const timer = setInterval(goNext, autoPlay)
      return () => clearInterval(timer)
    }, [autoPlay, goNext, totalSlides])

    // Keyboard
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }

    const ctx: CarouselContextValue = { currentIndex, totalSlides, goTo, goNext, goPrev, loop }

    return (
      <CarouselContext.Provider value={ctx}>
        <div
          ref={ref}
          className={cn(carouselVariants({ variant }), className)}
          role="region"
          aria-roledescription="carousel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {/* Inject totalSlides setter */}
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && (child.type as any)?.displayName === 'CarouselContent') {
              return React.cloneElement(child as React.ReactElement<any>, { __setTotalSlides: setTotalSlides })
            }
            return child
          })}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = 'Carousel'

/** Props for CarouselContent. */
export interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @internal */
  __setTotalSlides?: (n: number) => void
}

/**
 * Container for carousel items. Handles slide transition.
 */
const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, children, __setTotalSlides, ...props }, ref) => {
    const { currentIndex } = useCarousel()
    const [dragOffset, setDragOffset] = React.useState(0)
    const dragStartX = React.useRef(0)
    const isDragging = React.useRef(false)
    const { goNext, goPrev } = useCarousel()

    const childArray = React.Children.toArray(children)

    React.useEffect(() => {
      __setTotalSlides?.(childArray.length)
    }, [childArray.length, __setTotalSlides])

    const handlePointerDown = (e: React.PointerEvent) => {
      isDragging.current = true
      dragStartX.current = e.clientX
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
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

    return (
      <div ref={ref} className={cn('overflow-hidden', className)} {...props}>
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: 'translateX(calc(-' + (currentIndex * 100) + '% + ' + dragOffset + 'px))',
            transition: isDragging.current ? 'none' : undefined,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {childArray.map((child, i) => (
            <div key={i} className="w-full flex-shrink-0" role="group" aria-roledescription="slide" aria-label={'Slide ' + (i + 1) + ' of ' + childArray.length}>
              {child}
            </div>
          ))}
        </div>
      </div>
    )
  }
)
CarouselContent.displayName = 'CarouselContent'

/**
 * Individual carousel slide.
 */
const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('w-full', className)} {...props} />
  )
)
CarouselItem.displayName = 'CarouselItem'

/**
 * Previous slide navigation button.
 */
const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { goPrev, currentIndex, loop } = useCarousel()
    return (
      <button
        ref={ref}
        type="button"
        onClick={goPrev}
        disabled={!loop && currentIndex === 0}
        className={cn(
          'absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 border border-border',
          'flex items-center justify-center shadow-sm hover:bg-accent transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        aria-label="Previous slide"
        {...props}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
    )
  }
)
CarouselPrevious.displayName = 'CarouselPrevious'

/**
 * Next slide navigation button.
 */
const CarouselNext = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { goNext, currentIndex, totalSlides, loop } = useCarousel()
    return (
      <button
        ref={ref}
        type="button"
        onClick={goNext}
        disabled={!loop && currentIndex >= totalSlides - 1}
        className={cn(
          'absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 border border-border',
          'flex items-center justify-center shadow-sm hover:bg-accent transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        aria-label="Next slide"
        {...props}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
      </button>
    )
  }
)
CarouselNext.displayName = 'CarouselNext'

/**
 * Dot indicators for carousel slides.
 */
const CarouselDots = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { currentIndex, totalSlides, goTo } = useCarousel()
    return (
      <div ref={ref} className={cn('flex justify-center gap-1.5 py-2', className)} {...props}>
        {Array.from({ length: totalSlides }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={cn(
              'h-2 w-2 rounded-full transition-all',
              i === currentIndex ? 'bg-primary w-4' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            )}
            aria-label={'Go to slide ' + (i + 1)}
          />
        ))}
      </div>
    )
  }
)
CarouselDots.displayName = 'CarouselDots'

export { Carousel, carouselVariants, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots }
