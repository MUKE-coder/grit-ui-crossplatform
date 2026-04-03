import chalk from 'chalk'
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs'
import { join, resolve } from 'path'

const REGISTRY_URL = 'https://raw.githubusercontent.com/MUKE-coder/grit-ui-crossplatform/main/registry'

const CATEGORIES: Record<string, string[]> = {
  'core': [
    'button', 'input', 'label', 'checkbox', 'radio-button', 'switch',
    'textarea', 'select', 'badge', 'avatar', 'card', 'separator',
    'skeleton', 'spinner', 'progress', 'alert', 'kbd', 'link', 'image', 'chips',
  ],
  'layout': [
    'tabs', 'accordion', 'collapsible', 'breadcrumb', 'pagination',
    'bottom-nav', 'sidenav', 'menubar', 'navigation-menu', 'header',
    'footer', 'item', 'scroll-area', 'aspect-ratio',
  ],
  'overlay': [
    'dialog', 'alert-dialog', 'drawer', 'tooltip', 'popover',
    'hover-card', 'context-menu', 'dropdown-menu', 'toast', 'callout',
  ],
  'form': [
    'field', 'form', 'auto-form', 'input-otp', 'input-phone',
    'input-group', 'multi-select', 'select-native', 'radio-button-group', 'toggle-group',
  ],
  'data': [
    'table', 'data-table', 'data-grid', 'empty', 'status',
    'shimmer', 'bento-grid', 'chart-area', 'chart-bar', 'chart-line',
  ],
  'advanced': [
    'chart-pie', 'chart-radar', 'chart-radial', 'date-picker', 'date-picker-range',
    'carousel', 'card-carousel', 'drag-and-drop', 'command', 'marquee',
    'animate', 'animate-group', 'pressable', 'faq-transition',
  ],
  'specialized': [
    'chat', 'action-bar', 'mask', 'direction-provider', 'theme-toggle', 'expandable',
  ],
}

const ALL_COMPONENTS = Object.values(CATEGORIES).flat()

interface AddOptions {
  all?: boolean
  category?: string
  native?: boolean
  overwrite?: boolean
}

export async function add(components: string[], options: AddOptions) {
  const cwd = process.cwd()

  // Determine platform from config or flag
  let platform = 'web'
  const configPath = join(cwd, 'grit-ui.json')
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'))
    platform = config.platform || 'web'
  }
  if (options.native) platform = 'native'

  // Determine which components to add
  let toAdd: string[] = []
  if (options.all) {
    toAdd = ALL_COMPONENTS
  } else if (options.category) {
    const cat = CATEGORIES[options.category]
    if (!cat) {
      console.log(chalk.red(`  Unknown category: ${options.category}`))
      console.log(chalk.gray(`  Available: ${Object.keys(CATEGORIES).join(', ')}`))
      return
    }
    toAdd = cat
  } else {
    toAdd = components
  }

  if (toAdd.length === 0) {
    console.log(chalk.yellow('  No components specified.'))
    console.log(chalk.gray('  Usage: grit-ui add button card input'))
    console.log(chalk.gray('  Or:    grit-ui add --all'))
    console.log(chalk.gray('  Or:    grit-ui add --category core'))
    return
  }

  // Validate component names
  const invalid = toAdd.filter(c => !ALL_COMPONENTS.includes(c))
  if (invalid.length > 0) {
    console.log(chalk.red(`  Unknown components: ${invalid.join(', ')}`))
    return
  }

  console.log(chalk.cyan(`\n  Installing ${toAdd.length} component(s) (${platform})...\n`))

  // Ensure target directory exists
  const targetDir = join(cwd, 'components', 'ui')
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true })
  }

  let installed = 0
  let skipped = 0

  for (const name of toAdd) {
    const targetFile = join(targetDir, `${name}.tsx`)

    if (existsSync(targetFile) && !options.overwrite) {
      console.log(chalk.gray(`  Skip  ${name}.tsx (exists, use --overwrite)`))
      skipped++
      continue
    }

    // Try to fetch from registry or copy from local packages
    try {
      const registryFile = join(cwd, '..', 'grit-ui-crossplatform', 'packages', platform, 'src', `${name}.tsx`)
      const localFile = resolve(__dirname, '..', '..', '..', platform, 'src', `${name}.tsx`)

      let source = ''
      if (existsSync(registryFile)) {
        source = readFileSync(registryFile, 'utf-8')
      } else if (existsSync(localFile)) {
        source = readFileSync(localFile, 'utf-8')
      } else {
        // Fetch from GitHub
        const url = `${REGISTRY_URL}/${platform}/${name}.json`
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json() as { source: string }
        source = data.source
      }

      // Rewrite imports: @grit-ui/core → local lib/utils
      source = source.replace(
        /import\s*\{[^}]*\}\s*from\s*['"]@grit-ui\/core['"]/g,
        "import { cn } from '@/lib/utils'\nimport { cva, type VariantProps } from 'class-variance-authority'"
      )
      source = source.replace(
        /from\s*['"]@grit-ui\/core['"]/g,
        "from '@/lib/utils'"
      )

      writeFileSync(targetFile, source)
      console.log(chalk.green(`  Added ${name}.tsx`))
      installed++
    } catch (err) {
      console.log(chalk.red(`  Error ${name}: ${(err as Error).message}`))
    }
  }

  console.log()
  console.log(chalk.green(`  ${installed} installed`), skipped > 0 ? chalk.gray(`(${skipped} skipped)`) : '')
  console.log()
}
