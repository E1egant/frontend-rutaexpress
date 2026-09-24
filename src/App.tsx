import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import { CATALOG_ROLES, SHIPMENT_ROLES } from './auth/roles'
import Layout from './components/Layout'
import Audit from './pages/Audit'
import Catalog from './pages/Catalog'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Reports from './pages/Reports'
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
              <Route path="/catalog" element={<Catalog />} />
            </Route>
            <Route element={<ProtectedRoute allowed={['Admin']} />}>
              <Route path="/reports" element={<Reports />} />
            </Route>
            <Route element={<ProtectedRoute allowed={['Admin', 'Auditor']} />}>
              <Route path="/audit" element={<Audit />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
