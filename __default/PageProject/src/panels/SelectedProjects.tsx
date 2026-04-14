import { Box, Button, Collapse, Link, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'

type Project = {
    key: string
    name: string
    href: string
    timeRange: string
    summary: string
    details: string[]
}

export default function SelectedProjectsPanel() {
    const projects: Project[] = useMemo(
        () => [
            {
                key: 'ludork',
                name: 'Ludork',
                href: 'https://github.com/JasonLeon01/Ludork',
                timeRange: '2025-09 ~ Present',
                summary: 'A tilemap-based RPG engine with an editor/runtime workflow.',
                details: [
                    'Python-first engine built on PyQt5 and SFML3 with a focus on rapid iteration.',
                    'Core features inspired by RPG Maker, plus extensible gameplay systems.',
                    'High-performance particle system and voxel-style map support.',
                    'Material-property-based lighting and screen-space reflection effects.',
                    'Editor and runtime both support UE-style blueprint node graph editing and execution.',
                ],
            },
            {
                key: 'pysf-autogenerator',
                name: 'PySF-AutoGenerator',
                href: 'https://github.com/JasonLeon01/PySF-AutoGenerator',
                timeRange: '2025-08 ~ Present',
                summary: 'An automated binding generator for SFML Python APIs.',
                details: [
                    'Produces pybind11-based bindings for SFML from upstream source code.',
                    'Scans SFML projects and generates binding code with consistent naming and structure.',
                    'Uses Clang AST to analyze dependencies and generate sources/CMakeLists in topological order.',
                ],
            },
            {
                key: 'anecdote',
                name: 'ANECDOTE (魔塔·ANECDOTE)',
                href: 'https://github.com/JasonLeon01/Mota3',
                timeRange: '2023-01 ~ 2023-10',
                summary: 'A classic tower RPG with polished combat flow and responsive controls.',
                details: [
                    'Built with C++ and the lightweight EasyX graphics library.',
                    'Designed and implemented smooth combat pacing, input handling, and battle animations.',
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
                    Selected Projects
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
                                        {project.name}
                                    </Link>
                                    <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                                        {project.timeRange}
                                    </Typography>
                                </Stack>

                                <Typography sx={{ fontSize: 15, color: 'text.primary', mt: 0.25 }}>
                                    {project.summary}
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
                                    {isOpen ? '▼ View Detail' : '▶ View Detail'}
                                </Button>

                                <Collapse in={isOpen} timeout={180} unmountOnExit>
                                    <Stack spacing={0.75} sx={{ mt: 1 }}>
                                        {project.details.map((detail) => (
                                            <Typography
                                                key={detail}
                                                component="p"
                                                sx={{
                                                    m: 0,
                                                    fontSize: 14,
                                                    color: 'text.secondary',
                                                    lineHeight: 1.75,
                                                }}
                                            >
                                                · {detail}
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
