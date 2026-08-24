import { copyFileSync, writeFileSync } from 'node:fs'

const dist = 'dist'

// SPA fallback for client-side routes on GitHub Pages
copyFileSync(`${dist}/index.html`, `${dist}/404.html`)

// Disable Jekyll so static index.html and assets are served as-is
writeFileSync(`${dist}/.nojekyll`, '')
