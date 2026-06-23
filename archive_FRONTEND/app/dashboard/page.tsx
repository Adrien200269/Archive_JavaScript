'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  if (loading) {
    return (
      <main className="page" style={{ justifyContent: 'center' }}>
        <div className="blob-container">
          <div className="blob blob-tl" />
          <div className="blob blob-br" />
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Loading session…</p>
      </main>
    )
  }

  // Fallback if not loaded
  if (!user) return null

  // Generate initials for avatar fallback
  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  return (
    <main className="page" style={{ justifyContent: 'center' }}>
      <div className="blob-container">
        <div className="blob blob-tl" />
        <div className="blob blob-br" />
      </div>

      <div className="logo fade-up d1">
        archive<br />outfitters
      </div>

      <div className="form-card fade-up d2" style={{ textAlign: 'center', position: 'relative' }}>
        {/* Profile Avatar display */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--border)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            />
          ) : (
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '600',
                letterSpacing: '0.05em',
                border: '1px solid var(--border)'
              }}
            >
              {initials}
            </div>
          )}
        </div>

        <div className="form-title" style={{ marginBottom: '0.5rem' }}>Welcome, {user.fullName} 👋</div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Logged in as <strong>{user.email}</strong>
        </p>

        {/* Navigation Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          <Link href="/dashboard/profile" className="btn-register" style={{ height: '44px', textDecoration: 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Update Profile
          </Link>

          <Link href="/dashboard/password" className="btn-register" style={{ height: '44px', textDecoration: 'none', backgroundColor: '#555' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Change Password
          </Link>

          <button type="button" className="btn-login" onClick={handleLogout} style={{ height: '44px', marginTop: '0.5rem' }}>
            Log out
          </button>
        </div>
      </div>
    </main>
  )
}
