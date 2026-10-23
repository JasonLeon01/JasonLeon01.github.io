import type { Language } from './languageContext'

export function detectBrowserLanguage(
  browser: Pick<Navigator, 'languages' | 'language'> = navigator,
): Language {
  const preferences = browser.languages?.length ? browser.languages : [browser.language]

  for (const preference of preferences) {
    const language = preference.toLowerCase().split(/[-_]/)[0]
    if (language === 'en' || language === 'zh') return language
  }

  return 'en'
}
