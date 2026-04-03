/**
 * Re-export class-variance-authority for type-safe variant definitions.
 *
 * Usage mirrors the Rust variants! macro:
 *
 * ```typescript
 * import { cva } from '@grit-ui/core/variants'
 *
 * const buttonVariants = cva('base-classes', {
 *   variants: {
 *     variant: { default: '...', destructive: '...' },
 *     size: { default: '...', sm: '...', lg: '...' },
 *   },
 *   defaultVariants: { variant: 'default', size: 'default' },
 * })
 * ```
 */
export { cva, type VariantProps } from 'class-variance-authority'
