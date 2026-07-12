'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '@/lib/i18n/context'
import api from '../../../lib/api/axios'

interface FormErrors {
  oldPassword?: string
  password?: string
  confirmPassword?: string
  form?: string
}

export default function PasswordUpdatePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { t } = useLanguage()

  const [oldPassword, setOldPassword] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  
  const [showOldPw, setShowOldPw] = useState<boolean>(false)
  const [showNewPw, setShowNewPw] = useState<boolean>(false)
  const [showConfPw, setShowConfPw] = useState<boolean>(false)

  const [errors, setErrors] = useState<FormErrors>({})
  const [successMsg, setSuccessMsg] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  if (loading) {
    return (
      <main className="page" style={{ justifyContent: 'center' }}>
        <div className="blob-container">
          <div className="blob blob-tl" />
          <div className="blob blob-br" />
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{t('dashboard.loadingSession')}</p>
      </main>
    )
  }

  if (!user) return null

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setSuccessMsg('')
    setSubmitting(true)

    // Form client-side validation
    let hasError = false
    const newErrors: FormErrors = {}

    if (!oldPassword) {
      newErrors.oldPassword = t('dashboard.passwordRequired')
      hasError = true
    }
    if (!password) {
      newErrors.password = 'New password is required'
      hasError = true
    } else if (password.length < 8) {
      newErrors.password = t('dashboard.passwordLength')
      hasError = true
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = t('dashboard.passwordConfirm')
      hasError = true
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('dashboard.passwordMatch')
      hasError = true
    }

    if (hasError) {
      setErrors(newErrors)
      setSubmitting(false)
      return
    }

    try {
      const { data } = await api.put('/auth/update', {
        oldPassword,
        password,
      })

      if (data.success) {
        setSuccessMsg(t('dashboard.passwordUpdated'))
        setOldPassword('')
        setPassword('')
        setConfirmPassword('')
      } else {
        setErrors({ form: data.message || t('dashboard.passwordUpdateFailed') })
      }
    } catch (err: any) {
      const respData = err?.response?.data
      if (respData?.errors) {
        const fieldErrors: FormErrors = {}
        Object.keys(respData.errors).forEach(key => {
          fieldErrors[key as keyof FormErrors] = respData.errors[key][0]
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ form: respData?.message || t('common.somethingWentWrong') })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page" style={{ justifyContent: 'center' }}>
      <div className="blob-container">
        <div className="blob blob-tl" />
        <div className="blob blob-br" />
      </div>

      <div className="logo fade-up d1">
        archive<br />outfitters
      </div>

      <div className="form-card fade-up d2" style={{ maxWidth: '400px' }}>
        <div className="form-title" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{t('dashboard.updatePassword')}</div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Current Password */}
          <div className="field">
            <div className="field-header">
              <label className="field-label" htmlFor="oldPassword">{t('auth.currentPassword')}</label>
            </div>
            <div className="input-row">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="oldPassword"
                type={showOldPw ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value)
                  if (errors.oldPassword) setErrors(prev => ({ ...prev, oldPassword: '' }))
                }}
                placeholder={t('auth.currentPassword')}
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowOldPw(s => !s)}
                aria-label={showOldPw ? 'Hide password' : 'Show password'}
              >
                {showOldPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.oldPassword && (
              <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                {errors.oldPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="field">
            <div className="field-header">
              <label className="field-label" htmlFor="password">{t('auth.newPassword')}</label>
            </div>
            <div className="input-row">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="password"
                type={showNewPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                }}
                placeholder={t('auth.newPasswordPlaceholder')}
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowNewPw(s => !s)}
                aria-label={showNewPw ? 'Hide password' : 'Show password'}
              >
                {showNewPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="field">
            <div className="field-header">
              <label className="field-label" htmlFor="confirmPassword">{t('auth.confirmNewPassword')}</label>
            </div>
            <div className="input-row">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="confirmPassword"
                type={showConfPw ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }))
                }}
                placeholder={t('auth.confirmPlaceholder2')}
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowConfPw(s => !s)}
                aria-label={showConfPw ? 'Hide password' : 'Show password'}
              >
                {showConfPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.form && (
            <p style={{ color: 'var(--error)', fontSize: '0.8rem', margin: '0.75rem 0', textAlign: 'center' }}>
              {errors.form}
            </p>
          )}

          {successMsg && (
            <p style={{ color: 'var(--success)', fontSize: '0.8rem', margin: '0.75rem 0', textAlign: 'center', fontWeight: '500' }}>
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            className="btn-login"
            disabled={submitting}
            style={{ opacity: submitting ? 0.7 : 1, marginTop: '1.25rem' }}
          >
            {submitting ? t('common.updating') : t('dashboard.changePassword')}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link href="/dashboard" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none', fontWeight: '500' }}>
            {t('dashboard.backToDashboard')}
          </Link>
        </div>
      </div>
    </main>
  )
}
