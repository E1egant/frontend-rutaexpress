import { LogLevel, PublicClientApplication, type Configuration } from '@azure/msal-browser'

const tenantId = import.meta.env.VITE_TENANT_ID ?? 'common'

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_SPA_CLIENT_ID ?? '',
    authority: `https://login.microsoftonline.com/${tenantId}/`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: `${window.location.origin}/login`,
  },
  cache: { cacheLocation: 'sessionStorage' },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: (_level, message, containsPii) => {
        if (!containsPii) console.warn(message)
      },
    },
  },
}

export const apiScopes = [import.meta.env.VITE_API_SCOPE ?? 'api://rutaexpress/access_as_user']

export const loginRequest = { scopes: ['openid', 'profile', ...apiScopes] }

export const msalInstance = new PublicClientApplication(msalConfig)
