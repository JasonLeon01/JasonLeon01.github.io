import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { CssBaseline, Divider, List, ListItem } from '@mui/material'
import { LanguageProvider } from './language.tsx'
import TopBar from './components/TopBar.tsx'
import AboutPanel from './panels/About.tsx'
import EducationPanel from './panels/Education.tsx'
import ContactPanel from './panels/SelfInfo.tsx'
import SelectedProjectsPanel from './panels/SelectedProjects.tsx'
import WorkExperiencePanel from './panels/WorkExperience.tsx'

type PanelDefinition = {
  key: string
  element: ReactNode
}

function App() {
  const panels: PanelDefinition[] = [
    { key: 'contact', element: <ContactPanel /> },
    { key: 'about', element: <AboutPanel /> },
    { key: 'education', element: <EducationPanel /> },
    { key: 'work', element: <WorkExperiencePanel /> },
    { key: 'projects', element: <SelectedProjectsPanel /> },
  ]

  return (
    <LanguageProvider>
      <CssBaseline />
      <TopBar />
      <List
        component="main"
        disablePadding
        sx={{
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 6, sm: 7, md: 8 },
          boxSizing: 'border-box',
          width: { xs: '100%', md: '85%' },
          maxWidth: 1400,
          mx: 'auto',
        }}
      >
        {panels.map((panel, index) => (
          <Fragment key={panel.key}>
            <ListItem
              component="div"
              disableGutters
              sx={{
                alignItems: 'stretch',
                width: '100%',
                overflow: 'visible',
              }}
            >
              {panel.element}
            </ListItem>
            {index < panels.length - 1 ? (
              <ListItem component="div" disableGutters sx={{ width: '100%', py: 2 }}>
                <Divider
                  flexItem
                  sx={{
                    width: '100%',
                    borderColor: 'divider',
                    opacity: 0.35,
                  }}
                />
              </ListItem>
            ) : null}
          </Fragment>
        ))}
      </List>
    </LanguageProvider>
  )
}

export default App
