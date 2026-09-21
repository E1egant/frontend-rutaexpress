import { useState, type FormEvent } from 'react'
import { api } from '../api/client'
import { useApi } from '../api/useApi'
import { hasAnyRole, useRoles } from '../auth/roles'

export type ShipmentStatus = 'CREADO' | 'ACEPTADO' | 'EN_BODEGA' | 'EN_RUTA' | 'ENTREGADO' | 'CANCELADO'

export interface Shipment {
  id: number
  recipientName: string
  destinationAddress: string
  status: ShipmentStatus
}

const nextStatus: Partial<Record<ShipmentStatus, ShipmentStatus>> = {
  CREADO: 'ACEPTADO',
  ACEPTADO: 'EN_BODEGA',
  EN_BODEGA: 'EN_RUTA',
  EN_RUTA: 'ENTREGADO',
}

export default function Shipments() {
  const { data, error, loading, reload } = useApi<Shipment[]>('/api/shipments')
  const canChangeStatus = hasAnyRole(useRoles(), ['Admin', 'Despachador'])
  const [recipientName, setRecipientName] = useState('')
  const [destinationAddress, setDestinationAddress] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)

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
      await api('/api/shipments', { method: 'POST', body: JSON.stringify({ recipientName, destinationAddress }) })
      setRecipientName('')
      setDestinationAddress('')
    })
  }

  const changeStatus = (id: number, status: ShipmentStatus) =>
    run(() => api(`/api/shipments/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }))

  return (
    <>
      <h2>Envíos</h2>
      <form className="card" onSubmit={create}>
        <input placeholder="Destinatario" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
        <input placeholder="Dirección de destino" value={destinationAddress} onChange={(e) => setDestinationAddress(e.target.value)} required />
        <button type="submit">Crear envío</button>
      </form>
      {(error || actionError) && <p className="error">{error ?? actionError}</p>}
      <div className="card">
        {loading && <p>Cargando…</p>}
        <table>
          <thead>
            <tr><th>ID</th><th>Destinatario</th><th>Dirección</th><th>Estado</th>{canChangeStatus && <th />}</tr>
          </thead>
          <tbody>
            {(data ?? []).map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td><td>{s.recipientName}</td><td>{s.destinationAddress}</td><td>{s.status}</td>
                {canChangeStatus && (
                  <td>
                    {nextStatus[s.status] && (
                      <button onClick={() => void changeStatus(s.id, nextStatus[s.status]!)}>→ {nextStatus[s.status]}</button>
                    )}{' '}
                    {!['ENTREGADO', 'CANCELADO'].includes(s.status) && (
                      <button className="secondary" onClick={() => void changeStatus(s.id, 'CANCELADO')}>Cancelar</button>
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
