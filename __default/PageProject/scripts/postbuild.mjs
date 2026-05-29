import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'

const dist = 'dist'

// SPA fallback for client-side routes on GitHub Pages
copyFileSync(`${dist}/index.html`, `${dist}/404.html`)

// Serve the React app at /Ludork/ instead of Jekyll-rendered README.md
mkdirSync(`${dist}/Ludork`, { recursive: true })
copyFileSync(`${dist}/index.html`, `${dist}/Ludork/index.html`)

// Disable Jekyll so static index.html and assets are served as-is
writeFileSync(`${dist}/.nojekyll`, '')
