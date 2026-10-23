import { execFileSync, spawnSync } from 'node:child_process'
import { chmodSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { cleanOutputs, dist, outputs, project, root, syncOutputs } from './__default/PageProject/scripts/site-output.mjs'

function git(...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
}

function main() {
  const args = process.argv.slice(2)
  if (args.length > 1 || args.some((arg) => !['--commit', '--install-hook'].includes(arg))) {
    throw new Error('Usage: node build_page.mjs [--commit | --install-hook]')
  }
  if (args.includes('--install-hook')) {
    if (process.platform !== 'win32') chmodSync(resolve(root, '.githooks/pre-commit'), 0o755)
    git('config', '--local', 'core.hooksPath', '.githooks')
    console.log('Enabled .githooks/pre-commit for this checkout.')
    return
  }

  const commit = args.includes('--commit')
  if (commit) {
    const inputs = ['__default', 'build_page.mjs', 'build_page.bat', 'build_page.sh', '.githooks', '.gitattributes']
    if (git('diff', '--name-only', '--', ...inputs) ||
        git('ls-files', '--others', '--exclude-standard', '--', ...inputs)) {
      throw new Error('Stage all website build inputs before committing; partial staging is not supported.')
    }
  }

  cleanOutputs()
  rmSync(dist, { recursive: true, force: true })
  const result = spawnSync('npm run build', { cwd: project, stdio: 'inherit', shell: true })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error('Website build failed; export aborted.')
  syncOutputs()

  if (commit) git('add', '-A', '--', ...outputs)
}

try {
  main()
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
