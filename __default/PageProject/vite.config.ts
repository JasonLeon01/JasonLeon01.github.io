import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function docsManifestPlugin(): Plugin {
  const docsGlob = 'public/Ludork/docs/**/*.md'

  async function regenerate() {
    // @ts-expect-error .mjs import has no TS declaration
    const mod = await import('./scripts/generate-docs-manifest.mjs')
    mod.generateManifest()
  }

  return {
    name: 'docs-manifest',
    apply: (_config, env) => env.command === 'serve' || env.command === 'build',
    async buildStart() {
      await regenerate()
    },
    async configureServer(server) {
      // Generate once at startup, then watch for .md changes
      await regenerate()
      server.watcher.add(docsGlob)
      server.watcher.on('change', (file: string) => {
        if (file.endsWith('.md') && file.includes('Ludork')) {
          regenerate()
        }
      })
      server.watcher.on('add', (file: string) => {
        if (file.endsWith('.md') && file.includes('Ludork')) {
          regenerate()
        }
      })
      server.watcher.on('unlink', (file: string) => {
        if (file.endsWith('.md') && file.includes('Ludork')) {
          regenerate()
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), docsManifestPlugin()],
  // Assets live at /assets/; Ludork docs are static files under /Ludork/
  base: '/',
})
