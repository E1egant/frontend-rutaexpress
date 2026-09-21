import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import { CATALOG_ROLES, SHIPMENT_ROLES } from './auth/roles'
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
            <Route element={<ProtectedRoute allowed={SHIPMENT_ROLES} />}>
              <Route path="/shipments" element={<Shipments />} />
            </Route>
            <Route element={<ProtectedRoute allowed={CATALOG_ROLES} />}>
              <Route path="/catalog" element={<JsonView title="Catálogo de servicios" path="/api/catalog/services" />} />
            </Route>
            <Route element={<ProtectedRoute allowed={['Admin']} />}>
              <Route path="/reports" element={<JsonView title="Reportería" path="/api/reports/kpis" />} />
            </Route>
            <Route element={<ProtectedRoute allowed={['Admin', 'Auditor']} />}>
              <Route path="/audit" element={<JsonView title="Auditoría" path="/api/audit" />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
