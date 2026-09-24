import { useState, type FormEvent } from 'react'
import { useApi } from '../api/useApi'

interface AuditEntry {
  id: number
  shipmentId: number
  status: string
  occurredAt: string
}

export default function Audit() {
  const [shipmentId, setShipmentId] = useState('')
  const path = shipmentId ? `/api/audit?shipmentId=${shipmentId}` : '/api/audit'
  const { data, error, loading } = useApi<AuditEntry[]>(path)

  return (
    <>
      <h2>Auditoría</h2>
      <form
        className="card"
        onSubmit={(e: FormEvent) => e.preventDefault()}
      >
        <input
          placeholder="Filtrar por ID de envío"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
        />
      </form>
      <div className="card">
        {loading && <p>Cargando…</p>}
        {error && <p className="error">{error}</p>}
        <table>
          <thead>
            <tr><th>Envío</th><th>Estado</th><th>Fecha</th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((e) => (
              <tr key={e.id}>
                <td>{e.shipmentId}</td>
                <td>{e.status}</td>
                <td>{new Date(e.occurredAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
