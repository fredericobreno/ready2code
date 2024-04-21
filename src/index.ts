#!/usr/bin/env node
import inquirer from 'inquirer'
import { steps } from './steps'
import ora from 'ora'

inquirer
  .prompt([
    {
      type: 'list',
      name: 'packageManager',
      message: 'Which package manager do you want to use?',
      choices: ['npm', 'yarn', 'pnpm'],
    },
    {
      type: 'list',
      name: 'eslintStack',
      message: 'Which stack do you want to use?',
      choices: [
        { name: 'React (with Next.js)', value: 'next' },
        { name: 'React (without Next.js)', value: 'react' },
        { name: 'Node.js', value: 'node' },
      ],
    },
    {
      type: 'confirm',
      name: 'hasTypescript',
      message: 'Do you want to use TypeScript?',
    },
  ])
  .then(async (answers) => {
    for (const { name, step } of steps) {
      const installSpinner = ora(`installing ${name}...`).start()
      const configSpinner = ora(`configuring ${name}...`)

      try {
        await step.install(answers)
        installSpinner.succeed(`${name} installed successfully!`)
      } catch (err) {
        installSpinner.fail(`failed to install ${name}`)
        console.error(err)
        process.exit(1)
      }

      try {
        configSpinner.start()
        await step.configure(answers)
        configSpinner.succeed(`${name} configured successfully!`)
      } catch (err) {
        configSpinner.fail(`failed to configure ${name}`)
        console.error(err)
        process.exit(1)
      }
    }
  })
