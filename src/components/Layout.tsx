import { useMsal } from '@azure/msal-react'
import { NavLink, Outlet } from 'react-router-dom'
import { CATALOG_ROLES, SHIPMENT_ROLES, hasAnyRole, useRoles, type Role } from '../auth/roles'

const links: { to: string; label: string; roles?: Role[] }[] = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/shipments', label: 'Envíos', roles: SHIPMENT_ROLES },
  { to: '/catalog', label: 'Catálogo', roles: CATALOG_ROLES },
  { to: '/reports', label: 'Reportería', roles: ['Admin'] },
  { to: '/audit', label: 'Auditoría', roles: ['Admin', 'Auditor'] },
]

export default function Layout() {
  const { instance, accounts } = useMsal()
  const roles = useRoles()
  const account = accounts[0]

  return (
    <div className="layout">
      <nav className="sidebar">
        <strong style={{ marginBottom: '1rem' }}>RutaExpress</strong>
        {links
          .filter((l) => !l.roles || hasAnyRole(roles, l.roles))
          .map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        <div className="user">
          <div>{account?.name ?? account?.username}</div>
          <div>{roles.join(', ') || 'sin rol'}</div>
          <button className="secondary" style={{ marginTop: '.5rem' }} onClick={() => instance.logoutRedirect()}>
            Cerrar sesión
          </button>
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
