import { Box, Stack, Typography } from '@mui/material'

type EducationItem = {
  school: string
  field: string
  degree: string
  timeRange: string
}

export default function EducationPanel() {
  const items: EducationItem[] = [
    {
      school: 'Beijing Institute of Technology',
      field: 'Software Engineering',
      degree: "Master's",
      timeRange: '2023-09 ~ 2025-09',
    },
    {
      school: 'Northeastern University (Shenyang)',
      field: 'Applied Physics',
      degree: "Bachelor's",
      timeRange: '2019-09 ~ 2023-07',
    },
  ]

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
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Typography
          component="h2"
          sx={{
            m: 0,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: -0.2,
            color: 'text.primary',
          }}
        >
          Education Experience
        </Typography>
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
      </Stack>
    </Box>
  )
}
