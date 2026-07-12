'use client'

import { Suspense, useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '../../lib/i18n/context'
import api from '../../lib/api/axios'
import { ENDPOINTS } from '../../lib/api/endpoints'

interface FormErrors {
  code?: string
  password?: string
  form?: string
}

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!email) {
      setErrors({ form: t('auth.missingEmailDesc') })
      return
    }
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setErrors({ code: 'Enter the 6-digit code' })
      return
    }
    if (password.length < 8) {
      setErrors({ password: t('dashboard.passwordLength') })
      return
    }

    setLoading(true)
    try {
      await api.post(ENDPOINTS.auth.resetPassword, { email, code, password })
      router.push('/login?reset=success')
    } catch (err: any) {
      const data = err?.response?.data
      if (data?.errors) {
        const fieldErrors: FormErrors = {}
        Object.keys(data.errors).forEach(key => {
          fieldErrors[key as keyof FormErrors] = data.errors[key][0]
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ form: data?.message || t('common.somethingWentWrong') })
      }
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return (
      <main className="page" style={{ justifyContent: 'center' }}>
        <div className="blob-container">
          <div className="blob blob-tl" />
          <div className="blob blob-br" />
        </div>
        <div className="form-card fade-up d2" style={{ textAlign: 'center' }}>
          <div className="form-title">{t('auth.missingEmail')}</div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {t('auth.missingEmailDesc')}
          </p>
          <Link href="/forgot-password" className="btn-login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            {t('auth.requestReset')}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="blob-container">
        <div className="blob blob-tl" />
        <div className="blob blob-br" />
      </div>

      <div className="logo fade-up d1">
        archive<br />outfitters
      </div>

      <div className="form-card fade-up d2">
        <div className="form-title" style={{ textAlign: 'center' }}>{t('auth.resetTitle')}</div>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {t('auth.resetDesc', { email })}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <div className="field-header">
              <label className="field-label" htmlFor="code">{t('auth.resetCodeLabel')}</label>
            </div>
            <div className="input-row">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setErrors({}) }}
                placeholder={t('auth.resetCodePlaceholder')}
                style={{ letterSpacing: '0.3em', fontWeight: 600 }}
              />
            </div>
            {errors.code && (
              <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.code}</p>
            )}
          </div>

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
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({}) }}
                placeholder={t('auth.newPasswordPlaceholder')}
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPw(s => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? (
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
              <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.password}</p>
            )}
          </div>

          {errors.form && (
            <p style={{ color: 'var(--error)', fontSize: '0.8rem', margin: '0.75rem 0', textAlign: 'center' }}>
              {errors.form}
            </p>
          )}

          <button type="submit" className="btn-login" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? t('auth.resetting') : t('auth.resetPassword')}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <Link href="/login" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>
            {t('auth.backToLogin')}
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  const { t } = useLanguage()
  return (
    <Suspense fallback={
      <main className="page" style={{ justifyContent: 'center' }}>
        <div className="blob-container">
          <div className="blob blob-tl" />
          <div className="blob blob-br" />
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{t('common.loading')}</p>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
