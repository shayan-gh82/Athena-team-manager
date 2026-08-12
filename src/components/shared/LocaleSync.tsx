import { useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'

export default function LocaleSync() {
  const language = useAppSelector((s) => s.ui.language ?? 'en')

  useEffect(() => {
    const root = document.documentElement
    root.lang = language
    root.dir = language === 'fa' ? 'rtl' : 'ltr'
    root.classList.toggle('rtl', language === 'fa')
  }, [language])

  return null
}
