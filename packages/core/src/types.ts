import type { VariantProps } from 'class-variance-authority'

/**
 * Common size variants used across components.
 */
export type Size = 'default' | 'sm' | 'lg' | 'xl' | 'icon' | 'icon-sm'

/**
 * Common semantic variants.
 */
export type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'

/**
 * Semantic color variants for feedback components.
 */
export type SemanticColor = 'default' | 'success' | 'warning' | 'destructive' | 'info'

/**
 * Orientation for layout components.
 */
export type Orientation = 'horizontal' | 'vertical'

/**
 * Side for drawer/popover positioning.
 */
export type Side = 'top' | 'right' | 'bottom' | 'left'

/**
 * Alignment for popover/tooltip.
 */
export type Align = 'start' | 'center' | 'end'

/**
 * Extract variant props from a CVA definition.
 * Re-exported for convenience.
 */
export type { VariantProps }
