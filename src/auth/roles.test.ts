import type { AccountInfo } from '@azure/msal-browser'
import { describe, expect, it } from 'vitest'
import { hasAnyRole, rolesFromAccessToken, rolesOf } from './roles'

const jwt = (claims: object) => `h.${btoa(JSON.stringify(claims)).replace(/\+/g, '-').replace(/\//g, '_')}.s`

describe('rolesFromAccessToken', () => {
  it('lee el claim roles del payload del access token', () => {
    expect(rolesFromAccessToken(jwt({ roles: ['Admin', 'Bodega'] }))).toEqual(['Admin', 'Bodega'])
  })

  it('devuelve lista vacía si no hay roles o el token no es un JWT', () => {
    expect(rolesFromAccessToken(jwt({ aud: 'x' }))).toEqual([])
    expect(rolesFromAccessToken('no-es-un-jwt')).toEqual([])
  })
})

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
