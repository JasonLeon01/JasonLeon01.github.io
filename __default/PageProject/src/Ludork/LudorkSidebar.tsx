import { useMemo } from 'react'
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

/** Hardcoded docs index — mirrors https://github.com/JasonLeon01/Ludork/tree/main/docs */
const DOCS_MANIFEST: Record<LanguageKey, DocEntry[]> = {
  en_GB: [
    { filename: '01.Introduction.md', displayName: 'Introduction' },
    { filename: '02.Editor Basics.md', displayName: 'Editor Basics' },
    { filename: '03.Project Configuration and Assets.md', displayName: 'Project Configuration and Assets' },
    { filename: '04.Tilesets Autotiles and Maps.md', displayName: 'Tilesets Autotiles and Maps' },
    { filename: '05.Blueprints and Actors.md', displayName: 'Blueprints and Actors' },
    { filename: '06.Data Localisation Nodes and Testing.md', displayName: 'Data Localisation Nodes and Testing' },
    { filename: '07.Project and Runtime Structure.md', displayName: 'Project and Runtime Structure' },
    { filename: '08.Core Engine Classes.md', displayName: 'Core Engine Classes' },
    { filename: '09.Scenes.md', displayName: 'Scenes' },
    { filename: '10.Maps and Actors.md', displayName: 'Maps and Actors' },
    { filename: '11.UI and Windows.md', displayName: 'UI and Windows' },
    { filename: '12.Input.md', displayName: 'Input' },
    { filename: '13.Resources Audio and Effects.md', displayName: 'Resources Audio and Effects' },
    { filename: '14.Data and Saves.md', displayName: 'Data and Saves' },
    { filename: '15.Node Functions and Events.md', displayName: 'Node Functions and Events' },
    { filename: '16.Configuration Reference.md', displayName: 'Configuration Reference' },
    { filename: '17.Packaging and Practical Notes.md', displayName: 'Packaging and Practical Notes' },
  ],
  zh_CN: [
    { filename: '01.介绍.md', displayName: '介绍' },
    { filename: '02.编辑器基础.md', displayName: '编辑器基础' },
    { filename: '03.项目配置与素材.md', displayName: '项目配置与素材' },
    { filename: '04.图块自动图块与地图.md', displayName: '图块自动图块与地图' },
    { filename: '05.蓝图与角色.md', displayName: '蓝图与角色' },
    { filename: '06.数据本地化节点与测试.md', displayName: '数据本地化节点与测试' },
    { filename: '07.项目与运行时结构.md', displayName: '项目与运行时结构' },
    { filename: '08.Engine核心类.md', displayName: 'Engine核心类' },
    { filename: '09.场景.md', displayName: '场景' },
    { filename: '10.地图与角色.md', displayName: '地图与角色' },
    { filename: '11.UI与窗口.md', displayName: 'UI与窗口' },
    { filename: '12.输入.md', displayName: '输入' },
    { filename: '13.资源音频与效果.md', displayName: '资源音频与效果' },
    { filename: '14.数据与存档.md', displayName: '数据与存档' },
    { filename: '15.节点函数与事件.md', displayName: '节点函数与事件' },
    { filename: '16.配置参考.md', displayName: '配置参考' },
    { filename: '17.打包与实用注意.md', displayName: '打包与实用注意' },
  ],
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
  const entries: DocEntry[] = useMemo(() => DOCS_MANIFEST[language] ?? [], [language])

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
