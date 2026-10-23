import { cpSync, existsSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const project = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const root = resolve(project, '../..')
export const dist = resolve(project, 'dist')
export const outputs = ['assets', '.nojekyll', '404.html', 'favicon.ico', 'icons.ico', 'index.html']

export function cleanOutputs() {
  for (const output of outputs) {
    rmSync(resolve(root, output), { recursive: true, force: true })
  }
}

export function syncOutputs() {
  for (const output of outputs) {
    if (!existsSync(resolve(dist, output))) {
      throw new Error(`Missing dist/${output}; run npm run build first.`)
    }
  }
  cleanOutputs()
  for (const output of outputs) {
    cpSync(resolve(dist, output), resolve(root, output), { recursive: true })
  }
  console.log(`Synced dist/ -> ${root}`)
}
