'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { useTheme } from '@/app/context/ThemeContext'
import { useLanguage } from '@/lib/i18n/context'
import { LANGUAGES } from '@/lib/i18n/translations'
import { logoutAction } from '@/lib/actions/auth-action'
import api from '@/lib/api/axios'
import Avatar from '@/app/components/Avatar'
import Modal from './Modal'

const NAV = (t: (p: string) => string) => [
  { href: '/admin', label: t('admin.overview'), exact: true, icon: '⊞' },
  { href: '/admin/analytics', label: t('admin.analytics'), exact: false, icon: '📊' },
  { href: '/admin/products', label: t('admin.products'), exact: false, icon: '📦' },
  { href: '/admin/orders', label: t('admin.orders'), exact: false, icon: '📋' },
  { href: '/admin/users', label: t('admin.users'), exact: false, icon: '👥' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, updateUser } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  const [profileModal, setProfileModal] = useState(false)
  const [passwordModal, setPasswordModal] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    window.location.href = '/login'
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
        setProfileMsg(t('admin.profileUpdated'))
        setAvatarFile(null)
      } else {
        setProfileMsg(data.message || t('admin.profileUpdateFailed'))
      }
    } catch (err: any) {
      setProfileMsg(t('common.somethingWentWrong'))
    } finally {
      setSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMsg('')
    if (!oldPassword || !newPassword || newPassword.length < 8) {
      setPasswordMsg(t('admin.passwordMinError'))
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg(t('admin.passwordMatchError'))
      return
    }
    setSubmitting(true)
    try {
      const { data } = await api.put('/auth/update', { oldPassword, password: newPassword })
      if (data.success) {
        setPasswordMsg(t('admin.passwordUpdated'))
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordMsg(data.message || t('admin.passwordUpdateFailed'))
      }
    } catch (err: any) {
      setPasswordMsg(t('common.somethingWentWrong'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <span className="admin-sidebar-logo-mark" />
            <span className="admin-sidebar-logo-text">archive<br />outfitters</span>
          </div>
          <div className="admin-sidebar-badge">{t('admin.adminBadge')}</div>
        </div>

        <nav className="admin-sidebar-nav" aria-label={t('admin.panel')}>
          {NAV(t).map(({ href, label, exact, icon }) => {
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.4rem 0.5rem 0.4rem',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--muted)' }}>
              {theme === 'dark' ? t('admin.darkMode') : t('admin.lightMode')}
            </span>
            <button
              onClick={toggleTheme}
              style={{
                position: 'relative',
                width: '40px',
                height: '22px',
                borderRadius: '11px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: theme === 'dark' ? 'var(--blue)' : 'var(--muted-light)',
                transition: 'background-color 0.25s ease',
                padding: 0,
                flexShrink: 0,
              }}
              aria-label="Toggle theme"
            >
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: theme === 'dark' ? '20px' : '2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  transition: 'left 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}
              >
                {theme === 'dark' ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--blue)" stroke="none">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#f39c12" stroke="none">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="12" y1="21" x2="12" y2="23" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="1" y1="12" x2="3" y2="12" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="21" y1="12" x2="23" y2="12" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#f39c12" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.4rem 0.5rem 0.6rem',
              marginBottom: '0.5rem',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--muted)' }}>
              {t('language.label')}
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.4rem',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                background: 'var(--card-bg)',
                color: 'var(--black)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '0.75rem',
              padding: '0.5rem 0.5rem',
              borderRadius: '8px',
              backgroundColor: 'var(--input-bg)',
            }}
          >
            <Avatar
              src={user?.avatar}
              name={user?.fullName || 'A'}
              size={34}
            />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--black)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName || t('admin.adminBadge')}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email || ''}
              </p>
            </div>
          </div>

          <button
            onClick={() => setProfileModal(true)}
            className="admin-sidebar-back"
            style={{ width: '100%', textAlign: 'left', marginBottom: '0.25rem', fontSize: '0.78rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {t('admin.updateProfile')}
          </button>
          <button
            onClick={() => setPasswordModal(true)}
            className="admin-sidebar-back"
            style={{ width: '100%', textAlign: 'left', marginBottom: '0.25rem', fontSize: '0.78rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {t('admin.changePassword')}
          </button>
          <button
            onClick={handleLogout}
            className="admin-sidebar-back"
            style={{ width: '100%', textAlign: 'left', fontSize: '0.78rem', color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {t('admin.signOut')}
          </button>
        </div>
      </aside>

      <Modal open={profileModal} onClose={() => setProfileModal(false)} title={t('admin.updateProfileTitle')}>
        <form onSubmit={handleProfileSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '80px', height: '80px', borderRadius: '50%', cursor: 'pointer',
                overflow: 'hidden', border: '2px solid var(--border)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--input-bg)',
              }}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Avatar src={user?.avatar} name={user?.fullName || 'A'} size={80} />
              )}
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.75rem', cursor: 'pointer', marginTop: '0.4rem' }}>
              {t('admin.changePhoto')}
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
            <label className="admin-label">{t('admin.fullNameLabel')}</label>
            <input type="text" className="admin-input" value={fullName} onChange={e => setFullName(e.target.value)} required />
          </div>
          <div className="admin-field">
            <label className="admin-label">{t('admin.emailLabel')}</label>
            <input type="email" className="admin-input" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          {profileMsg && (
            <p style={{ color: profileMsg.includes('successfully') || profileMsg.includes('सफल') || profileMsg.includes(' éxito') || profileMsg.includes('sucesso') || profileMsg.includes('更新') ? 'var(--success)' : 'var(--error)', fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'center' }}>
              {profileMsg}
            </p>
          )}

          <div className="admin-modal-actions">
            <button type="button" onClick={() => setProfileModal(false)} className="admin-btn-secondary">{t('common.cancel')}</button>
            <button type="submit" disabled={submitting} className="admin-btn-primary">{submitting ? t('common.saving') : t('common.save')}</button>
          </div>
        </form>
      </Modal>

      <Modal open={passwordModal} onClose={() => setPasswordModal(false)} title={t('admin.changePasswordTitle')}>
        <form onSubmit={handlePasswordSubmit}>
          <div className="admin-field">
            <label className="admin-label">{t('admin.currentPasswordLabel')}</label>
            <input type="password" className="admin-input" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
          </div>
          <div className="admin-field">
            <label className="admin-label">{t('admin.newPasswordLabel')}</label>
            <input type="password" className="admin-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder={t('admin.minChars')} />
          </div>
          <div className="admin-field">
            <label className="admin-label">{t('admin.confirmNewPasswordLabel')}</label>
            <input type="password" className="admin-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>

          {passwordMsg && (
            <p style={{ color: passwordMsg.includes('successfully') || passwordMsg.includes('सफल') || passwordMsg.includes('éxito') || passwordMsg.includes('sucesso') || passwordMsg.includes('更新') ? 'var(--success)' : 'var(--error)', fontSize: '0.8rem', marginBottom: '0.75rem', textAlign: 'center' }}>
              {passwordMsg}
            </p>
          )}

          <div className="admin-modal-actions">
            <button type="button" onClick={() => setPasswordModal(false)} className="admin-btn-secondary">{t('common.cancel')}</button>
            <button type="submit" disabled={submitting} className="admin-btn-primary">{submitting ? t('common.updating') : t('admin.changePassword')}</button>
          </div>
        </form>
      </Modal>
    </>
  )
}
