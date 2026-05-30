import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, CssBaseline, FormControl, IconButton, MenuItem, Select, useMediaQuery, useTheme } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import LudorkSidebar, { MenuIcon } from './LudorkSidebar'
import LudorkContent from './LudorkContent'
import type { LanguageKey, SelectedDoc } from './LudorkSidebar'
import {
  parseLudorkLanguage,
  isLudorkRoot,
  setLudorkLanguageInUrl,
} from './ludorkUrl'
import './ludork.css'

export default function LudorkApp() {
  const [language, setLanguage] = useState<LanguageKey>(
    () => parseLudorkLanguage() ?? 'en_GB',
  )
  const [selected, setSelected] = useState<SelectedDoc>({ type: 'home' })
  // Free-navigate path (e.g. "Ludork/LICENSE.md") — set by markdown link clicks
  const [freePath, setFreePath] = useState<string | null>(null)

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

  // Normalize /Ludork/ → /Ludork/en_GB; sync language from URL on first load
  useEffect(() => {
    if (isLudorkRoot()) {
      setLudorkLanguageInUrl('en_GB', true)
      setLanguage('en_GB')
      return
    }
    const fromUrl = parseLudorkLanguage()
    if (fromUrl) setLanguage(fromUrl)
  }, [])

  useEffect(() => {
    const onPopState = () => {
      const fromUrl = parseLudorkLanguage()
      if (!fromUrl) return
      setLanguage(fromUrl)
      setFreePath(null)
      setSelected({ type: 'home' })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // When sidebar selection changes, clear any free-navigate override
  const handleSelect = (doc: SelectedDoc) => {
    setFreePath(null)
    setSelected(doc)
  }

  const contentPath = useMemo<string | null>(() => {
    if (freePath) return freePath
    if (selected.type === 'home') {
      return language === 'zh_CN' ? 'Ludork/README_zh_CN.md' : 'Ludork/README.md'
    }
    return `Ludork/docs/${selected.lang}/${selected.entry.filename}`
  }, [selected, language, freePath])

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <LudorkSidebar
          language={language}
          selected={selected}
          onSelect={handleSelect}
          collapsed={collapsed}
          onToggle={handleToggle}
        />
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
          {/* Top bar with language dropdown */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              px: 3,
              py: 1,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={language}
                onChange={(e: SelectChangeEvent) => {
                  const next = e.target.value as LanguageKey
                  setLanguage(next)
                  setFreePath(null)
                  setSelected({ type: 'home' })
                  setLudorkLanguageInUrl(next)
                }}
              >
                <MenuItem value="en_GB">English</MenuItem>
                <MenuItem value="zh_CN">简体中文</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Scrollable content */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <LudorkContent path={contentPath} onNavigate={setFreePath} />
          </Box>
        </Box>
      </Box>
    </>
  )
}
