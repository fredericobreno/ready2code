import ora from 'ora'
import { exec } from 'child_process'
import util from 'util'
import fs from 'fs'

const execPromise = util.promisify(exec)

export const Husky = {
  install: async ({ packageManager }: { packageManager: string }) => {
    const spinner = ora('installing husky...').start()
    const installCmd = packageManager === 'yarn' ? 'add' : 'install'

    try {
      const { stderr } = await execPromise(
        `${packageManager} ${installCmd} -D husky`,
      )

      if (stderr) {
        spinner.fail('error trying to install husky')
        console.error(stderr)
        return
      }

      spinner.succeed('husky installed successfully!')
    } catch (err) {
      spinner.fail('error trying to install husky')
      console.error(err)
    }
  },
  configure: async () => {
    const spinner = ora('configuring husky...').start()

    try {
      const { stderr } = await execPromise(`npx husky init`)

      if (stderr) {
        spinner.fail('error trying to configure husky')
        console.error(stderr)
        return
      }

      fs.writeFileSync('.husky/pre-commit', 'npx lint-staged\n')

      spinner.succeed('husky configured successfully!')
    } catch (err) {
      spinner.fail('error trying to configure husky')
      console.error(err)
    }
  },
}
