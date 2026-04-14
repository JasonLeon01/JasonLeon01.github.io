import { Box, Stack, Typography } from '@mui/material'
import type { Language } from '../languageContext'
import { useLanguage } from '../useLanguage'

export default function AboutPanel() {
  const { language } = useLanguage()

  const paragraphsByLanguage: Record<Language, string[]> = {
    en: [
      `I am a Game Development Engineer currently at Tencent LightSpeed Studios, PUBGM Project Group. My work focuses on game client development, graphics rendering, and the construction and optimization of high-performance system toolchains.`,
      `My technical expertise includes experience with Unreal Engine, C++, and Python, with a particular focus on animation systems, shader optimization, and automation tools.`,
      `Beyond my professional role, I am an active indie developer and open-source contributor. I am currently developing Ludork, a 2D RPG engine built on PyQt5 and SFML3, and PySF-AutoGenerator, a tool for automating Python bindings using Clang AST. I am committed to building robust systems that solve real-world development challenges and push the boundaries of immersive player experiences.`,
    ],
    zh: [
      `我目前在腾讯光子工作室群 PUBGM 项目组担任游戏开发工程师。我的工作包括游戏客户端开发、图形渲染以及高性能系统工具链的构建与优化。`,
      `我的技术方向涵盖 Unreal Engine、C++ 与 Python，长期关注动画系统、着色器优化以及自动化工具研发。`,
      `除本职工作外，我也是一名独立开发者。目前我正在开发基于 PyQt5 与 SFML3 的 2D RPG 引擎 Ludork以及基于 Clang AST 的 Python 绑定自动生成工具 PySF-AutoGenerator。我希望通过构建可靠、可复用的系统来解决真实开发问题，并持续拓展沉浸式体验的边界。`,
    ],
  }

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
        {paragraphsByLanguage[language].map((paragraph) => (
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
