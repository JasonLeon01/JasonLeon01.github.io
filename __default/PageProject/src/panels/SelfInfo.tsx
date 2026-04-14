import { Box, Link, Stack, SvgIcon, Typography } from '@mui/material'

export default function HeroPanel() {
  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3, md: 4 },
        textAlign: 'center',
      }}
    >
      <Stack spacing={1} sx={{ alignItems: 'center' }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 40, sm: 56, md: 72 },
            lineHeight: 1.1,
            fontWeight: 800,
            letterSpacing: { xs: -0.6, sm: -1, md: -1.2 },
            m: 0,
            color: 'text.primary',
          }}
        >
          JasonLeon's Homepage
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            jasonleonfm@gmail.com
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            |
          </Typography>
          <Link
            href="https://github.com/JasonLeon01/"
            target="_blank"
            rel="noreferrer"
            underline="hover"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: 14,
            }}
          >
            <SvgIcon
              viewBox="0 0 19 19"
              sx={{ fontSize: 18, color: 'text.secondary' }}
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844"
                clipRule="evenodd"
              />
            </SvgIcon>
            GitHub
          </Link>
        </Stack>
      </Stack>
    </Box>
  )
}
