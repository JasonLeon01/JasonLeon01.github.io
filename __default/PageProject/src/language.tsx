import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import type { Language } from './languageContext'
import { LanguageContext } from './languageContext'

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en')

    const value = useMemo(() => ({ language, setLanguage }), [language])

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
