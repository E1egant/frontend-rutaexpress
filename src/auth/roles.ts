import type { AccountInfo } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'
import { useSyncExternalStore } from 'react'

export type Role = 'Admin' | 'Operador' | 'Bodega' | 'Despachador' | 'Cliente' | 'Auditor'

export const SHIPMENT_ROLES: Role[] = ['Admin', 'Operador', 'Bodega', 'Despachador', 'Cliente']
export const CATALOG_ROLES: Role[] = ['Admin', 'Operador', 'Bodega', 'Despachador']
export const STATUS_ROLES: Role[] = ['Admin', 'Operador', 'Bodega', 'Despachador']
export const CREATE_ROLES: Role[] = ['Admin', 'Operador', 'Despachador', 'Cliente']

export function rolesOf(account: AccountInfo | null): Role[] {
  const roles = account?.idTokenClaims?.roles
  return Array.isArray(roles) ? (roles as Role[]) : []
}

// Azure entrega los App roles de la API en el access token (aud = API), no en el ID token.
export function rolesFromAccessToken(token: string): Role[] {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const claims = JSON.parse(atob(payload)) as { roles?: unknown }
    return Array.isArray(claims.roles) ? (claims.roles as Role[]) : []
  } catch {
    return []
  }
}

let tokenRoles: Role[] = []
const listeners = new Set<() => void>()

export function setTokenRoles(accessToken: string) {
  tokenRoles = rolesFromAccessToken(accessToken)
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useRoles(): Role[] {
  const { accounts } = useMsal()
  const fromAccessToken = useSyncExternalStore(subscribe, () => tokenRoles)
  const fromIdToken = rolesOf(accounts[0] ?? null)
  return fromAccessToken.length ? fromAccessToken : fromIdToken
}

export function hasAnyRole(userRoles: Role[], allowed: Role[]): boolean {
  return allowed.some((r) => userRoles.includes(r))
}
