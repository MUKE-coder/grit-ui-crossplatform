import chalk from 'chalk'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

interface InitOptions {
  native?: boolean
  web?: boolean
}

export async function init(options: InitOptions) {
  const platform = options.native ? 'native' : 'web'
  const cwd = process.cwd()

  console.log(chalk.cyan('\n  Grit UI — Initialize\n'))

  // Create components directory
  const componentsDir = join(cwd, 'components', 'ui')
  if (!existsSync(componentsDir)) {
    mkdirSync(componentsDir, { recursive: true })
    console.log(chalk.green('  Created'), 'components/ui/')
  }

  // Create grit-ui.json config
  const config = {
    platform,
    componentsDir: 'components/ui',
    tailwind: {
      config: platform === 'native' ? 'tailwind.config.ts' : 'tailwind.config.ts',
      css: platform === 'native' ? 'global.css' : 'app/globals.css',
    },
    aliases: {
      components: '@/components',
      ui: '@/components/ui',
      hooks: '@/hooks',
      lib: '@/lib',
    },
  }

  const configPath = join(cwd, 'grit-ui.json')
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n')
  console.log(chalk.green('  Created'), 'grit-ui.json')

  // Create cn utility
  const cnPath = join(cwd, 'lib', 'utils.ts')
  if (!existsSync(join(cwd, 'lib'))) {
    mkdirSync(join(cwd, 'lib'), { recursive: true })
  }
  writeFileSync(cnPath, `import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`)
  console.log(chalk.green('  Created'), 'lib/utils.ts')

  console.log()
  console.log(chalk.green('  Grit UI initialized!'))
  console.log(chalk.gray(`  Platform: ${platform}`))
  console.log(chalk.gray('  Add components with: grit-ui add button card input'))
  console.log()
}
