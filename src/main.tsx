import { EventType, type AuthenticationResult } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { apiScopes, msalInstance } from './auth/msalConfig'
import { setTokenRoles } from './auth/roles'
import './index.css'

async function bootstrap() {
  await msalInstance.initialize()
  // Procesa el retorno de Microsoft antes de que el router cambie la URL y pierda el código.
  try {
    const result = await msalInstance.handleRedirectPromise()
    if (result?.account) msalInstance.setActiveAccount(result.account)
    if (result?.accessToken) setTokenRoles(result.accessToken)
  } catch (e) {
    console.error('Error al procesar el login', e)
  }

  const active = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0]
  if (active) {
    msalInstance.setActiveAccount(active)
    // Tras recargar la página no hay redirección: los roles se leen del access token en caché.
    try {
      const token = await msalInstance.acquireTokenSilent({ scopes: apiScopes, account: active })
      setTokenRoles(token.accessToken)
    } catch (e) {
      console.warn('No se pudo obtener el access token para leer los roles', e)
    }
  }

  msalInstance.addEventCallback((event) => {
    const payload = event.payload as AuthenticationResult | null
    if (event.eventType === EventType.LOGIN_SUCCESS && payload) {
      msalInstance.setActiveAccount(payload.account)
    }
    if (
      (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
      payload?.accessToken
    ) {
      setTokenRoles(payload.accessToken)
    }
  })

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </StrictMode>,
  )
}

void bootstrap()
