import { useApi } from '../api/useApi'

interface KpiReport {
  byStatus: Record<string, number>
  totalEvents: number
}

export default function Reports() {
  const { data, error, loading } = useApi<KpiReport>('/api/reports/kpis')
  const entries = Object.entries(data?.byStatus ?? {})
  const max = Math.max(1, ...entries.map(([, v]) => v))

  return (
    <>
      <h2>Reportería</h2>
      <div className="card">
        {loading && <p>Cargando…</p>}
        {error && <p className="error">{error}</p>}
        {data && (
          <>
            <p>Total de eventos: <strong>{data.totalEvents}</strong></p>
            <table>
              <thead>
                <tr><th>Estado</th><th>Envíos</th><th></th></tr>
              </thead>
              <tbody>
                {entries.map(([status, count]) => (
                  <tr key={status}>
                    <td>{status}</td>
                    <td>{count}</td>
                    <td style={{ width: '50%' }}>
                      <div style={{ background: '#0b5fff', height: '10px', width: `${(count / max) * 100}%`, borderRadius: '4px' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  )
}
