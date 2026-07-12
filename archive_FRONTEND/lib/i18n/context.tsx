'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Language, LANGUAGES, translations } from './translations'

type NestedRecord = { [key: string]: string | NestedRecord }

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (path: string, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (path: string) => path,
})

function resolve(obj: NestedRecord, path: string): string | undefined {
  const keys = path.split('.')
  let current: any = obj
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined
    current = current[key]
  }
  return typeof current === 'string' ? current : undefined
}

function interpolate(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text
  return text.replace(/{(\w+)}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`
  )
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null
    if (saved && LANGUAGES.some(l => l.code === saved)) {
      setLanguage(saved)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', language)
      document.documentElement.lang = language
    }
  }, [language, mounted])

  const t = (path: string, vars?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.en
    const result = resolve(dict as NestedRecord, path)
    if (result) return interpolate(result, vars)
    const fallback = resolve(translations.en as NestedRecord, path)
    return fallback ? interpolate(fallback, vars) : path
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
