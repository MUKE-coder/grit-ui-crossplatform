import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Pie chart variant definitions using CVA.
 */
const chartPieVariants = cva('relative', {
  variants: {
    size: {
      sm: 'w-48 h-48',
      default: 'w-64 h-64',
      lg: 'w-80 h-80',
      xl: 'w-96 h-96',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

/** A single data segment for the pie chart. */
export interface PieSegment {
  /** Segment label. */
  label: string
  /** Numeric value. */
  value: number
  /** Fill color (CSS color string). */
  color: string
}

/** Props for the ChartPie component. */
export interface ChartPieProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartPieVariants> {
  /** Data segments to render. */
  data: PieSegment[]
  /** Render as donut chart with a hole in the center. */
  donut?: boolean
  /** Donut inner radius as a fraction of the outer radius (0-1). Default 0.6. */
  innerRadiusFraction?: number
  /** Show labels on each segment. */
  showLabels?: boolean
  /** Show a legend below the chart. */
  showLegend?: boolean
  /** Callback when a segment is clicked. */
  onSegmentClick?: (segment: PieSegment, index: number) => void
  /** Starting angle in degrees. Default -90 (top). */
  startAngle?: number
}

/** Converts polar coordinates to cartesian for SVG arc paths. */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

/** Creates an SVG arc path descriptor. */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return ['M', start.x, start.y, 'A', r, r, 0, largeArc, 0, end.x, end.y].join(' ')
}

/**
 * Pie/donut chart rendered with SVG.
 * Supports labels, legend, and interactive segments.
 *
 * @example
 * ```tsx
 * <ChartPie
 *   data={[
 *     { label: 'A', value: 30, color: '#6c5ce7' },
 *     { label: 'B', value: 70, color: '#00b894' },
 *   ]}
 *   donut
 *   showLegend
 * />
 * ```
 */
const ChartPie = React.forwardRef<HTMLDivElement, ChartPieProps>(
  (
    {
      className,
      size,
      data,
      donut = false,
      innerRadiusFraction = 0.6,
      showLabels = false,
      showLegend = false,
      onSegmentClick,
      startAngle = 0,
      ...props
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
    const total = data.reduce((sum, d) => sum + d.value, 0)
    if (total === 0) return null

    const cx = 50
    const cy = 50
    const outerR = 45
    const innerR = donut ? outerR * innerRadiusFraction : 0

    let currentAngle = startAngle
    const segments = data.map((seg, i) => {
      const angle = (seg.value / total) * 360
      const segStartAngle = currentAngle
      const segEndAngle = currentAngle + angle
      currentAngle = segEndAngle

      const midAngle = segStartAngle + angle / 2
      const labelR = outerR * 0.7
      const labelPos = polarToCartesian(cx, cy, labelR, midAngle)

      return { ...seg, segStartAngle, segEndAngle, midAngle, labelPos, index: i }
    })

    function buildPath(seg: (typeof segments)[0]) {
      const { segStartAngle, segEndAngle } = seg
      if (segEndAngle - segStartAngle >= 359.99) {
        // Full circle
        if (donut) {
          return [
            'M', cx, cy - outerR,
            'A', outerR, outerR, 0, 1, 1, cx, cy + outerR,
            'A', outerR, outerR, 0, 1, 1, cx, cy - outerR,
            'Z',
            'M', cx, cy - innerR,
            'A', innerR, innerR, 0, 1, 0, cx, cy + innerR,
            'A', innerR, innerR, 0, 1, 0, cx, cy - innerR,
            'Z',
          ].join(' ')
        }
        return [
          'M', cx, cy - outerR,
          'A', outerR, outerR, 0, 1, 1, cx, cy + outerR,
          'A', outerR, outerR, 0, 1, 1, cx, cy - outerR,
          'Z',
        ].join(' ')
      }

      const outerStart = polarToCartesian(cx, cy, outerR, segStartAngle)
      const outerEnd = polarToCartesian(cx, cy, outerR, segEndAngle)
      const largeArc = segEndAngle - segStartAngle > 180 ? 1 : 0

      if (donut) {
        const innerStart = polarToCartesian(cx, cy, innerR, segStartAngle)
        const innerEnd = polarToCartesian(cx, cy, innerR, segEndAngle)
        return [
          'M', outerStart.x, outerStart.y,
          'A', outerR, outerR, 0, largeArc, 1, outerEnd.x, outerEnd.y,
          'L', innerEnd.x, innerEnd.y,
          'A', innerR, innerR, 0, largeArc, 0, innerStart.x, innerStart.y,
          'Z',
        ].join(' ')
      }

      return [
        'M', cx, cy,
        'L', outerStart.x, outerStart.y,
        'A', outerR, outerR, 0, largeArc, 1, outerEnd.x, outerEnd.y,
        'Z',
      ].join(' ')
    }

    return (
      <div ref={ref} className={cn(chartPieVariants({ size }), 'flex flex-col items-center', className)} {...props}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segments.map((seg) => (
            <path
              key={seg.index}
              d={buildPath(seg)}
              fill={seg.color}
              fillRule="evenodd"
              stroke="white"
              strokeWidth="0.5"
              opacity={hoveredIndex === null || hoveredIndex === seg.index ? 1 : 0.5}
              className="transition-opacity cursor-pointer"
              onMouseEnter={() => setHoveredIndex(seg.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onSegmentClick?.(seg, seg.index)}
            >
              <title>{seg.label}: {seg.value} ({((seg.value / total) * 100).toFixed(1)}%)</title>
            </path>
          ))}
          {showLabels &&
            segments.map((seg) => {
              const pct = ((seg.value / total) * 100).toFixed(0)
              if (Number(pct) < 5) return null
              return (
                <text
                  key={'label-' + seg.index}
                  x={seg.labelPos.x}
                  y={seg.labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="4"
                  fill="white"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {pct}%
                </text>
              )
            })}
        </svg>
        {showLegend && (
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {data.map((seg, i) => (
              <div key={i} className="flex items-center gap-1.5 text-sm">
                <span className="inline-block w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-muted-foreground">{seg.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)
ChartPie.displayName = 'ChartPie'

export { ChartPie, chartPieVariants }
