import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'

export default function InfoSection({ title, children }: { title?: string; children: ReactNode }) {
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
        {title && (
          <Typography
            component="h2"
            sx={{ m: 0, fontSize: 20, fontWeight: 700, letterSpacing: -0.2, color: 'text.primary' }}
          >
            {title}
          </Typography>
        )}
        {children}
      </Stack>
    </Box>
  )
}
