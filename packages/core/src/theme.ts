/**
 * Grit UI Theme — OKLCH Color System
 *
 * Ported from the Rust version's Tailwind v4 theme.
 * Uses OKLCH color space for perceptually uniform colors.
 *
 * Apply via CSS custom properties. Components reference these
 * as Tailwind classes: bg-primary, text-foreground, border-border, etc.
 */

export const lightTheme = {
  background: 'oklch(1 0 0)',
  foreground: 'oklch(0.145 0 0)',
  primary: 'oklch(0.205 0 0)',
  'primary-foreground': 'oklch(0.985 0 0)',
  secondary: 'oklch(0.97 0 0)',
  'secondary-foreground': 'oklch(0.205 0 0)',
  muted: 'oklch(0.97 0 0)',
  'muted-foreground': 'oklch(0.556 0 0)',
  accent: 'oklch(0.97 0 0)',
  'accent-foreground': 'oklch(0.205 0 0)',
  destructive: 'oklch(0.577 0.245 27.325)',
  success: 'oklch(0.65 0.16 145)',
  warning: 'oklch(0.65 0.16 55)',
  info: 'oklch(0.65 0.16 250)',
  border: 'oklch(0.922 0 0)',
  input: 'oklch(0.922 0 0)',
  ring: 'oklch(0.708 0 0)',
} as const

export const darkTheme = {
  background: 'oklch(0.18 0 0)',
  foreground: 'oklch(0.985 0 0)',
  primary: 'oklch(0.922 0 0)',
  'primary-foreground': 'oklch(0.205 0 0)',
  secondary: 'oklch(0.269 0 0)',
  'secondary-foreground': 'oklch(0.985 0 0)',
  muted: 'oklch(0.269 0 0)',
  'muted-foreground': 'oklch(0.708 0 0)',
  accent: 'oklch(0.269 0 0)',
  'accent-foreground': 'oklch(0.985 0 0)',
  destructive: 'oklch(0.704 0.191 22.216)',
  success: 'oklch(0.65 0.16 145)',
  warning: 'oklch(0.65 0.16 55)',
  info: 'oklch(0.65 0.16 250)',
  border: 'oklch(0.3 0 0)',
  input: 'oklch(0.3 0 0)',
  ring: 'oklch(0.556 0 0)',
} as const

/**
 * CSS custom properties string for injecting into a stylesheet.
 * Generates both light (root) and dark (.dark) variables.
 */
export function generateThemeCSS(): string {
  const toVars = (theme: Record<string, string>) =>
    Object.entries(theme)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join('\n')

  return `:root {\n${toVars(lightTheme)}\n  --radius: 0.625rem;\n}\n\n.dark {\n${toVars(darkTheme)}\n}`
}

/**
 * Radius tokens matching Tailwind config.
 */
export const radius = {
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  default: 'var(--radius)',
  lg: 'calc(var(--radius) + 2px)',
  xl: 'calc(var(--radius) + 4px)',
} as const
