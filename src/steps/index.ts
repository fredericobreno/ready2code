import { Step } from './types'
import { Eslint } from './eslint'
import { Husky } from './husky'
import { LintStaged } from './lintStaged'

export const steps: {
  name: string
  step: Step
}[] = [
  {
    name: 'eslint',
    step: Eslint,
  },
  {
    name: 'husky',
    step: Husky,
  },
  {
    name: 'lint-staged',
    step: LintStaged,
  },
]
