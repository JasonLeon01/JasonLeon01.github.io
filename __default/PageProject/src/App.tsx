import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { CssBaseline, Divider, List, ListItem } from '@mui/material'
import AboutPanel from './panels/About.tsx'
import EducationPanel from './panels/Education.tsx'
import HeroPanel from './panels/SelfInfo.tsx'
import SelectedProjectsPanel from './panels/SelectedProjects.tsx'
import WorkExperiencePanel from './panels/WorkExperience.tsx'

type PanelDefinition = {
  key: string
  element: ReactNode
}

function App() {
  const panels: PanelDefinition[] = [
    { key: 'hero', element: <HeroPanel /> },
    { key: 'about', element: <AboutPanel /> },
    { key: 'education', element: <EducationPanel /> },
    { key: 'work', element: <WorkExperiencePanel /> },
    { key: 'projects', element: <SelectedProjectsPanel /> },
  ]

  return (
    <>
      <CssBaseline />
      <List
        disablePadding
        sx={{
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 6, sm: 7, md: 8 },
          boxSizing: 'border-box',
          width: '85%',
          maxWidth: 1400,
          mx: 'auto',
        }}
      >
        {panels.map((panel, index) => (
          <Fragment key={panel.key}>
            <ListItem
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
              <ListItem disableGutters sx={{ width: '100%', py: 2 }}>
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
    </>
  )
}

export default App
