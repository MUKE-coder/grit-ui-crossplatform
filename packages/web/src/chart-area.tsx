import * as React from 'react'
import { cn } from '@grit-ui/core'

/* ---------------------------------- Types ---------------------------------- */

export interface ChartAreaDataPoint {
  label: string
  value: number
}

/** Props for ChartArea. */
export interface ChartAreaProps extends React.SVGAttributes<SVGSVGElement> {
  /** Data points to plot. */
  data: ChartAreaDataPoint[]
  /** Chart width. */
  width?: number
  /** Chart height. */
  height?: number
  /** Padding inside the SVG. */
  padding?: { top: number; right: number; bottom: number; left: number }
  /** Line/fill color. */
  color?: string
  /** Whether to show grid lines. */
  showGrid?: boolean
  /** Whether to show data point dots. */
  showDots?: boolean
  /** Whether to show tooltips on hover. */
  showTooltip?: boolean
  /** Gradient fill opacity (0-1). */
  fillOpacity?: number
  /** Whether to use a smooth curve. */
  smooth?: boolean
}

/**
 * Area chart component using SVG with gradient fill, grid lines, and hover tooltips.
 *
 * @example
 * ```tsx
 * <ChartArea
 *   data={[
 *     { label: "Jan", value: 100 },
 *     { label: "Feb", value: 200 },
 *     { label: "Mar", value: 150 },
 *   ]}
 *   color="hsl(var(--primary))"
 *   showGrid
 *   showDots
 * />
 * ```
 */
const ChartArea = React.forwardRef<SVGSVGElement, ChartAreaProps>(
  (
    {
      className,
      data,
      width = 600,
      height = 300,
      padding = { top: 20, right: 20, bottom: 40, left: 50 },
      color = 'hsl(var(--primary))',
      showGrid = true,
      showDots = true,
      showTooltip = true,
      fillOpacity = 0.2,
      smooth = false,
      ...props
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

    if (data.length === 0) return null

    const chartW = width - padding.left - padding.right
    const chartH = height - padding.top - padding.bottom

    const maxVal = Math.max(...data.map((d) => d.value), 1)
    const minVal = 0

    const xScale = (i: number) => padding.left + (i / Math.max(data.length - 1, 1)) * chartW
    const yScale = (v: number) => padding.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH

    // Build path
    const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.value) }))

    let linePath: string
    if (smooth && points.length > 2) {
      linePath = points.reduce((acc, point, i) => {
        if (i === 0) return 'M ' + point.x + ' ' + point.y
        const prev = points[i - 1]
        const cpx = (prev.x + point.x) / 2
        return acc + ' C ' + cpx + ' ' + prev.y + ' ' + cpx + ' ' + point.y + ' ' + point.x + ' ' + point.y
      }, '')
    } else {
      linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + ' ' + p.x + ' ' + p.y).join(' ')
    }

    const areaPath =
      linePath +
      ' L ' + points[points.length - 1].x + ' ' + (padding.top + chartH) +
      ' L ' + points[0].x + ' ' + (padding.top + chartH) +
      ' Z'

    // Grid lines (5 horizontal)
    const gridLines = Array.from({ length: 5 }, (_, i) => {
      const val = minVal + ((maxVal - minVal) * (4 - i)) / 4
      const y = yScale(val)
      return { y, label: Math.round(val).toString() }
    })

    const gradientId = React.useId()

    return (
      <svg
        ref={ref}
        viewBox={'0 0 ' + width + ' ' + height}
        width={width}
        height={height}
        className={cn('overflow-visible', className)}
        {...props}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>

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
              <text
                x={padding.left - 8}
                y={line.y + 4}
                textAnchor="end"
                fontSize={11}
                fill="currentColor"
                fillOpacity={0.5}
              >
                {line.label}
              </text>
            </g>
          ))}

        {/* X labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={xScale(i)}
            y={height - 8}
            textAnchor="middle"
            fontSize={11}
            fill="currentColor"
            fillOpacity={0.5}
          >
            {d.label}
          </text>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill={'url(#' + gradientId + ')'} />

        {/* Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* Dots & tooltips */}
        {data.map((d, i) => (
          <g key={i}>
            {showDots && (
              <circle
                cx={xScale(i)}
                cy={yScale(d.value)}
                r={hoveredIndex === i ? 5 : 3}
                fill={color}
                stroke="white"
                strokeWidth={2}
                className="transition-all"
              />
            )}
            {/* Hover area */}
            <rect
              x={xScale(i) - chartW / data.length / 2}
              y={padding.top}
              width={chartW / data.length}
              height={chartH}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {/* Tooltip */}
            {showTooltip && hoveredIndex === i && (
              <g>
                <rect
                  x={xScale(i) - 30}
                  y={yScale(d.value) - 32}
                  width={60}
                  height={24}
                  rx={4}
                  fill="hsl(var(--popover))"
                  stroke="hsl(var(--border))"
                  strokeWidth={1}
                />
                <text
                  x={xScale(i)}
                  y={yScale(d.value) - 16}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={500}
                  fill="hsl(var(--popover-foreground))"
                >
                  {d.value}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    )
  }
)
ChartArea.displayName = 'ChartArea'

export { ChartArea }
