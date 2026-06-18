export type LudorkLanguageConfig = {
  label: string
  homeLabel: string
  readmePath: string
  /** Browser locale tags that map to this language (e.g. "zh", "zh_cn"). */
  localeKeys: readonly string[]
}

export const LUDORK_LANGUAGES = {
  en_GB: {
    label: 'English',
    homeLabel: 'Home',
    readmePath: 'Ludork/README.md',
    localeKeys: ['en', 'en_gb'],
  },
  zh_CN: {
    label: '简体中文',
    homeLabel: '开始界面',
    readmePath: 'Ludork/README_zh_CN.md',
    localeKeys: ['zh', 'zh_cn', 'zh_hans'],
  },
} as const satisfies Record<string, LudorkLanguageConfig>

export type LanguageKey = keyof typeof LUDORK_LANGUAGES

export const DEFAULT_LUDORK_LANGUAGE: LanguageKey = 'en_GB'

export const LUDORK_LANGUAGE_KEYS = Object.keys(LUDORK_LANGUAGES) as LanguageKey[]

export function isLudorkLanguageKey(value: string): value is LanguageKey {
  return value in LUDORK_LANGUAGES
}

function normalizeLocaleTag(tag: string): string {
  return tag.trim().replace(/-/g, '_').toLowerCase()
}

function localeMatches(locale: string, localeKey: string): boolean {
  const key = normalizeLocaleTag(localeKey)
  return locale === key || locale.startsWith(`${key}_`)
}

/** Map browser locale to a supported Ludork language; defaults to en_GB. */
export function detectLudorkLanguageFromBrowser(): LanguageKey {
  const candidates = [
    ...(typeof navigator !== 'undefined' ? navigator.languages ?? [] : []),
    typeof navigator !== 'undefined' ? navigator.language : '',
  ].filter(Boolean)

  for (const tag of candidates) {
    const locale = normalizeLocaleTag(tag)
    for (const langKey of LUDORK_LANGUAGE_KEYS) {
      const { localeKeys } = LUDORK_LANGUAGES[langKey]
      if (localeKeys.some((key) => localeMatches(locale, key))) {
        return langKey
      }
    }
  }
  return DEFAULT_LUDORK_LANGUAGE
}
