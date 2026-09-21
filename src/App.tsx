import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import JsonView from './pages/JsonView'
import Login from './pages/Login'
import Shipments from './pages/Shipments'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route element={<ProtectedRoute allowed={['Admin', 'Despachador', 'Cliente']} />}>
              <Route path="/shipments" element={<Shipments />} />
            </Route>
            <Route element={<ProtectedRoute allowed={['Admin', 'Despachador']} />}>
              <Route path="/catalog" element={<JsonView title="Catálogo de servicios" path="/api/catalog/services" />} />
            </Route>
            <Route element={<ProtectedRoute allowed={['Admin']} />}>
              <Route path="/reports" element={<JsonView title="Reportería" path="/api/report/kpis?range=last24h" />} />
            </Route>
            <Route element={<ProtectedRoute allowed={['Admin', 'Auditor']} />}>
              <Route path="/audit" element={<JsonView title="Auditoría" path="/api/audit/events" />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
