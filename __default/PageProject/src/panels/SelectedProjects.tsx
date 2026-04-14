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
                href: 'https://github.com/JasonLeon01/Ludork',
                timeRange: {
                    en: '2025-09 ~ Present',
                    zh: '2025-09 ~ 至今',
                },
                summary: {
                    en: 'A tilemap-based RPG engine with an editor/runtime workflow.',
                    zh: '一款基于瓦片地图的 RPG 引擎，包含编辑器/运行时一体化工作流。',
                },
                details: [
                    {
                        en: 'Python-first engine built on PyQt5 and SFML3 with a focus on rapid iteration.',
                        zh: '基于 PyQt5 和 SFML3 的 Python 绑定的 Tilemap 游戏引擎；',
                    },
                    {
                        en: 'Core features inspired by RPG Maker, plus extensible gameplay systems.',
                        zh: '支持类似 RPG Maker 的主要功能；',
                    },
                    {
                        en: 'High-performance particle system and voxel-style map support.',
                        zh: '支持高性能粒子系统和瓦片地图；',
                    },
                    {
                        en: 'Material-property-based lighting and screen-space reflection effects.',
                        zh: '支持基于材质属性的光影效果和镜面反射效果；',
                    },
                    {
                        en: 'Editor and runtime both support UE-style blueprint node graph editing and execution.',
                        zh: 'Editor 和 Runtime 层面均支持类UE蓝图的节点编辑和运行功能；',
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
