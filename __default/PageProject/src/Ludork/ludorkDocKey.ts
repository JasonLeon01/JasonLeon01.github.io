import type { DocTreeItem } from './LudorkSidebar'

/** Extract leading numeric prefix from a path segment, e.g. "18.API说明" → "18", "02.Foo.md" → "02" */
function seqFromSegment(segment: string): string | null {
  const name = segment.replace(/\.md$/i, '')
  const match = name.match(/^(\d+)\./)
  return match ? match[1] : null
}

/** e.g. "01.Introduction.md" → "01", "18.API说明/02.NodeFunctions/02.Foo.md" → "18/02/02" */
export function docKeyFromFilename(filename: string): string {
  const parts = filename.split('/').filter(Boolean)
  const segments = parts.map((part) => seqFromSegment(part) ?? part)
  return segments.join('/')
}

export function resolveFilenameByDocKey(filenames: string[], docKey: string): string | null {
  return filenames.find((f) => docKeyFromFilename(f) === docKey) ?? null
}

export function flattenDocFilenames(items: DocTreeItem[]): string[] {
  const result: string[] = []
  for (const item of items) {
    if (item.type === 'doc') result.push(item.entry.filename)
    else result.push(...flattenDocFilenames(item.children))
  }
  return result
}

export function displayNameFromFile(filename: string): string {
  const base = filename.split('/').at(-1) ?? filename
  return base.replace(/\.md$/i, '').replace(/^\d+\.\s*/, '')
}
