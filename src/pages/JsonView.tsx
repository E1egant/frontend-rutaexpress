import { useApi } from '../api/useApi'

export default function JsonView({ title, path }: { title: string; path: string }) {
  const { data, error, loading } = useApi<unknown>(path)

  return (
    <>
      <h2>{title}</h2>
      <div className="card">
        {loading && <p>Cargando…</p>}
        {error && <p className="error">{error}</p>}
        {data !== null && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </>
  )
}
