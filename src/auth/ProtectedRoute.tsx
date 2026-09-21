import { useIsAuthenticated } from '@azure/msal-react'
import { Navigate, Outlet } from 'react-router-dom'
import { hasAnyRole, useRoles, type Role } from './roles'

export default function ProtectedRoute({ allowed }: { allowed?: Role[] }) {
  const isAuthenticated = useIsAuthenticated()
  const roles = useRoles()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowed && !hasAnyRole(roles, allowed)) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
