import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Radial chart variant definitions using CVA.
 */
const chartRadialVariants = cva('relative inline-flex items-center justify-center', {
  variants: {
    size: {
      sm: 'w-32 h-32',
      default: 'w-48 h-48',
      lg: 'w-64 h-64',
      xl: 'w-80 h-80',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

/** A color segment for the gauge. */
export interface RadialSegment {
  /** Upper bound of this segment (exclusive). */
  upTo: number
  /** Color for this range. */
  color: string
}

/** Props for the ChartRadial component. */
export interface ChartRadialProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartRadialVariants> {
  /** Current value. */
  value: number
  /** Minimum value. Default 0. */
  min?: number
  /** Maximum value. Default 100. */
  max?: number
  /** Stroke width of the gauge arc. Default 10. */
  strokeWidth?: number
  /** Color segments. If not provided, uses a single color. */
  segments?: RadialSegment[]
  /** Single color when segments are not provided. Default '#6c5ce7'. */
  color?: string
  /** Background track color. */
  trackColor?: string
  /** Show the value as centered text. */
  showValue?: boolean
  /** Label text below the value. */
  label?: string
  /** Format function for the displayed value. */
  formatValue?: (value: number) => string
  /** Sweep angle in degrees. Default 270 (three-quarter circle). */
  sweepAngle?: number
}

/**
 * Radial/gauge chart rendered with SVG.
 * Supports min/max/value and color segments.
 *
 * @example
 * ```tsx
 * <ChartRadial value={72} showValue label="CPU Usage" />
 * <ChartRadial
 *   value={45}
 *   segments={[
 *     { upTo: 33, color: '#00b894' },
 *     { upTo: 66, color: '#fdcb6e' },
 *     { upTo: 100, color: '#ff6b6b' },
 *   ]}
 *   showValue
 * />
 * ```
 */
const ChartRadial = React.forwardRef<HTMLDivElement, ChartRadialProps>(
  (
    {
      className,
      size,
      value,
      min = 0,
      max = 100,
      strokeWidth = 10,
      segments,
      color = '#6c5ce7',
      trackColor,
      showValue = false,
      label,
      formatValue,
      sweepAngle = 270,
      ...props
    },
    ref
  ) => {
    const cx = 50
    const cy = 50
    const r = 50 - strokeWidth / 2
    const clampedValue = Math.max(min, Math.min(max, value))
    const fraction = (clampedValue - min) / (max - min)

    // Calculate the arc
    const startAngle = -sweepAngle / 2
    const circumference = 2 * Math.PI * r
    const arcLength = (sweepAngle / 360) * circumference
    const filledLength = fraction * arcLength
    const emptyLength = arcLength - filledLength

    // Determine fill color from segments
    let fillColor = color
    if (segments) {
      for (const seg of segments) {
        if (clampedValue <= seg.upTo) {
          fillColor = seg.color
          break
        }
        fillColor = seg.color
      }
    }

    const rotationOffset = 90 + (360 - sweepAngle) / 2

    const displayValue = formatValue ? formatValue(clampedValue) : String(Math.round(clampedValue))

    return (
      <div ref={ref} className={cn(chartRadialVariants({ size }), className)} {...props}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90" style={{ transform: 'rotate(' + (rotationOffset * -1) + 'deg)' }}>
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={trackColor || 'currentColor'}
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength + ' ' + (circumference - arcLength)}
            strokeLinecap="round"
            className={trackColor ? '' : 'text-muted-foreground/20'}
          />
          {/* Filled arc */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={fillColor}
            strokeWidth={strokeWidth}
            strokeDasharray={filledLength + ' ' + (circumference - filledLength)}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        {(showValue || label) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {showValue && (
              <span className="text-2xl font-bold text-foreground">{displayValue}</span>
            )}
            {label && (
              <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
            )}
          </div>
        )}
      </div>
    )
  }
)
ChartRadial.displayName = 'ChartRadial'

export { ChartRadial, chartRadialVariants }
