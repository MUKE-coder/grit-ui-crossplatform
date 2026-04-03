import chalk from 'chalk'

const CATEGORIES: Record<string, string[]> = {
  'Core Primitives': [
    'button', 'input', 'label', 'checkbox', 'radio-button', 'switch',
    'textarea', 'select', 'badge', 'avatar', 'card', 'separator',
    'skeleton', 'spinner', 'progress', 'alert', 'kbd', 'link', 'image', 'chips',
  ],
  'Layout & Navigation': [
    'tabs', 'accordion', 'collapsible', 'breadcrumb', 'pagination',
    'bottom-nav', 'sidenav', 'menubar', 'navigation-menu', 'header',
    'footer', 'item', 'scroll-area', 'aspect-ratio',
  ],
  'Overlays & Feedback': [
    'dialog', 'alert-dialog', 'drawer', 'tooltip', 'popover',
    'hover-card', 'context-menu', 'dropdown-menu', 'toast', 'callout',
  ],
  'Forms & Input': [
    'field', 'form', 'auto-form', 'input-otp', 'input-phone',
    'input-group', 'multi-select', 'select-native', 'radio-button-group', 'toggle-group',
  ],
  'Data Display': [
    'table', 'data-table', 'data-grid', 'empty', 'status',
    'shimmer', 'bento-grid', 'chart-area', 'chart-bar', 'chart-line',
  ],
  'Advanced & Animation': [
    'chart-pie', 'chart-radar', 'chart-radial', 'date-picker', 'date-picker-range',
    'carousel', 'card-carousel', 'drag-and-drop', 'command', 'marquee',
    'animate', 'animate-group', 'pressable', 'faq-transition',
  ],
  'Specialized': [
    'chat', 'action-bar', 'mask', 'direction-provider', 'theme-toggle', 'expandable',
  ],
}

interface ListOptions {
  category?: boolean
}

export function list(options: ListOptions) {
  const all = Object.values(CATEGORIES).flat()

  console.log(chalk.cyan(`\n  Grit UI — ${all.length} components available\n`))

  if (options.category) {
    for (const [category, components] of Object.entries(CATEGORIES)) {
      console.log(chalk.white.bold(`  ${category} (${components.length})`))
      console.log(chalk.gray(`  ${components.join(', ')}`))
      console.log()
    }
  } else {
    // Simple list
    for (let i = 0; i < all.length; i += 6) {
      const row = all.slice(i, i + 6).map(c => c.padEnd(22)).join('')
      console.log(chalk.gray(`  ${row}`))
    }
    console.log()
  }

  console.log(chalk.gray('  Install: grit-ui add button card input'))
  console.log(chalk.gray('  Install all: grit-ui add --all'))
  console.log()
}
