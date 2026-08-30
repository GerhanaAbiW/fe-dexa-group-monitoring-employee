import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/app'
import { env } from './config/env'
import { configureOpenApiClients } from './lib/openapi-fetch'
import './styles.css'

configureOpenApiClients({
  monitoringApiUrl: env.monitoringApiUrl,
  monitoringAdminApiKey: env.monitoringAdminApiKey,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
