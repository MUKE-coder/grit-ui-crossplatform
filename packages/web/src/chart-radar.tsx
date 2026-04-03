import * as React from 'react'
import { cn, cva, type VariantProps } from '@grit-ui/core'

/**
 * Radar chart variant definitions using CVA.
 */
const chartRadarVariants = cva('relative', {
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

/** A single data series for the radar chart. */
export interface RadarSeries {
  /** Series label. */
  label: string
  /** Values for each axis, in order. */
  values: number[]
  /** Fill/stroke color (CSS color string). */
  color: string
  /** Fill opacity (0-1). Default 0.2. */
  fillOpacity?: number
}

/** Props for the ChartRadar component. */
export interface ChartRadarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartRadarVariants> {
  /** Axis labels (one per spoke). */
  axes: string[]
  /** Data series to render. */
  series: RadarSeries[]
  /** Maximum value on each axis. Default 100. */
  max?: number
  /** Number of concentric grid rings. Default 5. */
  rings?: number
  /** Show a legend. */
  showLegend?: boolean
  /** Show axis labels. */
  showLabels?: boolean
}

/** Polar to cartesian helper. */
function polToCart(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

/**
 * Radar/spider chart rendered with SVG.
 * Supports multiple data series and axis labels.
 *
 * @example
 * ```tsx
 * <ChartRadar
 *   axes={['Speed', 'Power', 'Range', 'Durability', 'Precision']}
 *   series={[
 *     { label: 'Player A', values: [80, 90, 70, 60, 85], color: '#6c5ce7' },
 *     { label: 'Player B', values: [60, 70, 90, 80, 65], color: '#00b894' },
 *   ]}
 *   showLegend
 * />
 * ```
 */
const ChartRadar = React.forwardRef<HTMLDivElement, ChartRadarProps>(
  (
    {
      className,
      size,
      axes,
      series,
      max = 100,
      rings = 5,
      showLegend = false,
      showLabels = true,
      ...props
    },
    ref
  ) => {
    const cx = 50
    const cy = 50
    const outerR = 38
    const axisCount = axes.length
    const angleStep = 360 / axisCount

    function getPoint(axisIndex: number, value: number) {
      const r = (value / max) * outerR
      return polToCart(cx, cy, r, axisIndex * angleStep)
    }

    function buildPolygon(values: number[]) {
      return values
        .map((v, i) => {
          const p = getPoint(i, Math.min(v, max))
          return p.x + ',' + p.y
        })
        .join(' ')
    }

    // Grid rings
    const gridRings = Array.from({ length: rings }, (_, i) => {
      const r = ((i + 1) / rings) * outerR
      const points = Array.from({ length: axisCount }, (_, j) => {
        const p = polToCart(cx, cy, r, j * angleStep)
        return p.x + ',' + p.y
      }).join(' ')
      return points
    })

    return (
      <div ref={ref} className={cn(chartRadarVariants({ size }), 'flex flex-col items-center', className)} {...props}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Grid */}
          {gridRings.map((pts, i) => (
            <polygon
              key={'ring-' + i}
              points={pts}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-muted-foreground/30"
            />
          ))}
          {/* Spokes */}
          {axes.map((_, i) => {
            const end = polToCart(cx, cy, outerR, i * angleStep)
            return (
              <line
                key={'spoke-' + i}
                x1={cx}
                y1={cy}
                x2={end.x}
                y2={end.y}
                stroke="currentColor"
                strokeWidth="0.2"
                className="text-muted-foreground/30"
              />
            )
          })}
          {/* Data series */}
          {series.map((s, si) => (
            <polygon
              key={'series-' + si}
              points={buildPolygon(s.values)}
              fill={s.color}
              fillOpacity={s.fillOpacity ?? 0.2}
              stroke={s.color}
              strokeWidth="0.5"
            />
          ))}
          {/* Data points */}
          {series.map((s, si) =>
            s.values.map((v, i) => {
              const p = getPoint(i, Math.min(v, max))
              return (
                <circle
                  key={'dot-' + si + '-' + i}
                  cx={p.x}
                  cy={p.y}
                  r="1"
                  fill={s.color}
                />
              )
            })
          )}
          {/* Axis labels */}
          {showLabels &&
            axes.map((label, i) => {
              const p = polToCart(cx, cy, outerR + 6, i * angleStep)
              return (
                <text
                  key={'axlabel-' + i}
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="3"
                  fill="currentColor"
                  className="text-muted-foreground"
                >
                  {label}
                </text>
              )
            })}
        </svg>
        {showLegend && (
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {series.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 text-sm">
                <span className="inline-block w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)
ChartRadar.displayName = 'ChartRadar'

export { ChartRadar, chartRadarVariants }
