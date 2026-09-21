import type { AccountInfo } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'

export type Role = 'Admin' | 'Operador' | 'Bodega' | 'Despachador' | 'Cliente' | 'Auditor'

export const SHIPMENT_ROLES: Role[] = ['Admin', 'Operador', 'Bodega', 'Despachador', 'Cliente']
export const CATALOG_ROLES: Role[] = ['Admin', 'Operador', 'Bodega', 'Despachador']
export const STATUS_ROLES: Role[] = ['Admin', 'Operador', 'Bodega', 'Despachador']
export const CREATE_ROLES: Role[] = ['Admin', 'Operador', 'Despachador', 'Cliente']

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
