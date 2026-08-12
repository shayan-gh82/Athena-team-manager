import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '@/store'
import App from './App'
import ThemeSync from '@/components/shared/ThemeSync'
import AppErrorBoundary from '@/components/shared/AppErrorBoundary'
import LocaleSync from '@/components/shared/LocaleSync'
import '@/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppErrorBoundary>
      <BrowserRouter>
        <ThemeSync/>
        <LocaleSync/>
        <App/>
      </BrowserRouter>
      </AppErrorBoundary>
    </Provider>
  </StrictMode>,
)
