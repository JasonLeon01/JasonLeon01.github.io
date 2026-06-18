import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, CssBaseline, Drawer, FormControl, IconButton, MenuItem, Select, useMediaQuery, useTheme } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import LudorkSidebar, { fetchDocsIndex } from './LudorkSidebar'
import LudorkContent from './LudorkContent'
import { GitHubIcon, HomeIcon, MenuIcon } from './LudorkIcon'
import type { LanguageKey, SelectedDoc } from './LudorkSidebar'
import { LUDORK_LANGUAGES, LUDORK_LANGUAGE_KEYS } from './ludorkLanguages'
import {
  displayNameFromFile,
  flattenDocFilenames,
  resolveFilenameByDocKey,
} from './ludorkDocKey'
import {
  parseLudorkLanguage,
  parseLudorkDoc,
  parseLudorkPath,
  isLudorkRoot,
  resolveInitialLudorkLanguage,
  detectLudorkLanguageFromBrowser,
  setLudorkLanguageInUrl,
  setLudorkDocInUrl,
  setLudorkPathInUrl,
} from './ludorkUrl'
import './ludork.css'

const SIDEBAR_WIDTH = 280

function selectedFromDocKey(lang: LanguageKey, docKey: string): SelectedDoc {
  return {
    type: 'doc',
    lang,
    docKey,
    entry: { filename: '', displayName: docKey },
  }
}

/** Derive the initial SelectedDoc from URL params. */
function initialSelected(): SelectedDoc {
  const lang = resolveInitialLudorkLanguage()
  const docKey = parseLudorkDoc()
  if (docKey) return selectedFromDocKey(lang, docKey)
  return { type: 'home' }
}

export default function LudorkApp() {
  const [language, setLanguage] = useState<LanguageKey>(
    () => resolveInitialLudorkLanguage(),
  )
  const [selected, setSelected] = useState<SelectedDoc>(initialSelected)
  // Free-navigate path (e.g. "Ludork/LICENSE.md") — set by markdown link clicks
  const [freePath, setFreePath] = useState<string | null>(() => parseLudorkPath())

  // Responsive sidebar: auto-collapse below md (900px)
  const theme = useTheme()
  const isNarrow = useMediaQuery(theme.breakpoints.down('md'))
  const [collapsed, setCollapsed] = useState(isNarrow)

  useEffect(() => {
    setCollapsed(isNarrow)
  }, [isNarrow])

  const handleToggle = useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])

  useEffect(() => {
    document.title = 'Ludork'
  }, [])

  // Sync language from URL query param on first load; otherwise detect from browser locale
  useEffect(() => {
    const fromUrl = parseLudorkLanguage()
    if (fromUrl) {
      setLanguage(fromUrl)
      return
    }
    if (isLudorkRoot()) {
      const detected = detectLudorkLanguageFromBrowser()
      setLudorkLanguageInUrl(detected, true)
      setLanguage(detected)
    }
  }, [])

  // Resolve doc key to the actual filename for the current language.
  useEffect(() => {
    if (selected.type !== 'doc') return

    const { docKey } = selected
    let cancelled = false

    async function resolveDoc(): Promise<void> {
      try {
        const docs = await fetchDocsIndex(language)
        if (cancelled) return

        const filename = resolveFilenameByDocKey(flattenDocFilenames(docs), docKey)
        if (!filename) {
          setSelected({ type: 'home' })
          setLudorkDocInUrl(null, true)
          return
        }

        setSelected((prev) => {
          if (prev.type !== 'doc' || prev.docKey !== docKey) return prev
          return {
            type: 'doc',
            lang: language,
            docKey,
            entry: { filename, displayName: displayNameFromFile(filename) },
          }
        })
      } catch (err) {
        console.error('Failed to resolve doc key:', err)
      }
    }

    void resolveDoc()
    return () => { cancelled = true }
  }, [language, selected.type === 'doc' ? selected.docKey : null])

  useEffect(() => {
    const onPopState = () => {
      const lang = parseLudorkLanguage()
      if (!lang) return
      setLanguage(lang)

      const pathParam = parseLudorkPath()
      const docKey = parseLudorkDoc()

      if (pathParam) {
        setFreePath(pathParam)
        setSelected({ type: 'home' })
      } else if (docKey) {
        setFreePath(null)
        setSelected(selectedFromDocKey(lang, docKey))
      } else {
        setFreePath(null)
        setSelected({ type: 'home' })
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // When sidebar selection changes, update the URL.
  // On mobile, also close the drawer after selection.
  const handleSelect = (doc: SelectedDoc) => {
    setFreePath(null)
    setSelected(doc)
    if (doc.type === 'home') {
      setLudorkDocInUrl(null)
    } else {
      setLudorkDocInUrl(doc.docKey)
    }
    if (isNarrow) {
      setCollapsed(true)
    }
  }

  // When the user clicks a relative markdown link, update freePath and the URL.
  const handleNavigate = useCallback((targetPath: string) => {
    setFreePath(targetPath)
    setLudorkPathInUrl(targetPath)
  }, [])

  const contentPath = useMemo<string | null>(() => {
    if (freePath) return freePath
    if (selected.type === 'home') {
      return LUDORK_LANGUAGES[language].readmePath
    }
    if (!selected.entry.filename) return null
    return `Ludork/docs/${language}/${selected.entry.filename}`
  }, [selected, language, freePath])

  // Drawer paper styles shared across variants
  const drawerPaperSx = {
    width: SIDEBAR_WIDTH,
    boxSizing: 'border-box',
  }

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        {isNarrow ? (
          /* Mobile: overlay sidebar with backdrop (plain Box — no Drawer/Modal portal quirks) */
          !collapsed && (
            <>
              {/* Backdrop */}
              <Box
                onClick={() => setCollapsed(true)}
                sx={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 1199,
                  bgcolor: 'rgba(0,0,0,0.5)',
                }}
              />
              {/* Sidebar */}
              <Box
                sx={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: SIDEBAR_WIDTH,
                  zIndex: 1200,
                  display: 'flex',
                }}
              >
                <LudorkSidebar
                  language={language}
                  selected={selected}
                  onSelect={handleSelect}
                />
              </Box>
            </>
          )
        ) : (
          /* Desktop: permanent sidebar that pushes content; can be toggled */
          !collapsed && (
            <Drawer
              variant="permanent"
              sx={{
                width: SIDEBAR_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  ...drawerPaperSx,
                  position: 'relative',
                  height: '100vh',
                },
              }}
            >
              <LudorkSidebar
                language={language}
                selected={selected}
                onSelect={handleSelect}
                onToggle={handleToggle}
              />
            </Drawer>
          )
        )}

        {/* Floating expand button when sidebar is collapsed */}
        {collapsed && (
          <IconButton
            onClick={handleToggle}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 1200,
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'action.hover' },
            }}
            aria-label="Expand sidebar"
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          {/* Top bar with external links and language dropdown */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 0.5,
              px: 3,
              py: 1,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <IconButton
              component="a"
              href="https://github.com/JasonLeon01/Ludork"
              target="_blank"
              rel="noreferrer"
              size="small"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://jasonleon01.github.io/"
              target="_blank"
              rel="noreferrer"
              size="small"
              aria-label="Homepage"
            >
              <HomeIcon />
            </IconButton>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={language}
                onChange={(e: SelectChangeEvent) => {
                  const next = e.target.value as LanguageKey
                  setLanguage(next)
                  if (selected.type === 'doc') {
                    setSelected({
                      type: 'doc',
                      lang: next,
                      docKey: selected.docKey,
                      entry: { filename: '', displayName: selected.docKey },
                    })
                  }
                  setLudorkLanguageInUrl(next)
                }}
              >
                {LUDORK_LANGUAGE_KEYS.map((langKey) => (
                  <MenuItem key={langKey} value={langKey}>
                    {LUDORK_LANGUAGES[langKey].label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Scrollable content */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <LudorkContent path={contentPath} onNavigate={handleNavigate} />
          </Box>
        </Box>
      </Box>
    </>
  )
}
