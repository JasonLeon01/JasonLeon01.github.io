import type { LanguageKey } from './LudorkSidebar'

const LANG_PATTERN = /^\/Ludork\/(en_GB|zh_CN)\/?$/

export function parseLudorkLanguage(
  pathname = window.location.pathname,
): LanguageKey | null {
  const match = pathname.match(LANG_PATTERN)
  return match ? (match[1] as LanguageKey) : null
}

export function isLudorkRoot(pathname = window.location.pathname): boolean {
  return /^\/Ludork\/?$/.test(pathname)
}

export function ludorkLanguagePath(lang: LanguageKey): string {
  return `/Ludork/${lang}`
}

export function setLudorkLanguageInUrl(lang: LanguageKey, replace = false): void {
  const path = ludorkLanguagePath(lang)
  const url = path + window.location.search + window.location.hash
  if (replace) {
    history.replaceState(null, '', url)
  } else {
    history.pushState(null, '', url)
  }
}
