import { useEffect, useState } from 'react'
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
/** Inline 20px home icon to avoid adding @mui/icons-material */
/** Inline chevron-left icon for collapse button */
function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

/** Inline 20px home icon to avoid adding @mui/icons-material */
function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

/** Inline hamburger menu icon for expand button */
export function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

export type DocEntry = {
  filename: string
  displayName: string
}

type DocTreeItem =
  | { type: 'folder'; path: string; displayName: string; children: DocTreeItem[] }
  | { type: 'doc'; entry: DocEntry }

export type LanguageKey = 'en_GB' | 'zh_CN'

const HOME_LABEL: Record<LanguageKey, string> = {
  en_GB: 'Home',
  zh_CN: '开始界面',
}

/** Strip leading "NN." prefix and ".md" suffix → display name. */
function displayName(filename: string): string {
  return filename.replace(/\.md$/i, '').replace(/^\d+\.\s*/, '')
}

/** Sort filenames by leading numeric prefix. */
function byNumericPrefix(a: string, b: string): number {
  return (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0)
}

const GITHUB_CONTENTS_API = 'https://api.github.com/repos/JasonLeon01/Ludork/contents/docs'
const JSDELIVR_FLAT_API = 'https://data.jsdelivr.com/v1/package/gh/JasonLeon01/Ludork@main/flat'
const GITHUB_GIT_TREES_API = 'https://api.github.com/repos/JasonLeon01/Ludork/git/trees/main?recursive=1'
const CACHE_PREFIX = 'ludork-docs-v3-'
const FETCH_TIMEOUT_MS = 10000

type GitHubContentEntry = {
  name: string
  type: string
  url?: string
}

type GitHubTreeEntry = {
  path: string
  type: 'blob' | 'tree' | string
}

type GitHubTreeResponse = {
  tree?: GitHubTreeEntry[]
  truncated?: boolean
}

type JsDelivrFlatResponse = {
  files?: JsDelivrFileEntry[]
}

type JsDelivrFileEntry = {
  name: string
}

function loadCache(lang: LanguageKey): DocTreeItem[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + lang)
    if (raw) return JSON.parse(raw) as DocTreeItem[]
  } catch { /* sessionStorage unavailable */ }
  return null
}

function saveCache(lang: LanguageKey, docs: DocTreeItem[]): void {
  try {
    sessionStorage.setItem(CACHE_PREFIX + lang, JSON.stringify(docs))
  } catch { /* quota exceeded or unavailable */ }
}

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      cache: 'no-cache',
      signal: controller.signal,
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json() as T
  } finally {
    clearTimeout(timeout)
  }
}

function normalizeDocPath(filename: string): string {
  return filename.replace(/\\/g, '/').replace(/^\/+/, '')
}

function compareTreeItems(a: DocTreeItem, b: DocTreeItem): number {
  const aName = a.type === 'folder' ? a.path.split('/').at(-1)! : a.entry.filename.split('/').at(-1)!
  const bName = b.type === 'folder' ? b.path.split('/').at(-1)! : b.entry.filename.split('/').at(-1)!
  const prefixDiff = byNumericPrefix(aName, bName)
  if (prefixDiff !== 0) return prefixDiff

  const aLabel = a.type === 'folder' ? a.displayName : a.entry.displayName
  const bLabel = b.type === 'folder' ? b.displayName : b.entry.displayName
  return aLabel.localeCompare(bLabel, undefined, { numeric: true, sensitivity: 'base' })
}

function sortTreeItems(items: DocTreeItem[]): void {
  items.sort(compareTreeItems)
  items.forEach((item) => {
    if (item.type === 'folder') sortTreeItems(item.children)
  })
}

function docsFromFilenames(filenames: string[]): DocTreeItem[] {
  const root: DocTreeItem[] = []
  const folders = new Map<string, Extract<DocTreeItem, { type: 'folder' }>>()

  filenames
    .map(normalizeDocPath)
    .filter((filename) => filename.endsWith('.md') && !filename.includes('//'))
    .forEach((filename) => {
      const parts = filename.split('/').filter(Boolean)
      if (!parts.length) return

      let siblings = root
      let folderPath = ''

      parts.slice(0, -1).forEach((folderName) => {
        folderPath = folderPath ? `${folderPath}/${folderName}` : folderName
        let folder = folders.get(folderPath)
        if (!folder) {
          folder = {
            type: 'folder',
            path: folderPath,
            displayName: displayName(folderName),
            children: [],
          }
          folders.set(folderPath, folder)
          siblings.push(folder)
        }
        siblings = folder.children
      })

      const leafName = parts.at(-1)!
      siblings.push({
        type: 'doc',
        entry: {
          filename,
          displayName: displayName(leafName),
        },
      })
    })

  sortTreeItems(root)
  return root
}

/** Primary: GitHub Git Trees API — one request, recursive, always live. */
async function fetchGitTreesDocsIndex(lang: LanguageKey): Promise<DocTreeItem[]> {
  const json = await fetchJson<GitHubTreeResponse>(GITHUB_GIT_TREES_API)
  if (!json.tree) throw new Error('Invalid GitHub git trees response')

  const prefix = `docs/${lang}/`
  const docs = docsFromFilenames(
    json.tree
      .filter((entry) => entry.type === 'blob' && entry.path.startsWith(prefix))
      .map((entry) => entry.path.slice(prefix.length)),
  )

  if (!docs.length) throw new Error(`No docs found for ${lang}`)
  return docs
}

/** Fallback 1: jsDelivr flat file list (CDN-cached, may lag behind GitHub). */
async function fetchJsDelivrDocsIndex(lang: LanguageKey): Promise<DocTreeItem[]> {
  const json = await fetchJson<JsDelivrFlatResponse>(JSDELIVR_FLAT_API)
  if (!json.files) throw new Error('Invalid jsDelivr file tree')

  const prefix = `/docs/${lang}/`
  const docs = docsFromFilenames(
    json.files
      .map((file) => file.name)
      .filter((name) => name.startsWith(prefix))
      .map((name) => name.slice(prefix.length)),
  )

  if (!docs.length) throw new Error(`No docs found for ${lang}`)
  return docs
}

/** Fallback 2: GitHub Contents API — recursive walk, multiple requests. */
async function fetchGitHubDocPaths(url: string, basePath = ''): Promise<string[]> {
  const json = await fetchJson<GitHubContentEntry[]>(url)
  const paths = await Promise.all(json.map(async (file) => {
    if (file.type === 'file') return [`${basePath}${file.name}`]
    if (file.type === 'dir' && file.url) {
      const nestedPaths = await fetchGitHubDocPaths(file.url, `${basePath}${file.name}/`)
      return nestedPaths
    }
    return []
  }))
  return paths.flat()
}

async function fetchGitHubDocsIndex(lang: LanguageKey): Promise<DocTreeItem[]> {
  return docsFromFilenames(await fetchGitHubDocPaths(`${GITHUB_CONTENTS_API}/${lang}`))
}

async function fetchDocsIndex(lang: LanguageKey): Promise<DocTreeItem[]> {
  try {
    return await fetchGitTreesDocsIndex(lang)
  } catch (gitTreesError) {
    console.warn('Failed to fetch docs index from GitHub git trees API:', gitTreesError)
    try {
      return await fetchJsDelivrDocsIndex(lang)
    } catch (jsDelivrError) {
      console.warn('Failed to fetch docs index from jsDelivr:', jsDelivrError)
      return fetchGitHubDocsIndex(lang)
    }
  }
}

export type SelectedDoc =
  | { type: 'home' }
  | { type: 'doc'; lang: LanguageKey; entry: DocEntry }

type LudorkSidebarProps = {
  language: LanguageKey
  selected: SelectedDoc
  onSelect: (doc: SelectedDoc) => void
  /** Optional toggle callback — when provided, a collapse button is shown in the header (desktop). */
  onToggle?: () => void
}

export default function LudorkSidebar({
  language,
  selected,
  onSelect,
  onToggle,
}: LudorkSidebarProps) {
  const [entries, setEntries] = useState<DocTreeItem[]>([])

  useEffect(() => {
    let cancelled = false

    async function loadDocs(): Promise<void> {
      // Show a cached list immediately, then still refresh from the remote tree.
      const cached = loadCache(language)
      if (cached) {
        if (!cancelled) setEntries(cached)
      } else if (!cancelled) {
        setEntries([])
      }

      try {
        const docs = await fetchDocsIndex(language)
        if (cancelled) return
        saveCache(language, docs)
        setEntries(docs)
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch docs index:', err)
      }
    }

    void loadDocs()
    return () => { cancelled = true }
  }, [language])

  return (
    <Box
      className="ludork-sidebar"
      sx={{
        width: 280,
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        whiteSpace: 'nowrap',
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2, pt: 2, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Ludork
        </Typography>
        {onToggle && (
          <IconButton onClick={onToggle} size="small" aria-label="Collapse sidebar">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* Doc list */}
      <List dense disablePadding sx={{ flex: 1, overflow: 'auto' }}>
        {/* Home / README entry */}
        <ListItemButton
          selected={selected.type === 'home'}
          onClick={() => onSelect({ type: 'home' })}
          sx={{ pl: 2, gap: 1 }}
        >
          <HomeIcon />
          <ListItemText
            primary={HOME_LABEL[language]}
            slotProps={{ primary: { sx: { fontSize: 14, fontWeight: selected.type === 'home' ? 600 : 400 } } }}
          />
        </ListItemButton>

        {/* Doc entries */}
        {entries.map((item) => renderTreeItem(item, language, selected, onSelect))}
      </List>
    </Box>
  )
}

function renderTreeItem(
  item: DocTreeItem,
  language: LanguageKey,
  selected: SelectedDoc,
  onSelect: (doc: SelectedDoc) => void,
  depth = 0,
) {
  if (item.type === 'folder') {
    return (
      <Box key={`folder-${item.path}`}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            pl: 2 + depth * 2,
            pr: 2,
            pt: depth === 0 ? 1.25 : 0.75,
            pb: 0.25,
            color: 'text.secondary',
            fontWeight: 700,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.displayName}
        </Typography>
        {item.children.map((child) => renderTreeItem(child, language, selected, onSelect, depth + 1))}
      </Box>
    )
  }

  const isSelected =
    selected.type === 'doc' &&
    selected.lang === language &&
    selected.entry.filename === item.entry.filename

  return (
    <ListItemButton
      key={item.entry.filename}
      selected={isSelected}
      onClick={() => onSelect({ type: 'doc', lang: language, entry: item.entry })}
      sx={{ pl: 4 + depth * 2 }}
    >
      <ListItemText
        primary={item.entry.displayName}
        slotProps={{
          primary: {
            sx: {
              fontSize: 14,
              fontWeight: isSelected ? 600 : 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          },
        }}
      />
    </ListItemButton>
  )
}
