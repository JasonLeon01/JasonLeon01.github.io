import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { detectBrowserLanguage } from './browserLanguage'
import type { Language } from './languageContext'
import { LanguageContext } from './languageContext'

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(detectBrowserLanguage)

    useEffect(() => {
        document.documentElement.lang = language
    }, [language])

    const value = useMemo(() => ({ language, setLanguage }), [language])

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
