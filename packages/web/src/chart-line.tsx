import * as React from 'react'
import { cn } from '@grit-ui/core'

/* ---------------------------------- Types ---------------------------------- */

export interface ChartLineSeries {
  /** Series name for the legend. */
  name: string
  /** Data values, one per label. */
  data: number[]
  /** Line color. */
  color?: string
}

/** Props for ChartLine. */
export interface ChartLineProps extends React.SVGAttributes<SVGSVGElement> {
  /** X-axis labels. */
  labels: string[]
  /** One or more data series. */
  series: ChartLineSeries[]
  /** Chart width. */
  width?: number
  /** Chart height. */
  height?: number
  /** Padding inside the SVG. */
  padding?: { top: number; right: number; bottom: number; left: number }
  /** Default colors for series without explicit color. */
  colors?: string[]
  /** Whether to show grid lines. */
  showGrid?: boolean
  /** Whether to show data point dots. */
  showDots?: boolean
  /** Whether to show tooltips on hover. */
  showTooltip?: boolean
  /** Whether to show the legend. */
  showLegend?: boolean
  /** Whether to use smooth curves. */
  smooth?: boolean
}

/**
 * Line chart with multiple series, data points, smooth curves, grid, and legend.
 *
 * @example
 * ```tsx
 * <ChartLine
 *   labels={["Jan", "Feb", "Mar", "Apr"]}
 *   series={[
 *     { name: "Revenue", data: [100, 200, 150, 300] },
 *     { name: "Expenses", data: [80, 150, 120, 200] },
 *   ]}
 *   showGrid
 *   showDots
 *   showLegend
 *   smooth
 * />
 * ```
 */
const ChartLine = React.forwardRef<SVGSVGElement, ChartLineProps>(
  (
    {
      className,
      labels,
      series,
      width = 600,
      height = 300,
      padding = { top: 20, right: 20, bottom: 40, left: 50 },
      colors = [
        'hsl(var(--primary))',
        'hsl(var(--destructive))',
        'hsl(210, 70%, 50%)',
        'hsl(150, 60%, 45%)',
        'hsl(45, 90%, 55%)',
      ],
      showGrid = true,
      showDots = true,
      showTooltip = true,
      showLegend = true,
      smooth = false,
      ...props
    },
    ref
  ) => {
    const [hoveredPoint, setHoveredPoint] = React.useState<{ series: number; index: number } | null>(null)

    if (labels.length === 0 || series.length === 0) return null

    const chartW = width - padding.left - padding.right
    const chartH = height - padding.top - padding.bottom
    const legendH = showLegend ? 24 : 0

    const allValues = series.flatMap((s) => s.data)
    const maxVal = Math.max(...allValues, 1)
    const minVal = Math.min(...allValues, 0)
    const range = maxVal - minVal || 1

    const xScale = (i: number) => padding.left + (i / Math.max(labels.length - 1, 1)) * chartW
    const yScale = (v: number) => padding.top + chartH - ((v - minVal) / range) * chartH

    const buildPath = (data: number[]): string => {
      const points = data.map((v, i) => ({ x: xScale(i), y: yScale(v) }))
      if (smooth && points.length > 2) {
        return points.reduce((acc, point, i) => {
          if (i === 0) return 'M ' + point.x + ' ' + point.y
          const prev = points[i - 1]
          const cpx = (prev.x + point.x) / 2
          return acc + ' C ' + cpx + ' ' + prev.y + ' ' + cpx + ' ' + point.y + ' ' + point.x + ' ' + point.y
        }, '')
      }
      return points.map((p, i) => (i === 0 ? 'M' : 'L') + ' ' + p.x + ' ' + p.y).join(' ')
    }

    // Grid lines (5 horizontal)
    const gridLines = Array.from({ length: 5 }, (_, i) => {
      const val = minVal + (range * (4 - i)) / 4
      return { y: yScale(val), label: Math.round(val).toString() }
    })

    return (
      <svg
        ref={ref}
        viewBox={'0 0 ' + width + ' ' + (height + legendH)}
        width={width}
        height={height + legendH}
        className={cn('overflow-visible', className)}
        {...props}
      >
        {/* Grid */}
        {showGrid &&
          gridLines.map((line, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={line.y}
                x2={padding.left + chartW}
                y2={line.y}
                stroke="currentColor"
                strokeOpacity={0.1}
                strokeDasharray="4 4"
              />
              <text x={padding.left - 8} y={line.y + 4} textAnchor="end" fontSize={11} fill="currentColor" fillOpacity={0.5}>
                {line.label}
              </text>
            </g>
          ))}

        {/* X labels */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={xScale(i)}
            y={height - 8}
            textAnchor="middle"
            fontSize={11}
            fill="currentColor"
            fillOpacity={0.5}
          >
            {label}
          </text>
        ))}

        {/* Lines */}
        {series.map((s, si) => {
          const color = s.color ?? colors[si % colors.length]
          const path = buildPath(s.data)

          return (
            <g key={si}>
              <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

              {/* Dots */}
              {s.data.map((val, i) => {
                const isHovered = hoveredPoint?.series === si && hoveredPoint?.index === i
                return (
                  <g key={i}>
                    {showDots && (
                      <circle
                        cx={xScale(i)}
                        cy={yScale(val)}
                        r={isHovered ? 5 : 3}
                        fill={color}
                        stroke="white"
                        strokeWidth={2}
                        className="transition-all"
                      />
                    )}
                    {/* Hover area */}
                    <rect
                      x={xScale(i) - chartW / labels.length / 2}
                      y={padding.top}
                      width={chartW / labels.length}
                      height={chartH}
                      fill="transparent"
                      onMouseEnter={() => setHoveredPoint({ series: si, index: i })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    {/* Tooltip */}
                    {showTooltip && isHovered && (
                      <g>
                        <rect
                          x={xScale(i) - 35}
                          y={yScale(val) - 32}
                          width={70}
                          height={24}
                          rx={4}
                          fill="hsl(var(--popover))"
                          stroke="hsl(var(--border))"
                          strokeWidth={1}
                        />
                        <text
                          x={xScale(i)}
                          y={yScale(val) - 16}
                          textAnchor="middle"
                          fontSize={11}
                          fontWeight={500}
                          fill="hsl(var(--popover-foreground))"
                        >
                          {s.name}: {val}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
            </g>
          )
        })}

        {/* Legend */}
        {showLegend && (
          <g>
            {series.map((s, si) => {
              const color = s.color ?? colors[si % colors.length]
              return (
                <g key={si} transform={'translate(' + (padding.left + si * 120) + ', ' + (height + 8) + ')'}>
                  <line x1={0} y1={6} x2={16} y2={6} stroke={color} strokeWidth={2} />
                  {showDots && <circle cx={8} cy={6} r={3} fill={color} />}
                  <text x={20} y={10} fontSize={11} fill="currentColor" fillOpacity={0.7}>{s.name}</text>
                </g>
              )
            })}
          </g>
        )}
      </svg>
    )
  }
)
ChartLine.displayName = 'ChartLine'

export { ChartLine }
export type { ChartLineSeries }
