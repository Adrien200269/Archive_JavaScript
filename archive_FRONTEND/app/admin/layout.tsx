import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Sidebar from './_components/Sidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel – Archive Outfitters',
  description: 'Admin panel for managing Archive Outfitters users and content',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')?.value
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie)
      if (user?.role !== 'admin') {
        redirect('/dashboard')
      }
    } catch {
      redirect('/login')
    }
  } else {
    redirect('/login')
  }

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
