import { useApi } from '../api/useApi'

interface ServiceType {
  id: number
  name: string
  basePrice: number
  pricePerKm: number
  pricePerKg: number
  estimatedHours: number
}

interface FleetCapacity {
  id: number
  vehicleType: string
  maxWeightKg: number
  maxVolumeM3: number
  status: string
}

export default function Catalog() {
  const services = useApi<ServiceType[]>('/api/catalog/services')
  const fleet = useApi<FleetCapacity[]>('/api/catalog/fleet')

  return (
    <>
      <h2>Catálogo</h2>
      <div className="card">
        <h3>Servicios y tarifas</h3>
        {services.loading && <p>Cargando…</p>}
        {services.error && <p className="error">{services.error}</p>}
        <table>
          <thead>
            <tr>
              <th>Nombre</th><th>Tarifa base</th><th>$/km</th><th>$/kg</th><th>Horas estimadas</th>
            </tr>
          </thead>
          <tbody>
            {(services.data ?? []).map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td><td>{s.basePrice}</td><td>{s.pricePerKm}</td>
                <td>{s.pricePerKg}</td><td>{s.estimatedHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h3>Flota</h3>
        {fleet.loading && <p>Cargando…</p>}
        {fleet.error && <p className="error">{fleet.error}</p>}
        <table>
          <thead>
            <tr>
              <th>Tipo</th><th>Peso máx. (kg)</th><th>Volumen máx. (m³)</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {(fleet.data ?? []).map((f) => (
              <tr key={f.id}>
                <td>{f.vehicleType}</td><td>{f.maxWeightKg}</td><td>{f.maxVolumeM3}</td><td>{f.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
