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

const JSDELIVR_FLAT_API = 'https://data.jsdelivr.com/v1/package/gh/JasonLeon01/Ludork@main/flat'
const CACHE_PREFIX = 'ludork-docs-v4-'
const FETCH_TIMEOUT_MS = 10000

type JsDelivrFlatEntry = {
  name: string
}

type JsDelivrFlatResponse = {
  files?: JsDelivrFlatEntry[]
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

async function fetchDocsIndex(lang: LanguageKey): Promise<DocTreeItem[]> {
  const json = await fetchJson<JsDelivrFlatResponse>(JSDELIVR_FLAT_API)
  if (!Array.isArray(json.files)) throw new Error('Invalid jsDelivr flat tree response')

  const prefix = `docs/${lang}/`
  const docs = docsFromFilenames(
    json.files
      .map((entry) => normalizeDocPath(entry.name))
      .filter((name) => name.startsWith(prefix))
      .map((name) => name.slice(prefix.length)),
  )

  if (!docs.length) throw new Error(`No docs found for ${lang}`)
  return docs
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
