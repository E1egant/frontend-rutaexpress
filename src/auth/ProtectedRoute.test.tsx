import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProtectedRoute from './ProtectedRoute'

const state = vi.hoisted(() => ({ authenticated: false, roles: [] as string[] }))

vi.mock('@azure/msal-react', () => ({
  useIsAuthenticated: () => state.authenticated,
  useMsal: () => ({ accounts: [{ idTokenClaims: { roles: state.roles } }] }),
}))

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>LOGIN</div>} />
        <Route path="/dashboard" element={<div>DASHBOARD</div>} />
        <Route element={<ProtectedRoute allowed={['Admin']} />}>
          <Route path="/reports" element={<div>REPORTES</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    state.authenticated = false
    state.roles = []
  })

  it('redirige al login si no hay sesión', () => {
    renderAt('/reports')
    expect(screen.getByText('LOGIN')).toBeTruthy()
  })

  it('redirige al dashboard si el rol no está permitido', () => {
    state.authenticated = true
    state.roles = ['Cliente']
    renderAt('/reports')
    expect(screen.getByText('DASHBOARD')).toBeTruthy()
  })

  it('muestra la ruta si el rol está permitido', () => {
    state.authenticated = true
    state.roles = ['Admin']
    renderAt('/reports')
    expect(screen.getByText('REPORTES')).toBeTruthy()
  })
})
