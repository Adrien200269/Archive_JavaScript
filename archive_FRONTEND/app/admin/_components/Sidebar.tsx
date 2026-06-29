'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin', label: 'Overview', exact: true, icon: '⊞' },
  { href: '/admin/users', label: 'Users', exact: false, icon: '👥' },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-logo">
          <span className="admin-sidebar-logo-mark" />
          <span className="admin-sidebar-logo-text">archive<br />outfitters</span>
        </div>
        <div className="admin-sidebar-badge">Admin</div>
      </div>

      <nav className="admin-sidebar-nav" aria-label="Admin sections">
        {NAV.map(({ href, label, exact, icon }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`admin-nav-link ${active ? 'admin-nav-link--active' : ''}`}
            >
              <span className="admin-nav-link-icon">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/dashboard" className="admin-sidebar-back">
          ← Back to app
        </Link>
      </div>
    </aside>
  )
}
