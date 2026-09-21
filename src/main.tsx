import { EventType, type AuthenticationResult } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { msalInstance } from './auth/msalConfig'
import './index.css'

msalInstance.initialize().then(() => {
  const active = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0]
  if (active) msalInstance.setActiveAccount(active)

  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      msalInstance.setActiveAccount((event.payload as AuthenticationResult).account)
    }
  })

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </StrictMode>,
  )
})
