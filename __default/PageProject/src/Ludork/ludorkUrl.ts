import type { LanguageKey } from './LudorkSidebar'

const LANG_PARAM = 'lang'

export function parseLudorkLanguage(
  search = window.location.search,
): LanguageKey | null {
  const lang = new URLSearchParams(search).get(LANG_PARAM)
  if (lang === 'en_GB' || lang === 'zh_CN') return lang
  return null
}

export function isLudorkRoot(pathname = window.location.pathname): boolean {
  return /^\/Ludork\/?$/.test(pathname)
}

export function setLudorkLanguageInUrl(lang: LanguageKey, replace = false): void {
  const params = new URLSearchParams(window.location.search)
  params.set(LANG_PARAM, lang)
  const url = `${window.location.pathname}?${params.toString()}${window.location.hash}`
  if (replace) {
    history.replaceState(null, '', url)
  } else {
    history.pushState(null, '', url)
  }
}
