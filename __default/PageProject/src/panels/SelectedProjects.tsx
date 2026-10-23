import { Box, Button, Collapse, Link, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import InfoSection from '../components/InfoSection'
import MarkdownContent from '../components/MarkdownContent'
import { infoByLanguage } from '../info'
import { useLanguage } from '../useLanguage'

export default function SelectedProjectsPanel() {
  const { language } = useLanguage()
  const { projects } = infoByLanguage[language]
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({})

  return (
    <InfoSection title={language === 'en' ? 'Selected Projects' : '精选项目'}>
      <Stack spacing={2} sx={{ width: '100%' }}>
        {projects.map((project) => {
          const isOpen = Boolean(openKeys[project.key])
          const detailsId = 'project-' + project.key + '-details'

          return (
            <Box key={project.key} sx={{ width: '100%' }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 0.25, sm: 1.5 }}
                sx={{
                  width: '100%',
                  alignItems: { xs: 'flex-start', sm: 'baseline' },
                  justifyContent: 'space-between',
                }}
              >
                <Link
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  underline="hover"
                  sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary', width: 'fit-content' }}
                >
                  {project.name}
                </Link>
                <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                  {project.timeRange}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: 15, color: 'text.primary', mt: 0.25 }}>
                {project.summary}
              </Typography>
              <Button
                variant="text"
                size="small"
                aria-expanded={isOpen}
                aria-controls={isOpen ? detailsId : undefined}
                sx={{ px: 0, minWidth: 0, mt: 0.25, textTransform: 'none', fontSize: 13, color: 'text.secondary' }}
                onClick={() => setOpenKeys((prev) => ({ ...prev, [project.key]: !prev[project.key] }))}
              >
                {isOpen ? '▼' : '▶'} {language === 'en' ? 'View Detail' : '查看详情'}
              </Button>
              <Collapse in={isOpen} timeout={180} unmountOnExit>
                <Box id={detailsId} sx={{ mt: 1, fontSize: 14, color: 'text.secondary' }}>
                  <MarkdownContent>{project.details}</MarkdownContent>
                </Box>
              </Collapse>
            </Box>
          )
        })}
      </Stack>
    </InfoSection>
  )
}
