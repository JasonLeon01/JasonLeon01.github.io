import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
/** Inline 20px home icon to avoid adding @mui/icons-material */
function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M9 21V12h6v9" />
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

/** Document entries keyed by language. Lexicographically sorted already. */
const DOCS: Record<LanguageKey, DocEntry[]> = {
  en_GB: [
    { filename: '01.Introduction.md', displayName: 'Introduction' },
    { filename: '02.Project and Runtime Structure.md', displayName: 'Project and Runtime Structure' },
    { filename: '03.Core Engine Classes.md', displayName: 'Core Engine Classes' },
    { filename: '04.Scenes.md', displayName: 'Scenes' },
    { filename: '05.Maps and Actors.md', displayName: 'Maps and Actors' },
    { filename: '06.UI and Windows.md', displayName: 'UI and Windows' },
    { filename: '07.Input.md', displayName: 'Input' },
    { filename: '08.Resources Audio and Effects.md', displayName: 'Resources, Audio and Effects' },
    { filename: '09.Data and Saves.md', displayName: 'Data and Saves' },
    { filename: '10.Node Functions and Events.md', displayName: 'Node Functions and Events' },
    { filename: '11.Configuration Reference.md', displayName: 'Configuration Reference' },
    { filename: '12.Packaging and Practical Notes.md', displayName: 'Packaging and Practical Notes' },
  ],
  zh_CN: [
    { filename: '01.介绍.md', displayName: '介绍' },
    { filename: '02.项目与运行时结构.md', displayName: '项目与运行时结构' },
    { filename: '03.Engine核心类.md', displayName: 'Engine 核心类' },
    { filename: '04.场景.md', displayName: '场景' },
    { filename: '05.地图与角色.md', displayName: '地图与角色' },
    { filename: '06.UI与窗口.md', displayName: 'UI 与窗口' },
    { filename: '07.输入.md', displayName: '输入' },
    { filename: '08.资源音频与效果.md', displayName: '资源、音频与效果' },
    { filename: '09.数据与存档.md', displayName: '数据与存档' },
    { filename: '10.节点函数与事件.md', displayName: '节点函数与事件' },
    { filename: '11.配置参考.md', displayName: '配置参考' },
    { filename: '12.打包与实用注意.md', displayName: '打包与实用注意' },
  ],
}

export type SelectedDoc =
  | { type: 'home' }
  | { type: 'doc'; lang: LanguageKey; entry: DocEntry }

type LudorkSidebarProps = {
  language: LanguageKey
  selected: SelectedDoc
  onSelect: (doc: SelectedDoc) => void
}

export default function LudorkSidebar({
  language,
  selected,
  onSelect,
}: LudorkSidebarProps) {
  const entries = DOCS[language]

  return (
    <Box
      className="ludork-sidebar"
      sx={{
        width: 280,
        minWidth: 280,
        height: '100vh',
        overflow: 'auto',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Ludork
        </Typography>
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
