import { Box, Button, Collapse, Link, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import type { Language } from '../languageContext'
import { useLanguage } from '../useLanguage'

type Project = {
    key: string
    name: Record<Language, string>
    href: string
    timeRange: Record<Language, string>
    summary: Record<Language, string>
    details: Record<Language, string>[]
}

export default function SelectedProjectsPanel() {
    const { language } = useLanguage()

    const projects: Project[] = useMemo(
        () => [
            {
                key: 'ludork',
                name: {
                    en: 'Ludork',
                    zh: 'Ludork',
                },
                href: 'https://jasonleon01.github.io/Ludork/',
                timeRange: {
                    en: '2025-09 ~ Present',
                    zh: '2025-09 ~ 至今',
                },
                summary: {
                    en: 'A game editor and native C++20 runtime for creating 2D role-playing games.',
                    zh: '面向 2D 角色扮演游戏创作的游戏编辑器与原生 C++20 运行时。',
                },
                details: [
                    {
                        en: 'Unified visual authoring for projects, maps, tilesets, actors, animations, curves, data, text configuration, and declarative UI.',
                        zh: '在统一编辑器内管理工程、地图、图块集、Actor、动画、曲线、数据、文本配置与声明式 UI；',
                    },
                    {
                        en: 'Blueprint graphs and Lua scripting on a C++20 runtime built with LuaSF and SFML.',
                        zh: '通过 Blueprint 图与 Lua 脚本编写玩法，运行时基于 LuaSF 与 SFML；',
                    },
                    {
                        en: 'GPU particle effects for actors and UI, plus world lighting with material-aware surfaces and shadows.',
                        zh: '为 Actor 与 UI 提供 GPU 粒子效果，并支持基于材质表面的世界光影与阴影；',
                    },
                    {
                        en: 'C# 13 editor plug-ins, plus Standalone and C++ Source templates (optional FFmpeg).',
                        zh: '支持 C# 13 编辑器插件，并提供 Standalone 与 C++ Source 工程模板（可选 FFmpeg）；',
                    },
                    {
                        en: 'Editor on Windows x64 and Apple Silicon macOS; games also package to iOS, HarmonyOS, and Android.',
                        zh: '编辑器支持 Windows x64 与 Apple Silicon macOS，游戏还可打包到 iOS、HarmonyOS 与 Android；',
                    },
                ],
            },
            {
                key: 'luasf-autogenerator',
                name: {
                    en: 'LuaSF-AutoGenerator',
                    zh: 'LuaSF-AutoGenerator',
                },
                href: 'https://github.com/JasonLeon01/LuaSF-AutoGenerator',
                timeRange: {
                    en: '2026-06 ~ Present',
                    zh: '2026-06 ~ 至今',
                },
                summary: {
                    en: 'An automated binding generator that exposes SFML to Lua through sol2.',
                    zh: '通过 sol2 将 SFML 暴露给 Lua 的自动化绑定生成器。',
                },
                details: [
                    {
                        en: 'Uses Clang AST to extract the SFML API and generate sol2 bindings, CMake files, and LuaLS stubs.',
                        zh: '使用 Clang AST 扫描 SFML API，生成 sol2 绑定、CMake 工程与 LuaLS stub；',
                    },
                    {
                        en: 'Produces a CMake LuaSF module that can be consumed from generated source or from collected embedded/extension packages.',
                        zh: '生成基于 CMake 的 LuaSF 模块，支持源码接入或收集后的嵌入式/扩展包接入；',
                    },
                    {
                        en: 'Embedded consumers link LuaSF::LuaSF; a plain Lua runtime can load the extension with require("LuaSF").',
                        zh: '嵌入式使用方链接 LuaSF::LuaSF，普通 Lua 运行时可通过 require("LuaSF") 加载扩展；',
                    },
                    {
                        en: 'Bridges std::function callbacks in a type-driven way, including the SoundSource.EffectProcessor audio-thread contract.',
                        zh: '按类型自动桥接 std::function 回调，并覆盖 SoundSource.EffectProcessor 的音频线程契约；',
                    },
                ],
            },
            {
                key: 'pysf-autogenerator',
                name: {
                    en: 'PySF-AutoGenerator',
                    zh: 'PySF-AutoGenerator',
                },
                href: 'https://github.com/JasonLeon01/PySF-AutoGenerator',
                timeRange: {
                    en: '2025-08 ~ Present',
                    zh: '2025-08 ~ 至今',
                },
                summary: {
                    en: 'An automated binding generator for SFML Python APIs.',
                    zh: '用于生成 SFML Python API 的自动化绑定生成器。',
                },
                details: [
                    {
                        en: 'Produces pybind11-based bindings for SFML from upstream source code.',
                        zh: '基于 SFML3 和 pybind11 制作的 SFML 接口 Python 自动化绑定工具；',
                    },
                    {
                        en: 'Scans SFML projects and generates binding code with consistent naming and structure.',
                        zh: '支持扫描 SFML 项目源码，生成 pybind11 绑定代码；',
                    },
                    {
                        en: 'Uses Clang AST to analyze dependencies and generate sources/CMakeLists in topological order.',
                        zh: '使用 Clang AST 扫描 SFML 项目，自动按照依赖的拓扑排序关系生成源文件和 CMakeLists；',
                    },
                ],
            },
            {
                key: 'anecdote',
                name: {
                    en: 'ANECDOTE (魔塔·ANECDOTE)',
                    zh: '魔塔·ANECDOTE',
                },
                href: 'https://github.com/JasonLeon01/Mota3',
                timeRange: {
                    en: '2023-01 ~ 2023-10',
                    zh: '2023-01 ~ 2023-10',
                },
                summary: {
                    en: 'A classic tower RPG with polished combat flow and responsive controls.',
                    zh: '一款经典魔塔 RPG，战斗流程顺滑，操作响应良好。',
                },
                details: [
                    {
                        en: 'Built with C++ and the lightweight EasyX graphics library.',
                        zh: '使用 C++ 和轻量级图形库 easyX 制作的传统风格魔塔类游戏，玩家会操控勇士在魔塔内探索，救出公主；',
                    },
                    {
                        en: 'Designed and implemented smooth combat pacing, input handling, and battle animations.',
                        zh: '游戏内有较为精美的战斗过程，实现了流畅的操作和战斗动画表现；',
                    },
                ],
            },
        ],
        [],
    )

    const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({})

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
                    {language === 'en' ? 'Selected Projects' : '精选项目'}
                </Typography>
                <Stack spacing={2} sx={{ width: '100%' }}>
                    {projects.map((project) => {
                        const isOpen = Boolean(openKeys[project.key])

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
                                        sx={{
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: 'text.primary',
                                            width: 'fit-content',
                                        }}
                                    >
                                        {project.name[language]}
                                    </Link>
                                    <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                                        {project.timeRange[language]}
                                    </Typography>
                                </Stack>

                                <Typography sx={{ fontSize: 15, color: 'text.primary', mt: 0.25 }}>
                                    {project.summary[language]}
                                </Typography>

                                <Button
                                    variant="text"
                                    size="small"
                                    sx={{
                                        px: 0,
                                        minWidth: 0,
                                        mt: 0.25,
                                        textTransform: 'none',
                                        fontSize: 13,
                                        color: 'text.secondary',
                                    }}
                                    onClick={() =>
                                        setOpenKeys((prev) => ({
                                            ...prev,
                                            [project.key]: !prev[project.key],
                                        }))
                                    }
                                >
                                    {language === 'en'
                                        ? isOpen
                                            ? '▼ View Detail'
                                            : '▶ View Detail'
                                        : isOpen
                                            ? '▼ 查看详情'
                                            : '▶ 查看详情'}
                                </Button>

                                <Collapse in={isOpen} timeout={180} unmountOnExit>
                                    <Stack spacing={0.75} sx={{ mt: 1 }}>
                                        {project.details.map((detail) => (
                                            <Typography
                                                key={`${project.key}-${detail.en}`}
                                                component="p"
                                                sx={{
                                                    m: 0,
                                                    fontSize: 14,
                                                    color: 'text.secondary',
                                                    lineHeight: 1.75,
                                                }}
                                            >
                                                · {detail[language]}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Collapse>
                            </Box>
                        )
                    })}
                </Stack>
            </Stack>
        </Box>
    )
}
