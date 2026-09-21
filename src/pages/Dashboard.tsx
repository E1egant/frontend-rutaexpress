import { useApi } from '../api/useApi'
import { SHIPMENT_ROLES, useRoles } from '../auth/roles'
import type { Shipment } from './Shipments'

export default function Dashboard() {
  const roles = useRoles()
  const canSeeShipments = roles.some((r) => SHIPMENT_ROLES.includes(r))

  return (
    <>
      <h2>Dashboard</h2>
      {canSeeShipments ? <RecentShipments /> : <div className="card">Sin información disponible para tu rol.</div>}
    </>
  )
}

function RecentShipments() {
  const { data, error, loading } = useApi<Shipment[]>('/api/shipments')
  const active = (data ?? []).filter((s) => !['DELIVERED', 'CANCELLED', 'FAILED'].includes(s.status))

  return (
    <div className="card">
      <h3>Envíos activos</h3>
      {loading && <p>Cargando…</p>}
      {error && <p className="error">{error}</p>}
      {data && <p>{active.length} envío(s) activo(s) de {data.length}.</p>}
    </div>
  )
}
