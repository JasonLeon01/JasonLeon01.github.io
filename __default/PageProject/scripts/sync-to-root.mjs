import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const root = join(dist, '..', '..', '..')

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true })
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const from = join(src, entry.name)
    const to = join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(from, to)
    } else {
      copyFileSync(from, to)
    }
  }
}

if (!existsSync(dist)) {
  console.error('dist/ not found — run npm run build first')
  process.exit(1)
}

copyFileSync(join(dist, 'index.html'), join(root, 'index.html'))
copyFileSync(join(dist, '404.html'), join(root, '404.html'))
copyFileSync(join(dist, '.nojekyll'), join(root, '.nojekyll'))
copyDir(join(dist, 'assets'), join(root, 'assets'))
copyDir(join(dist, 'Ludork'), join(root, 'Ludork'))

console.log(`Synced dist/ -> ${root}`)
