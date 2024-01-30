import { exec } from 'child_process'
import util from 'util'
import fs from 'fs'
import { Step } from './types'

const execPromise = util.promisify(exec)

export const LintStaged: Step = {
  install: async (options) => {
    const packageManager = options.packageManager || 'npm'
    const installCmd = packageManager === 'yarn' ? 'add' : 'install'

    await execPromise(`${packageManager} ${installCmd} -D lint-staged`)
  },
  configure: async () => {
    const lintStagedFile = { '*.{js,jsx,ts,tsx}': 'npx eslint . --fix' }

    fs.writeFileSync('.lintstagedrc', JSON.stringify(lintStagedFile, null, 2))
  },
}
