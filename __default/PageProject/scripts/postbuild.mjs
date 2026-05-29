import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dist = 'dist'

// SPA fallback for client-side routes on GitHub Pages
copyFileSync(`${dist}/index.html`, `${dist}/404.html`)

// Serve the React app at /Ludork/ instead of Jekyll-rendered README.md
mkdirSync(`${dist}/Ludork`, { recursive: true })
copyFileSync(`${dist}/index.html`, `${dist}/Ludork/index.html`)

// Disable Jekyll so static index.html and assets are served as-is
writeFileSync(`${dist}/.nojekyll`, '')

// Mirror bundled assets under /Ludork/assets/ so cached index.html that still
// references /Ludork/assets/* continues to work after base path changes.
const assetsDir = join(dist, 'assets')
const ludorkAssetsDir = join(dist, 'Ludork', 'assets')
mkdirSync(ludorkAssetsDir, { recursive: true })
for (const file of readdirSync(assetsDir)) {
  copyFileSync(join(assetsDir, file), join(ludorkAssetsDir, file))
}
