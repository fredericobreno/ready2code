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
      `${packageManager} ${installCmd} -D eslint @rocketseat/eslint-config`,
    )
  },
  configure: async (options) => {
    const eslintStack = options?.eslintStack || 'node'
    const eslintFile = fs.readFileSync('.eslintrc.json', 'utf-8')
    const eslintConfig = JSON.parse(eslintFile)

    try {
      if (eslintConfig.extends) {
        if (Array.isArray(eslintConfig.extends)) {
          eslintConfig.extends.push(`@rocketseat/eslint-config/${eslintStack}`)
        } else {
          eslintConfig.extends = [
            eslintConfig.extends,
            `@rocketseat/eslint-config/${eslintStack}`,
          ]
        }
      } else {
        eslintConfig.extends = [`@rocketseat/eslint-config/${eslintStack}`]
      }

      eslintConfig.extends = [...new Set([...eslintConfig.extends])]

      fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2))
    } catch (err) {
      if ((err as { code: string }).code === 'ENOENT') {
        fs.writeFileSync('.eslintrc.json', '{ "extends": [] }')
        Eslint.configure({ eslintStack })
      }
    }
  },
}
