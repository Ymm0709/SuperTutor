import { createContext, useContext, useState, useEffect } from 'react'
import { getLanguage, setLanguage as setLang, t } from '../utils/i18n'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => getLanguage())

  const changeLanguage = (lang) => {
    setLang(lang)
    setLanguageState(lang)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

