'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { logoutAction } from '@/lib/actions/auth-action'
import api from '@/lib/api/axios'
import Modal from './Modal'

const NAV = [
  { href: '/admin', label: 'Overview', exact: true, icon: '⊞' },
  { href: '/admin/products', label: 'Products', exact: false, icon: '📦' },
  { href: '/admin/orders', label: 'Orders', exact: false, icon: '📋' },
  { href: '/admin/users', label: 'Users', exact: false, icon: '👥' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, updateUser } = useAuth()

  const [profileModal, setProfileModal] = useState(false)
  const [passwordModal, setPasswordModal] = useState(false)

  // Profile form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Password form state
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [profileMsg, setProfileMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user && profileModal) {
      setFullName(user.fullName || '')
      setEmail(user.email || '')
      setAvatarPreview(user.avatar || '')
      setAvatarFile(null)
      setProfileMsg('')
    }
  }, [user, profileModal])

  useEffect(() => {
    if (passwordModal) {
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMsg('')
    }
  }, [passwordModal])

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  const handleLogout = () => {
    logoutAction()
    router.replace('/login')
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMsg('')
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('fullName', fullName)
      formData.append('email', email)
      if (avatarFile) formData.append('avatar', avatarFile)
      const { data } = await api.put('/auth/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (data.success && data.data) {
        updateUser(data.data)
        setProfileMsg('Profile updated successfully!')
        setAvatarFile(null)
      } else {
        setProfileMsg(data.message || 'Failed to update profile.')
      }
    } catch (err: any) {
      setProfileMsg(err?.response?.data?.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMsg('')
    if (!oldPassword || !newPassword || newPassword.length < 8) {
      setPasswordMsg('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      const { data } = await api.put('/auth/update', { oldPassword, password: newPassword })
      if (data.success) {
        setPasswordMsg('Password updated successfully!')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordMsg(data.message || 'Failed to update password.')
      }
    } catch (err: any) {
      setPasswordMsg(err?.response?.data?.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A'

  return (
    <>
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

        <div className="admin-sidebar-footer" style={{ padding: '0.75rem 1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '0.75rem',
            padding: '0.5rem 0.5rem',
            borderRadius: '8px',
            backgroundColor: '#f5f5f3',
          }}>
            <div className="admin-avatar-circle" style={{ width: '34px', height: '34px', fontSize: '0.8rem', flexShrink: 0 }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" />
              ) : (
                initials
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--black)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName || 'Admin'}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email || ''}
              </p>
            </div>
          </div>

          <button
            onClick={() => setProfileModal(true)}
            className="admin-sidebar-back"
            style={{ width: '100%', textAlign: 'left', marginBottom: '0.25rem', fontSize: '0.78rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Update Profile
          </button>
          <button
            onClick={() => setPasswordModal(true)}
            className="admin-sidebar-back"
            style={{ width: '100%', textAlign: 'left', marginBottom: '0.25rem', fontSize: '0.78rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="admin-sidebar-back"
            style={{ width: '100%', textAlign: 'left', fontSize: '0.78rem', color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Update Profile Modal */}
      <Modal open={profileModal} onClose={() => setProfileModal(false)} title="Update Profile">
        <form onSubmit={handleProfileSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '80px', height: '80px', borderRadius: '50%', cursor: 'pointer',
                overflow: 'hidden', border: '2px solid #ddd', display: 'flex',
                alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f3',
              }}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--black)' }}>{initials}</span>
              )}
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: 'none', color: '#888', fontSize: '0.75rem', cursor: 'pointer', marginTop: '0.4rem' }}>
              Change Photo
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setAvatarFile(file)
                  setAvatarPreview(URL.createObjectURL(file))
                }
              }}
            />
          </div>

          <div className="admin-field">
            <label className="admin-label">Full Name</label>
            <input type="text" className="admin-input" value={fullName} onChange={e => setFullName(e.target.value)} required />
          </div>
          <div className="admin-field">
            <label className="admin-label">Email</label>
            <input type="email" className="admin-input" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          {profileMsg && (
            <p style={{ color: profileMsg.includes('successfully') ? '#27ae60' : '#c0392b', fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'center' }}>
              {profileMsg}
            </p>
          )}

          <div className="admin-modal-actions">
            <button type="button" onClick={() => setProfileModal(false)} className="admin-btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="admin-btn-primary">{submitting ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal open={passwordModal} onClose={() => setPasswordModal(false)} title="Change Password">
        <form onSubmit={handlePasswordSubmit}>
          <div className="admin-field">
            <label className="admin-label">Current Password</label>
            <input type="password" className="admin-input" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
          </div>
          <div className="admin-field">
            <label className="admin-label">New Password</label>
            <input type="password" className="admin-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Min 8 characters" />
          </div>
          <div className="admin-field">
            <label className="admin-label">Confirm New Password</label>
            <input type="password" className="admin-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>

          {passwordMsg && (
            <p style={{ color: passwordMsg.includes('successfully') ? '#27ae60' : '#c0392b', fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'center' }}>
              {passwordMsg}
            </p>
          )}

          <div className="admin-modal-actions">
            <button type="button" onClick={() => setPasswordModal(false)} className="admin-btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="admin-btn-primary">{submitting ? 'Updating…' : 'Change Password'}</button>
          </div>
        </form>
      </Modal>
    </>
  )
}
