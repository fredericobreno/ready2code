import inquirer from 'inquirer'
import { Eslint } from './steps'

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
  ])
  .then(async (answers) => {
    const { packageManager, eslintStack } = answers

    await Eslint.install({ packageManager })
    await Eslint.configure({ eslintStack })
  })
