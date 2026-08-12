import { Link } from 'react-router-dom'
import { useI18n } from '@/i18n'
import Button from '@/components/ui/Button'
export default function NotFoundPage(){const{t}=useI18n();return <div className="flex min-h-[70vh] items-center justify-center p-6"><div className="text-center"><div className="text-7xl font-black" style={{color:'rgb(var(--primary))'}}>404</div><h1 className="mt-4 text-2xl font-bold">{t('Page not found')}</h1><p className="mt-2" style={{color:'rgb(var(--muted))'}}>{t('The page you requested does not exist.')}</p><Link to="/dashboard"><Button className="mt-5">{t('Back to dashboard')}</Button></Link></div></div>}
