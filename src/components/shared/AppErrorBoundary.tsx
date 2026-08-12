import { Component, type ErrorInfo, type ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { translate } from '@/i18n'
import Button from '@/components/ui/Button'

type Props = { children: ReactNode }
type State = { hasError: boolean; message: string }

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }
  static getDerivedStateFromError(error: unknown): State { return { hasError: true, message: error instanceof Error ? error.message : 'An unexpected application error occurred.' } }
  componentDidCatch(error: unknown, info: ErrorInfo) { console.error('Athena UI error boundary', error, info) }
  render() {
    if (!this.state.hasError) return this.props.children
    const language = document.documentElement.lang === 'fa' ? 'fa' : 'en'
    const t = (value: string) => translate(value, language)
    return <main dir={language === 'fa' ? 'rtl' : 'ltr'} className="flex min-h-screen items-center justify-center bg-[rgb(var(--background))] p-6 text-[rgb(var(--text))]"><section className="app-card w-full max-w-lg p-8 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500"><TriangleAlert size={26}/></span><h1 className="mt-4 text-2xl font-bold">{t('Something went wrong')}</h1><p className="mt-2 text-sm" style={{color:'rgb(var(--muted))'}}>{t('Athena caught an unexpected UI error so the page does not fail silently.')}</p><div className={`${language === 'fa' ? 'text-right' : 'text-left'} mt-4 rounded-xl bg-[rgb(var(--surface-alt))] p-3 text-xs`}>{this.state.message}</div><div className="mt-5 flex justify-center gap-2"><Button variant="secondary" onClick={()=>this.setState({hasError:false,message:''})}>{t('Try again')}</Button><Button onClick={()=>window.location.reload()}>{t('Reload app')}</Button></div></section></main>
  }
}
