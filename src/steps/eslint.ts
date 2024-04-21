import { exec } from 'child_process'
import util from 'util'
import fs from 'fs'
import { Step } from './types'

const execPromise = util.promisify(exec)

export const Eslint: Step = {
  install: async (options) => {
    const packageManager = options.packageManager || 'npm'
    const installCmd = packageManager === 'yarn' ? 'add' : 'install'

    await execPromise(
      `${packageManager} ${installCmd} -D eslint@8 @rocketseat/eslint-config`,
    )
  },
  configure: async (options) => {
    const eslintStack = options?.eslintStack || 'node'
    const eslintConfig: { extends: string[] } = {
      extends: [`@rocketseat/eslint-config/${eslintStack}`],
    }

    fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2))
  },
}
