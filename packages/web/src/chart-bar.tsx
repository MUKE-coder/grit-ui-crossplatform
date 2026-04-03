import * as React from 'react'
import { cn } from '@grit-ui/core'

/* ---------------------------------- Types ---------------------------------- */

export interface ChartBarDataPoint {
  label: string
  values: number[]
}

/** Props for ChartBar. */
export interface ChartBarProps extends React.SVGAttributes<SVGSVGElement> {
  /** Data points. Each can have multiple values for grouped/stacked bars. */
  data: ChartBarDataPoint[]
  /** Chart width. */
  width?: number
  /** Chart height. */
  height?: number
  /** Padding inside the SVG. */
  padding?: { top: number; right: number; bottom: number; left: number }
  /** Colors for each series. */
  colors?: string[]
  /** Bar orientation. */
  orientation?: 'vertical' | 'horizontal'
  /** Display mode: grouped or stacked. */
  mode?: 'grouped' | 'stacked'
  /** Whether to show grid lines. */
  showGrid?: boolean
  /** Whether to show value labels on bars. */
  showLabels?: boolean
  /** Whether to show tooltips on hover. */
  showTooltip?: boolean
  /** Bar corner radius. */
  barRadius?: number
  /** Legend labels for each series. */
  legend?: string[]
}

/**
 * Bar chart with horizontal/vertical orientation, grouped/stacked modes, labels, and tooltips.
 *
 * @example
 * ```tsx
 * <ChartBar
 *   data={[
 *     { label: "Q1", values: [100, 80] },
 *     { label: "Q2", values: [150, 120] },
 *     { label: "Q3", values: [200, 90] },
 *   ]}
 *   colors={["hsl(var(--primary))", "hsl(var(--muted-foreground))"]}
 *   legend={["Revenue", "Cost"]}
 *   showGrid
 * />
 * ```
 */
const ChartBar = React.forwardRef<SVGSVGElement, ChartBarProps>(
  (
    {
      className,
      data,
      width = 600,
      height = 300,
      padding = { top: 20, right: 20, bottom: 40, left: 50 },
      colors = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))', 'hsl(var(--accent))'],
      orientation = 'vertical',
      mode = 'grouped',
      showGrid = true,
      showLabels = false,
      showTooltip = true,
      barRadius = 2,
      legend,
      ...props
    },
    ref
  ) => {
    const [hovered, setHovered] = React.useState<{ group: number; series: number } | null>(null)

    if (data.length === 0) return null

    const seriesCount = Math.max(...data.map((d) => d.values.length), 1)
    const chartW = width - padding.left - padding.right
    const chartH = height - padding.top - padding.bottom

    // Compute max value
    let maxVal: number
    if (mode === 'stacked') {
      maxVal = Math.max(...data.map((d) => d.values.reduce((a, b) => a + b, 0)), 1)
    } else {
      maxVal = Math.max(...data.flatMap((d) => d.values), 1)
    }

    const isVertical = orientation === 'vertical'

    // Grid lines (5)
    const gridLines = Array.from({ length: 5 }, (_, i) => {
      const val = (maxVal * (i + 1)) / 5
      return { val, label: Math.round(val).toString() }
    })

    const groupWidth = isVertical
      ? chartW / data.length
      : chartH / data.length

    const barGap = 4
    const barWidth =
      mode === 'grouped'
        ? (groupWidth - barGap * (seriesCount + 1)) / seriesCount
        : groupWidth - barGap * 2

    return (
      <svg
        ref={ref}
        viewBox={'0 0 ' + width + ' ' + height}
        width={width}
        height={height}
        className={cn('overflow-visible', className)}
        {...props}
      >
        {/* Grid */}
        {showGrid &&
          gridLines.map((line, i) => {
            if (isVertical) {
              const y = padding.top + chartH - (line.val / maxVal) * chartH
              return (
                <g key={i}>
                  <line x1={padding.left} y1={y} x2={padding.left + chartW} y2={y} stroke="currentColor" strokeOpacity={0.1} strokeDasharray="4 4" />
                  <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize={11} fill="currentColor" fillOpacity={0.5}>{line.label}</text>
                </g>
              )
            } else {
              const x = padding.left + (line.val / maxVal) * chartW
              return (
                <g key={i}>
                  <line x1={x} y1={padding.top} x2={x} y2={padding.top + chartH} stroke="currentColor" strokeOpacity={0.1} strokeDasharray="4 4" />
                  <text x={x} y={height - 8} textAnchor="middle" fontSize={11} fill="currentColor" fillOpacity={0.5}>{line.label}</text>
                </g>
              )
            }
          })}

        {/* Bars */}
        {data.map((group, gi) => {
          if (isVertical) {
            const groupX = padding.left + gi * groupWidth

            if (mode === 'stacked') {
              let cumulative = 0
              return (
                <g key={gi}>
                  {group.values.map((val, si) => {
                    const barH = (val / maxVal) * chartH
                    const y = padding.top + chartH - cumulative - barH
                    cumulative += barH
                    const isHovered = hovered?.group === gi && hovered?.series === si

                    return (
                      <g key={si}>
                        <rect
                          x={groupX + barGap}
                          y={y}
                          width={barWidth}
                          height={barH}
                          rx={si === group.values.length - 1 ? barRadius : 0}
                          fill={colors[si % colors.length]}
                          opacity={isHovered ? 0.8 : 1}
                          onMouseEnter={() => setHovered({ group: gi, series: si })}
                          onMouseLeave={() => setHovered(null)}
                        />
                        {showLabels && barH > 14 && (
                          <text x={groupX + barGap + barWidth / 2} y={y + barH / 2 + 4} textAnchor="middle" fontSize={10} fill="white">{val}</text>
                        )}
                        {showTooltip && isHovered && (
                          <g>
                            <rect x={groupX + barGap + barWidth / 2 - 25} y={y - 28} width={50} height={22} rx={4} fill="hsl(var(--popover))" stroke="hsl(var(--border))" />
                            <text x={groupX + barGap + barWidth / 2} y={y - 13} textAnchor="middle" fontSize={11} fontWeight={500} fill="hsl(var(--popover-foreground))">{val}</text>
                          </g>
                        )}
                      </g>
                    )
                  })}
                  <text x={groupX + groupWidth / 2} y={height - 8} textAnchor="middle" fontSize={11} fill="currentColor" fillOpacity={0.5}>{group.label}</text>
                </g>
              )
            }

            // Grouped
            return (
              <g key={gi}>
                {group.values.map((val, si) => {
                  const barH = (val / maxVal) * chartH
                  const x = groupX + barGap + si * (barWidth + barGap)
                  const y = padding.top + chartH - barH
                  const isHovered = hovered?.group === gi && hovered?.series === si

                  return (
                    <g key={si}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barH}
                        rx={barRadius}
                        fill={colors[si % colors.length]}
                        opacity={isHovered ? 0.8 : 1}
                        onMouseEnter={() => setHovered({ group: gi, series: si })}
                        onMouseLeave={() => setHovered(null)}
                      />
                      {showLabels && barH > 14 && (
                        <text x={x + barWidth / 2} y={y - 4} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.7}>{val}</text>
                      )}
                      {showTooltip && isHovered && (
                        <g>
                          <rect x={x + barWidth / 2 - 25} y={y - 28} width={50} height={22} rx={4} fill="hsl(var(--popover))" stroke="hsl(var(--border))" />
                          <text x={x + barWidth / 2} y={y - 13} textAnchor="middle" fontSize={11} fontWeight={500} fill="hsl(var(--popover-foreground))">{val}</text>
                        </g>
                      )}
                    </g>
                  )
                })}
                <text x={groupX + groupWidth / 2} y={height - 8} textAnchor="middle" fontSize={11} fill="currentColor" fillOpacity={0.5}>{group.label}</text>
              </g>
            )
          }

          // Horizontal
          const groupY = padding.top + gi * groupWidth

          if (mode === 'stacked') {
            let cumulative = 0
            return (
              <g key={gi}>
                {group.values.map((val, si) => {
                  const barW = (val / maxVal) * chartW
                  const x = padding.left + cumulative
                  cumulative += barW
                  const isHovered = hovered?.group === gi && hovered?.series === si

                  return (
                    <g key={si}>
                      <rect
                        x={x}
                        y={groupY + barGap}
                        width={barW}
                        height={barWidth}
                        rx={si === group.values.length - 1 ? barRadius : 0}
                        fill={colors[si % colors.length]}
                        opacity={isHovered ? 0.8 : 1}
                        onMouseEnter={() => setHovered({ group: gi, series: si })}
                        onMouseLeave={() => setHovered(null)}
                      />
                    </g>
                  )
                })}
                <text x={padding.left - 8} y={groupY + groupWidth / 2 + 4} textAnchor="end" fontSize={11} fill="currentColor" fillOpacity={0.5}>{group.label}</text>
              </g>
            )
          }

          return (
            <g key={gi}>
              {group.values.map((val, si) => {
                const barW = (val / maxVal) * chartW
                const y = groupY + barGap + si * (barWidth + barGap)
                const isHovered = hovered?.group === gi && hovered?.series === si

                return (
                  <g key={si}>
                    <rect
                      x={padding.left}
                      y={y}
                      width={barW}
                      height={barWidth}
                      rx={barRadius}
                      fill={colors[si % colors.length]}
                      opacity={isHovered ? 0.8 : 1}
                      onMouseEnter={() => setHovered({ group: gi, series: si })}
                      onMouseLeave={() => setHovered(null)}
                    />
                  </g>
                )
              })}
              <text x={padding.left - 8} y={groupY + groupWidth / 2 + 4} textAnchor="end" fontSize={11} fill="currentColor" fillOpacity={0.5}>{group.label}</text>
            </g>
          )
        })}

        {/* Legend */}
        {legend && legend.length > 0 && (
          <g>
            {legend.map((label, i) => (
              <g key={i} transform={'translate(' + (padding.left + i * 100) + ', ' + (height - 2) + ')'}>
                <rect width={10} height={10} rx={2} fill={colors[i % colors.length]} />
                <text x={14} y={9} fontSize={11} fill="currentColor" fillOpacity={0.7}>{label}</text>
              </g>
            ))}
          </g>
        )}
      </svg>
    )
  }
)
ChartBar.displayName = 'ChartBar'

export { ChartBar }
export type { ChartBarDataPoint }
