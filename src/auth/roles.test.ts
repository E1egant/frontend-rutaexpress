import type { AccountInfo } from '@azure/msal-browser'
import { describe, expect, it } from 'vitest'
import { hasAnyRole, rolesOf } from './roles'

const account = (roles?: unknown) =>
  ({ idTokenClaims: roles === undefined ? {} : { roles } }) as unknown as AccountInfo

describe('rolesOf', () => {
  it('lee los roles del claim roles del ID token', () => {
    expect(rolesOf(account(['Admin', 'Auditor']))).toEqual(['Admin', 'Auditor'])
  })

  it('devuelve lista vacía si no hay cuenta o no hay claim', () => {
    expect(rolesOf(null)).toEqual([])
    expect(rolesOf(account())).toEqual([])
  })

  it('ignora un claim roles que no es lista', () => {
    expect(rolesOf(account('Admin'))).toEqual([])
  })
})

describe('hasAnyRole', () => {
  it('es verdadero si el usuario tiene alguno de los roles permitidos', () => {
    expect(hasAnyRole(['Cliente'], ['Admin', 'Cliente'])).toBe(true)
  })

  it('es falso si no tiene ninguno', () => {
    expect(hasAnyRole(['Cliente'], ['Admin', 'Auditor'])).toBe(false)
    expect(hasAnyRole([], ['Admin'])).toBe(false)
  })
})
