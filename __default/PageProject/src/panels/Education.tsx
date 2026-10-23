import { Box, Stack, Typography } from '@mui/material'
import { infoByLanguage } from '../info'
import InfoSection from '../components/InfoSection'
import { useLanguage } from '../useLanguage'

export default function EducationPanel() {
  const { language } = useLanguage()

  const items = infoByLanguage[language].education
  const title = language === 'en' ? 'Education Experience' : '教育经历'

  return (
    <InfoSection title={title}>
      <Stack spacing={1.25} sx={{ width: '100%' }}>
        {items.map((item) => (
          <Box key={`${item.school}-${item.degree}`} sx={{ width: '100%' }}>
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
                {item.school}
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                {item.timeRange}
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: 15, color: 'text.primary' }}>
              {item.field} · {item.degree}
            </Typography>
          </Box>
        ))}
      </Stack>
    </InfoSection>
  )
}
