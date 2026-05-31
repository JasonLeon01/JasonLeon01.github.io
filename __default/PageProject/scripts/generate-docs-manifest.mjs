import { readdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const docsDir = join(__dirname, '..', 'public', 'Ludork', 'docs')
const outPath = join(__dirname, '..', 'public', 'Ludork', 'docs-manifest.json')

const LANGS = ['en_GB', 'zh_CN']

/**
 * Strip leading "NN." prefix and ".md" suffix to derive a display name.
 * "01.Introduction.md" → "Introduction"
 * "02.Editor Basics.md" → "Editor Basics"
 */
function displayName(filename) {
  const base = filename.replace(/\.md$/i, '')
  return base.replace(/^\d+\.\s*/, '')
}

/** Compare two filenames by their leading numeric prefix. */
function compareNumeric(a, b) {
  const numA = parseInt(a, 10) || 0
  const numB = parseInt(b, 10) || 0
  return numA - numB
}

export function generateManifest(docsRoot = docsDir, outputPath = outPath) {
  const manifest = {}

  for (const lang of LANGS) {
    const langDir = join(docsRoot, lang)
    let files
    try {
      files = readdirSync(langDir).filter((f) => f.endsWith('.md'))
    } catch {
      console.warn(`Docs directory not found: ${langDir}`)
      manifest[lang] = []
      continue
    }
    files.sort(compareNumeric)
    manifest[lang] = files.map((filename) => ({
      filename,
      displayName: displayName(filename),
    }))
    console.log(`  ${lang}: ${files.length} documents`)
  }

  writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf-8')
  console.log(`Wrote ${outputPath}`)
  return manifest
}

// Run directly: `node scripts/generate-docs-manifest.mjs`
const self = fileURLToPath(import.meta.url)
if (self === process.argv[1] || self.endsWith(process.argv[1])) {
  generateManifest()
}
