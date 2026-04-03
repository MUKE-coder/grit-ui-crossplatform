#!/usr/bin/env node

import { Command } from 'commander'
import { add } from './commands/add.js'
import { init } from './commands/init.js'
import { list } from './commands/list.js'

const program = new Command()

program
  .name('grit-ui')
  .description('CLI for installing Grit UI components')
  .version('0.1.0')

program
  .command('init')
  .description('Initialize Grit UI in your project')
  .option('--native', 'Initialize for React Native (NativeWind)')
  .option('--web', 'Initialize for React DOM (default)')
  .action(init)

program
  .command('add [components...]')
  .description('Add components to your project')
  .option('--all', 'Add all components')
  .option('--category <category>', 'Add all components in a category')
  .option('--native', 'Install React Native versions')
  .option('--overwrite', 'Overwrite existing components')
  .action(add)

program
  .command('list')
  .description('List available components')
  .option('--category', 'Group by category')
  .action(list)

program.parse()
