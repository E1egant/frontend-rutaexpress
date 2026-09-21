import { useState, type FormEvent } from 'react'
import { api } from '../api/client'
import { useApi } from '../api/useApi'
import { CREATE_ROLES, STATUS_ROLES, hasAnyRole, useRoles } from '../auth/roles'

export type ShipmentStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED'

export interface Shipment {
  id: number
  trackingNumber: string
  origin: string
  destination: string
  status: ShipmentStatus
  recipient: { name: string; phone: string; email: string; address: string }
  packageInfo: { weightKg: number; volumeM3: number; description: string }
}

const nextStatus: Partial<Record<ShipmentStatus, ShipmentStatus>> = {
  CREATED: 'ASSIGNED',
  ASSIGNED: 'PICKED_UP',
  PICKED_UP: 'IN_TRANSIT',
  IN_TRANSIT: 'DELIVERED',
}

const alternative: Partial<Record<ShipmentStatus, ShipmentStatus>> = {
  CREATED: 'CANCELLED',
  ASSIGNED: 'CANCELLED',
  PICKED_UP: 'FAILED',
  IN_TRANSIT: 'FAILED',
}

const emptyForm = { origin: '', destination: '', name: '', email: '', phone: '', address: '', weightKg: '1' }

export default function Shipments() {
  const { data, error, loading, reload } = useApi<Shipment[]>('/api/shipments')
  const roles = useRoles()
  const canChangeStatus = hasAnyRole(roles, STATUS_ROLES)
  const canCreate = hasAnyRole(roles, CREATE_ROLES)
  const [form, setForm] = useState(emptyForm)
  const [actionError, setActionError] = useState<string | null>(null)

  const set = (key: keyof typeof emptyForm) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  async function run(action: () => Promise<unknown>) {
    try {
      setActionError(null)
      await action()
      reload()
    } catch (e) {
      setActionError((e as Error).message)
    }
  }

  function create(e: FormEvent) {
    e.preventDefault()
    void run(async () => {
      await api('/api/shipments', {
        method: 'POST',
        body: JSON.stringify({
          origin: form.origin,
          destination: form.destination,
          recipient: { name: form.name, email: form.email, phone: form.phone, address: form.address },
          packageInfo: { weightKg: Number(form.weightKg), volumeM3: 0, description: '' },
        }),
      })
      setForm(emptyForm)
    })
  }

  const changeStatus = (id: number, status: ShipmentStatus) =>
    run(() => api(`/api/shipments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }))

  return (
    <>
      <h2>Envíos</h2>
      {canCreate && (
        <form className="card" onSubmit={create}>
          <input placeholder="Origen" value={form.origin} onChange={set('origin')} required />
          <input placeholder="Destino" value={form.destination} onChange={set('destination')} required />
          <input placeholder="Destinatario" value={form.name} onChange={set('name')} required />
          <input placeholder="Email" type="email" value={form.email} onChange={set('email')} />
          <input placeholder="Teléfono" value={form.phone} onChange={set('phone')} />
          <input placeholder="Dirección" value={form.address} onChange={set('address')} required />
          <input placeholder="Peso (kg)" type="number" min="0" step="0.1" value={form.weightKg} onChange={set('weightKg')} />
          <button type="submit">Crear envío</button>
        </form>
      )}
      {(error || actionError) && <p className="error">{error ?? actionError}</p>}
      <div className="card">
        {loading && <p>Cargando…</p>}
        <table>
          <thead>
            <tr>
              <th>Tracking</th><th>Origen</th><th>Destino</th><th>Destinatario</th><th>Estado</th>
              {canChangeStatus && <th />}
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((s) => (
              <tr key={s.id}>
                <td>{s.trackingNumber}</td><td>{s.origin}</td><td>{s.destination}</td>
                <td>{s.recipient?.name}</td><td>{s.status}</td>
                {canChangeStatus && (
                  <td>
                    {nextStatus[s.status] && (
                      <button onClick={() => void changeStatus(s.id, nextStatus[s.status]!)}>→ {nextStatus[s.status]}</button>
                    )}{' '}
                    {alternative[s.status] && (
                      <button className="secondary" onClick={() => void changeStatus(s.id, alternative[s.status]!)}>
                        {alternative[s.status]}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
