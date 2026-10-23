import type { Language } from './languageContext'
import enEducation from './info/en/education.json'
import enWork from './info/en/work.json'
import enProjects from './info/en/projects/index.json'
import zhEducation from './info/zh/education.json'
import zhWork from './info/zh/work.json'
import zhProjects from './info/zh/projects/index.json'

type EducationItem = {
  school: string
  field: string
  degree: string
  timeRange: string
}

type WorkItem = {
  company: string
  role: string
  timeRange: string
  detail?: string
}

type ProjectItem = {
  key: string
  name: string
  summary: string
  href: string
  timeRange: string
  file: string
}

type SiteInfo = {
  about: string
  education: EducationItem[]
  work: WorkItem[]
  projects: (ProjectItem & { details: string })[]
}

const markdown = import.meta.glob<string>('./info/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function readMarkdown(language: Language, file: string): string {
  const path = `./info/${language}/${file}`
  const content = markdown[path]
  if (content === undefined) throw new Error(`Missing content: ${path}`)
  return content
}

function createInfo(
  language: Language,
  education: EducationItem[],
  work: WorkItem[],
  projects: ProjectItem[],
): SiteInfo {
  return {
    about: readMarkdown(language, 'about.md'),
    education,
    work,
    projects: projects.map((project) => ({
      ...project,
      details: readMarkdown(language, `projects/${project.file}`),
    })),
  }
}

export const infoByLanguage: Record<Language, SiteInfo> = {
  en: createInfo('en', enEducation, enWork, enProjects),
  zh: createInfo('zh', zhEducation, zhWork, zhProjects),
}
