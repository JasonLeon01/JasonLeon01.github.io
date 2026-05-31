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

export type LanguageKey = 'en_GB' | 'zh_CN'

const HOME_LABEL: Record<LanguageKey, string> = {
  en_GB: 'Home',
  zh_CN: '开始界面',
}

/** Shape of the generated docs-manifest.json */
type Manifest = Record<LanguageKey, DocEntry[]>

const MANIFEST_URL = '/Ludork/docs-manifest.json'

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
  const [docs, setDocs] = useState<Manifest | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(MANIFEST_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (!cancelled) setDocs(json)
      })
      .catch((err) => {
        if (!cancelled) console.error('Failed to load docs manifest:', err)
      })
    return () => { cancelled = true }
  }, [])

  const entries: DocEntry[] = docs?.[language] ?? []

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
        {entries.map((entry) => {
          const isSelected =
            selected.type === 'doc' &&
            selected.lang === language &&
            selected.entry.filename === entry.filename

          return (
            <ListItemButton
              key={entry.filename}
              selected={isSelected}
              onClick={() => onSelect({ type: 'doc', lang: language, entry })}
              sx={{ pl: 4 }}
            >
              <ListItemText
                primary={entry.displayName}
                slotProps={{ primary: { sx: { fontSize: 14, fontWeight: isSelected ? 600 : 400 } } }}
              />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )
}
