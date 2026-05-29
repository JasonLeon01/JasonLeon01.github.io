import { useEffect, useMemo, useState } from 'react'
import { Box, CssBaseline, FormControl, MenuItem, Select } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import LudorkSidebar from './LudorkSidebar'
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
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <LudorkSidebar
          language={language}
          selected={selected}
          onSelect={handleSelect}
        />
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
