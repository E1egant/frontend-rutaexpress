import type { AccountInfo } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'

export type Role = 'Admin' | 'Despachador' | 'Cliente' | 'Auditor'

export function rolesOf(account: AccountInfo | null): Role[] {
  const roles = account?.idTokenClaims?.roles
  return Array.isArray(roles) ? (roles as Role[]) : []
}

export function useRoles(): Role[] {
  const { accounts } = useMsal()
  return rolesOf(accounts[0] ?? null)
}

export function hasAnyRole(userRoles: Role[], allowed: Role[]): boolean {
  return allowed.some((r) => userRoles.includes(r))
}
