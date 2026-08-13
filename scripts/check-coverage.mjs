import { spawnSync } from 'node:child_process'

const args = [
  '--test',
  '--experimental-test-coverage',
  '--test-coverage-include=packages/core/dist/**/*.js',
  '--test-coverage-include=packages/agent-kit/dist/**/*.js',
  '--test-coverage-lines=88',
  '--test-coverage-branches=55',
  '--test-coverage-functions=65',
  'packages/core/test/*.test.mjs',
  'packages/agent-kit/test/*.test.mjs'
]
const result = spawnSync(process.execPath, args, { stdio: 'inherit', shell: true })
process.exit(result.status ?? 1)
