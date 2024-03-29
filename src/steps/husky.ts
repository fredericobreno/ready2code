import { exec } from 'child_process'
import util from 'util'
import fs from 'fs'
import { Step } from './types'

const execPromise = util.promisify(exec)

export const Husky: Step = {
  install: async (options) => {
    const packageManager = options.packageManager || 'npm'
    const installCmd = packageManager === 'yarn' ? 'add' : 'install'

    await execPromise(`${packageManager} ${installCmd} -D husky`)
  },
  configure: async () => {
    await execPromise(`npx husky init`)
    fs.writeFileSync('.husky/pre-commit', 'npx lint-staged\n')
  },
}
