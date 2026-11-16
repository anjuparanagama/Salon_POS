import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'
import './index.css'
import './lib/i18n'
import App from './App.tsx'
import { registerServiceWorker } from './pwa/registerServiceWorker'

// Register Progressive Web App service worker
registerServiceWorker()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
