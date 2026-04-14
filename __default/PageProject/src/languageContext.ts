import { createContext } from 'react'

export type Language = 'en' | 'zh'

export type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
