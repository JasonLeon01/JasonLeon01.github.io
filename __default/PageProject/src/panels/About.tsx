import { Box, Stack, Typography } from '@mui/material'

export default function AboutPanel() {
  const paragraphs = [
    `I am a Game Development Engineer currently at Tencent LightSpeed Studios. My professional journey has been driven by a passion for game engine architecture, graphics programming, and high-performance system tooling.`,
    `I hold a Master's degree in Software Engineering from Beijing Institute of Technology and a Bachelor's degree in Applied Physics from Northeastern University. My technical expertise includes experience with Unreal Engine, C++, and Python, with a particular focus on animation systems, shader optimization, and automation tools.`,
    `Beyond my professional role, I am an active indie developer and open-source contributor. I am currently developing Ludork, a 2D RPG engine built on PyQt5 and SFML3, and PySF-AutoGenerator, a tool for automating Python bindings using Clang AST. I am committed to building robust systems that solve real-world development challenges and push the boundaries of immersive player experiences.`,
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
        {paragraphs.map((paragraph) => (
          <Typography
            key={paragraph}
            component="p"
            variant="body1"
            sx={{
              fontSize: 16,
              lineHeight: 1.8,
              color: 'text.primary',
              fontFamily: 'Georgia, Times, serif',
              textAlign: 'justify',
              textIndent: '1.6em',
              width: '100%',
              whiteSpace: 'pre-line',
            }}
          >
            {paragraph}
          </Typography>
        ))}
      </Stack>
    </Box>
  )
}
