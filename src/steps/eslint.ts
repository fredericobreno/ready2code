import ora from 'ora'
import { exec } from 'child_process'
import util from 'util'
import fs from 'fs'

const execPromise = util.promisify(exec)

export const Eslint = {
  install: async ({ packageManager }: { packageManager: string }) => {
    const spinner = ora('installing eslint...').start()
    const installCmd = packageManager === 'yarn' ? 'add' : 'install'

    try {
      const { stderr } = await execPromise(
        `${packageManager} ${installCmd} -D eslint @rocketseat/eslint-config`,
      )

      if (stderr) {
        spinner.fail('error trying to install eslint')
        console.error(stderr)
        return
      }

      spinner.succeed('eslint installed successfully!')
    } catch (err) {
      spinner.fail('error trying to install eslint')
      console.error(err)
    }
  },
  configure: async ({ eslintStack }: { eslintStack: string }) => {
    const spinner = ora('configuring eslint...').start()

    try {
      const eslintFile = fs.readFileSync('.eslintrc.json', 'utf-8')
      const eslintConfig = JSON.parse(eslintFile)

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
      spinner.succeed('eslint configured successfully!')
    } catch (err) {
      if ((err as { code: string }).code === 'ENOENT') {
        fs.writeFileSync('.eslintrc.json', '{ "extends": [] }')
        Eslint.configure({ eslintStack })
        spinner.stop()
        return
      }

      spinner.fail('error trying to configure eslint')
      console.error(err)
    }
  },
}
