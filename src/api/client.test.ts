import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api, ApiError } from './client'

vi.mock('../auth/msalConfig', () => ({
  apiScopes: ['api://test/access_as_user'],
  msalInstance: {
    getActiveAccount: () => ({ username: 'ana@example.com' }),
    getAllAccounts: () => [],
    acquireTokenSilent: vi.fn().mockResolvedValue({ accessToken: 'token-de-prueba' }),
  },
}))

describe('api client', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    fetchMock.mockReset()
    vi.unstubAllGlobals()
  })

  it('adjunta el access token como Bearer en cada llamada', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify([{ id: 1 }]), { status: 200 }))

    const data = await api<{ id: number }[]>('/api/shipments')

    expect(data).toEqual([{ id: 1 }])
    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toContain('/api/shipments')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer token-de-prueba')
  })

  it('lanza ApiError con el status cuando el backend responde 401 o 403', async () => {
    fetchMock.mockImplementation(() => Promise.resolve(new Response('sin permiso', { status: 403 })))

    await expect(api('/api/report/kpis')).rejects.toMatchObject({ status: 403 })
    await expect(api('/api/report/kpis')).rejects.toBeInstanceOf(ApiError)
  })
})
