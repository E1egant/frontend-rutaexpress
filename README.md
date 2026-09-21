# frontend-rutaexpress

Frontend de RutaExpress en React + Vite + TypeScript, con login de Azure AD mediante `@azure/msal-react`.

## Qué incluye

- Login y logout con Microsoft (OIDC, MSAL).
- Rutas protegidas por rol (`Admin`, `Despachador`, `Cliente`, `Auditor`), leído del claim `roles` del ID token.
- Cliente HTTP (`src/api/client.ts`) que obtiene el access token con `acquireTokenSilent` y lo envía como `Bearer` al BFF; si requiere interacción, redirige al login.
- Vistas: `/login`, `/dashboard`, `/shipments`, `/catalog`, `/reports`, `/audit`.

## Configuración

Copiar `.env.example` a `.env` y completar:

| Variable | Descripción |
|---|---|
| `VITE_TENANT_ID` | Tenant de Azure AD |
| `VITE_SPA_CLIENT_ID` | clientId de la App Registration del SPA |
| `VITE_API_SCOPE` | Scope de la API (`api://<API_CLIENT_ID>/access_as_user`) |
| `VITE_API_BASE_URL` | URL del API Gateway / BFF |

## Ejecutar

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
```

Coordinación entre repos, contratos y reglas de trabajo: repositorio `Cloud-Native-1`.
