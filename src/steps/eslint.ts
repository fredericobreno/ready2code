import { exec } from 'child_process'
import util from 'util'
import fs from 'fs'
import { Step } from './types'

const execPromise = util.promisify(exec)

export const Eslint: Step = {
  install: async (answers) => {
    const packageManager = answers.packageManager || 'npm'
    const installCmd = packageManager === 'yarn' ? 'add' : 'install'
    const hasTypescript = answers.hasTypescript

    await execPromise(
      `${packageManager} ${installCmd} -D eslint@8 @rocketseat/eslint-config ${hasTypescript ? '@typescript-eslint/eslint-plugin' : ''}`,
    )
  },
  configure: async (answers) => {
    const eslintStack = answers?.eslintStack || 'node'
    const eslintConfig: { extends: string[] } = {
      extends: [`@rocketseat/eslint-config/${eslintStack}`],
    }

    fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2))
  },
}
