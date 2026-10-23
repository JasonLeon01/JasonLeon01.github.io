import { Box, Stack, Typography } from '@mui/material'
import { infoByLanguage } from '../info'
import InfoSection from '../components/InfoSection'
import { useLanguage } from '../useLanguage'

export default function WorkExperiencePanel() {
  const { language } = useLanguage()

  const items = infoByLanguage[language].work
  const title = language === 'en' ? 'Work Experience' : '工作经历'

  return (
    <InfoSection title={title}>
      <Stack spacing={1.5} sx={{ width: '100%' }}>
        {items.map((item) => (
          <Box key={`${item.company}-${item.timeRange}`} sx={{ width: '100%' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 0.25, sm: 1.5 }}
              sx={{
                width: '100%',
                alignItems: { xs: 'flex-start', sm: 'baseline' },
                justifyContent: 'space-between',
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary' }}>
                {item.company}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                {item.timeRange}
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: 15, color: 'text.primary' }}>
              {item.role}
            </Typography>
            {item.detail ? (
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                {item.detail}
              </Typography>
            ) : null}
          </Box>
        ))}
      </Stack>
    </InfoSection>
  )
}
