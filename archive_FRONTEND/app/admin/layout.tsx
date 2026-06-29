import Sidebar from './_components/Sidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel – Archive Outfitters',
  description: 'Admin panel for managing Archive Outfitters users and content',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-content-area">
        <header className="admin-topbar">
          <div className="admin-topbar-inner">
            <p className="admin-topbar-label">Admin Panel</p>
          </div>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  )
}
