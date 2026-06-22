'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, logoutAction } from '../../lib/actions/auth-action'
import { User } from '../../lib/types/auth'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const current = getCurrentUser()
    if (!current) {
      // not logged in -> bounce to login
      router.replace('/login')
      return
    }
    setUser(current)
    setChecked(true)
  }, [router])

  const handleLogout = () => {
    logoutAction()
    router.replace('/login')
  }

  if (!checked) return null

  return (
    <main className="page" style={{ justifyContent: 'center' }}>
      <div className="blob-container">
        <div className="blob blob-tl" />
        <div className="blob blob-br" />
      </div>

      <div className="logo fade-up d1">
        archive<br />outfitters
      </div>

      <div className="form-card fade-up d2" style={{ textAlign: 'center' }}>
        <div className="form-title">Welcome, {user?.fullName} 👋</div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          You are logged in as <strong>{user?.email}</strong>
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
          This is a protected dashboard. Your session is stored in a cookie.
        </p>
        <button type="button" className="btn-login" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </main>
  )
}
