import { Box, Stack, Tab, Tabs } from '@mui/material'
import { useLanguage } from '../useLanguage'

export default function LanguagePanel() {
  const { language, setLanguage } = useLanguage()

  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2, md: 3 },
        textAlign: 'left',
      }}
    >
      <Stack spacing={1.5} sx={{ width: '100%' }}>
        <Tabs
          value={language}
          onChange={(_, value: 'en' | 'zh') => setLanguage(value)}
          variant="standard"
          centered
          sx={{
            minHeight: 36,
            '& .MuiTabs-flexContainer': {
              justifyContent: 'center',
            },
            '& .MuiTab-root': {
              minHeight: 36,
              textTransform: 'none',
              px: 1.25,
              py: 0.5,
              fontSize: 14,
            },
          }}
        >
          <Tab value="en" label="English" />
          <Tab value="zh" label="简体中文" />
        </Tabs>
      </Stack>
    </Box>
  )
}
