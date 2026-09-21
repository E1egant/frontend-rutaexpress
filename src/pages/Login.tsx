import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { Navigate } from 'react-router-dom'
import { loginRequest } from '../auth/msalConfig'

export default function Login() {
  const { instance } = useMsal()
  if (useIsAuthenticated()) return <Navigate to="/dashboard" replace />

  return (
    <div className="center">
      <div className="card" style={{ textAlign: 'center' }}>
        <h1>RutaExpress</h1>
        <p>Plataforma de envíos de última milla</p>
        <button onClick={() => instance.loginRedirect(loginRequest)}>Iniciar sesión con Microsoft</button>
      </div>
    </div>
  )
}
