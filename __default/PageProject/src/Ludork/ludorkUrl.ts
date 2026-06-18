import type { LanguageKey } from './ludorkLanguages'
import {
  DEFAULT_LUDORK_LANGUAGE,
  detectLudorkLanguageFromBrowser,
  isLudorkLanguageKey,
} from './ludorkLanguages'

const LANG_PARAM = 'lang'
const DOC_PARAM = 'doc'
const PATH_PARAM = 'path'

export function parseLudorkLanguage(
  search = window.location.search,
): LanguageKey | null {
  const lang = new URLSearchParams(search).get(LANG_PARAM)
  if (lang && isLudorkLanguageKey(lang)) return lang
  return null
}

/** Language from URL when present, otherwise browser locale (default en_GB). */
export function resolveInitialLudorkLanguage(
  search = window.location.search,
): LanguageKey {
  return parseLudorkLanguage(search) ?? detectLudorkLanguageFromBrowser()
}

export { detectLudorkLanguageFromBrowser, DEFAULT_LUDORK_LANGUAGE }
export type { LanguageKey } from './ludorkLanguages'

/** Returns the doc sequence key from the URL, e.g. "01" or "chapter/02" */
export function parseLudorkDoc(search = window.location.search): string | null {
  return new URLSearchParams(search).get(DOC_PARAM)
}

/** Returns the free-navigate repo path from the URL, e.g. "Ludork/LICENSE.md" */
export function parseLudorkPath(search = window.location.search): string | null {
  return new URLSearchParams(search).get(PATH_PARAM)
}

export function isLudorkRoot(pathname = window.location.pathname): boolean {
  return /^\/Ludork\/?$/.test(pathname)
}

/** Sets the lang param while preserving the current doc/path selection. */
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

/** Sets or clears the doc key param (sidebar item selection). Also clears the path param. */
export function setLudorkDocInUrl(docKey: string | null, replace = false): void {
  const params = new URLSearchParams(window.location.search)
  params.delete(PATH_PARAM)
  if (docKey) {
    params.set(DOC_PARAM, docKey)
  } else {
    params.delete(DOC_PARAM)
  }
  const url = `${window.location.pathname}?${params.toString()}${window.location.hash}`
  if (replace) {
    history.replaceState(null, '', url)
  } else {
    history.pushState(null, '', url)
  }
}

/** Sets or clears the path param (free markdown-link navigation). Also clears the doc param. */
export function setLudorkPathInUrl(path: string | null, replace = false): void {
  const params = new URLSearchParams(window.location.search)
  params.delete(DOC_PARAM)
  if (path) {
    params.set(PATH_PARAM, path)
  } else {
    params.delete(PATH_PARAM)
  }
  const url = `${window.location.pathname}?${params.toString()}${window.location.hash}`
  if (replace) {
    history.replaceState(null, '', url)
  } else {
    history.pushState(null, '', url)
  }
}
