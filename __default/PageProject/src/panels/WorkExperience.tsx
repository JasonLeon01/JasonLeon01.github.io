import { Box, Stack, Typography } from '@mui/material'

type WorkItem = {
  company: string
  role: string
  timeRange: string
  detail?: string
}

export default function WorkExperiencePanel() {
  const items: WorkItem[] = [
    {
      company: 'NetEase (Hangzhou) Network Co., Ltd.',
      role: 'Game Development Engineer',
      timeRange: '2025-07 ~ 2026-04',
      detail: 'Where Winds Meet (燕云十六声) project team',
    },
    {
      company: 'ByteDance · Guangzhou Games Studio',
      role: 'Game Client Developer (Intern)',
      timeRange: '2025-01 ~ 2025-03',
    },
    {
      company: 'Tencent IEG · TiMi J5 Studio · Arashi project team',
      role: 'Game Client Developer (Intern)',
      timeRange: '2024-06 ~ 2024-09',
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
          Work Experience
        </Typography>
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
      </Stack>
    </Box>
  )
}
